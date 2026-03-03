// ==============================================
// BathiXen Pro: Core Application Logic
// CEO: Eng. Kushan Prasanga | ThirdVisionPlus Engineering
// Version: 3.0.5 FINAL (Wax Coverage Fixed)
// ==============================================

import { db } from './firebase-init.js';
import { 
    doc, getDoc, updateDoc, setDoc, deleteDoc, 
    collection, getDocs 
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// HSOP calculator module එක import කරන්න (නිවැරදි path එක)
import { generateRecipeFromDatabase as generateRecipe, formatDatabaseRecipeHTML as formatRecipeHTML } from './hsop-calculator.js';

// ==============================================
// GLOBAL VARIABLES
// ==============================================
let allDyes = [];
let dyeSettings = JSON.parse(localStorage.getItem('bathiXen_dye_settings')) || {};
let currentUser = null;
let currentUserEmail = null;
let userPermissions = {};
let currentMethodology = "Reactive Dyeing";

// ==============================================
// CONSTANTS
// ==============================================
const METHOD_NAMES = [
    "Reactive Dyeing", "Vat Dyeing", "Napthol Dyeing", "Eco Batik", 
    "Silk Batik", "Java Lukis", "Shibori Technique", "Tie Dye",
    "Block Printing", "Screen Printing", "Spray Dyeing", "Ombre/Gradient",
    "Pigment Printing", "Ice Dyeing (Viral)", "Cyanotype (Sun Printing)"
];

const PACKAGES = ["None", "Basic", "Bronze", "Silver", "Gold", "Platinum"];

const PACKAGE_BENEFITS = {
    "None": [0, 0],
    "Basic": [5, 3],
    "Bronze": [15, 7],
    "Silver": [25, 30],
    "Gold": [50, 90],
    "Platinum": [100, 180]
};

const auxiliaries = {
    "WAX": ["Paraffin Wax", "Bee Wax", "Omini Wax", "Rosin", "Apex Wax"],
    "CHEMICALS": ["Soda Ash", "Glauber's Salt", "Soaping Agent", "Urea"],
    "UTILITIES": ["Water", "Firewood", "Electricity", "Labour Cost", "Transport"],
    "FABRICS": [
        { name: "Rayon (CR)", widths: ["45\"", "60\""] },
        { name: "Poplin (100% Cotton)", widths: ["36\"", "45\"", "58\""] },
        { name: "Super Voile (3)", widths: ["45\"", "50\""] },
        { name: "Super Voile (4)", widths: ["45\"", "50\"", "54\""] },
        { name: "Lanka Voile", widths: ["42\"", "45\""] },
        { name: "Blue Line (Voile)", widths: ["45\""] },
        { name: "Robin Voile", widths: ["45\""] },
        { name: "2/2 Voile", widths: ["45\"", "54\""] },
        { name: "Indian Voile", widths: ["44\"", "45\""] },
        { name: "Full Voile", widths: ["45\""] },
        { name: "Handloom Cotton", widths: ["36\"", "48\""] },
        { name: "Jubilee", widths: ["45\""] },
        { name: "Viscose Rayon", widths: ["45\"", "60\""] },
        { name: "Linen (Pure)", widths: ["45\"", "58\""] },
        { name: "Linen (Cotton Mix)", widths: ["45\"", "58\""] },
        { name: "Cambric", widths: ["45\"", "58\""] },
        { name: "Mulmul Cotton", widths: ["42\"", "45\""] },
        { name: "Twill Cotton", widths: ["45\"", "58\""] },
        { name: "Canvas (Light)", widths: ["36\"", "45\""] },
        { name: "Canvas (Heavy)", widths: ["36\"", "45\""] },
        { name: "Satin Cotton", widths: ["45\"", "58\""] },
        { name: "Double Gauze", widths: ["45\""] },
        { name: "Crinkle Rayon", widths: ["45\"", "50\""] },
        { name: "Jersey Cotton", widths: ["60\""] },
        { name: "Organdie", widths: ["44\"", "45\""] },
        { name: "Corduroy", widths: ["45\"", "58\""] }
    ]
};

// ==============================================
// MAKE GLOBALS AVAILABLE TO WINDOW
// ==============================================
window.db = db;
window.allDyes = allDyes;
window.dyeSettings = dyeSettings;
window.currentUser = currentUser;
window.currentUserEmail = currentUserEmail;
window.userPermissions = userPermissions;
window.currentMethodology = currentMethodology;

// ==============================================
// 1. AUTH & USER LOADING
// ==============================================
async function loadUserData() {
    const userEmail = localStorage.getItem('userEmail');
    const userDisplay = document.getElementById('user-info-display');
    
    if (!userEmail) {
        if (userDisplay) userDisplay.innerHTML = '● පිවිස නැත';
        return;
    }
    
    currentUserEmail = userEmail;
    window.currentUserEmail = userEmail;
    
    try {
        const userRef = doc(db, "users", userEmail);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
            currentUser = userSnap.data();
            window.currentUser = currentUser;
            
            if (userDisplay) {
                const roleText = currentUser.role === 'ADMIN' ? 'Admin' : 'User';
                userDisplay.innerHTML = `
                    <div style="width: 6px; height: 6px; background: #39ff14; border-radius: 50%; box-shadow: 0 0 5px #39ff14;"></div>
                    <span style="color: #39ff14; font-size: 10px; font-weight: bold;">${currentUser.name || 'User'} (${roleText})</span>
                `;
            }
            
            const adminBtn = document.getElementById('bAdmin');
            if (adminBtn && currentUser.role === 'ADMIN') {
                adminBtn.style.display = 'block';
            }
            
            await initializeUserPermissions();
            updateHeaderAndAccess();
            
        } else {
            if (userDisplay) userDisplay.innerHTML = '● ගිණුම හමු නොවීය';
        }
    } catch (error) {
        console.error('Error loading user:', error);
        if (userDisplay) userDisplay.innerHTML = '● Offline Mode';
    }
}

// ==============================================
// 2. INITIALIZE USER PERMISSIONS
// ==============================================
async function initializeUserPermissions() {
    if (!currentUser || !currentUserEmail) return;
    
    let needsUpdate = false;
    const now = new Date();
    
    if (!currentUser.permissions) {
        currentUser.permissions = {};
        needsUpdate = true;
    }
    
    METHOD_NAMES.forEach(method => {
        if (!currentUser.permissions[method]) {
            currentUser.permissions[method] = {
                package: "None",
                remainingHSOP: 0,
                activationDate: now.toISOString(),
                expirationDate: now.toISOString()
            };
            needsUpdate = true;
        } else {
            const perm = currentUser.permissions[method];
            if (perm.remainingHSOP === undefined && perm.package !== "None") {
                const benefits = PACKAGE_BENEFITS[perm.package] || PACKAGE_BENEFITS["None"];
                perm.remainingHSOP = benefits[0];
                needsUpdate = true;
            }
            if (!perm.activationDate) {
                perm.activationDate = now.toISOString();
                needsUpdate = true;
            }
            if (!perm.expirationDate && perm.package !== "None") {
                const days = PACKAGE_BENEFITS[perm.package][1];
                const expDate = new Date(perm.activationDate || now);
                expDate.setDate(expDate.getDate() + days);
                perm.expirationDate = expDate.toISOString();
                needsUpdate = true;
            }
        }
    });
    
    if (needsUpdate) {
        try {
            const userRef = doc(db, "users", currentUserEmail);
            await updateDoc(userRef, { permissions: currentUser.permissions });
            console.log("✅ Permissions initialized/updated");
        } catch (error) {
            console.error("Error updating permissions:", error);
        }
    }
    
    userPermissions = currentUser.permissions;
    window.userPermissions = userPermissions;
}

// ==============================================
// 3. CHECK ACCESS FOR CURRENT METHODOLOGY
// ==============================================
function getMethodologyAccess(methodology) {
    if (!currentUser) return { hasAccess: false, package: "None", remaining: 0, expired: false };
    
    if (currentUser.role === 'ADMIN') {
        return { hasAccess: true, package: "Admin", remaining: Infinity, expired: false };
    }
    
    const perm = userPermissions[methodology] || { package: "None", remainingHSOP: 0, expirationDate: new Date().toISOString() };
    const pkg = perm.package;
    
    if (pkg === "None") {
        return { hasAccess: false, package: "None", remaining: 0, expired: false };
    }
    
    const now = new Date();
    const expDate = new Date(perm.expirationDate || now);
    const expired = now > expDate;
    const remaining = perm.remainingHSOP || 0;
    const hasAccess = !expired && remaining > 0;
    
    return { hasAccess, package: pkg, remaining, expired };
}

// ==============================================
// ==============================================
// ==============================================
// ==============================================
// 4. UPDATE HEADER AND ACCESS (DARK TEXT FOR YELLOW BG)
// ==============================================
function updateHeaderAndAccess() {
    const methodSelector = document.getElementById('methodSelector');
    if (!methodSelector) return;
    
    const selectedMethod = methodSelector.value || currentMethodology;
    
    currentMethodology = selectedMethod;
    window.currentMethodology = selectedMethod;
    
    const access = getMethodologyAccess(selectedMethod);
    
    const navTitle = document.querySelector('.nav-title');
    if (navTitle) {
        let headerText = '';
        
        // Dark color styles for yellow background
        const darkStyle = {
            black: 'color: #000000; font-weight: 900;',
            darkGray: 'color: #222222; font-weight: bold;',
            darkRed: 'color: #8B0000; font-weight: bold;',
            darkGreen: 'color: #006400; font-weight: bold;',
            darkBlue: 'color: #00008B; font-weight: bold;',
            darkBrown: 'color: #4A2C2C; font-weight: bold;',
            darkPurple: 'color: #4B0082; font-weight: bold;',
            darkOrange: 'color: #8B4500; font-weight: bold;',
            darkCyan: 'color: #008B8B; font-weight: bold;'
        };
        
        // ✅ ADMIN CHECK
        if (currentUser && currentUser.role === 'ADMIN') {
            headerText = `
                <div style="font-size: 1.5rem; font-weight: 900; ${darkStyle.black} letter-spacing: 1px; line-height: 1.2;">
                    BathiXen ${selectedMethod} Pro
                </div>
                <div style="display: flex; align-items: center; gap: 10px; margin-top: 5px; flex-wrap: wrap;">
                    <span style="font-size: 1rem; font-weight: bold; ${darkStyle.darkGreen}">👑 ADMIN ACCESS</span>
                    <span style="background: #006400; color: white; padding: 2px 10px; border-radius: 20px; font-size: 0.8rem;">Unlimited</span>
                </div>
                <div style="font-size: 0.8rem; ${darkStyle.darkGray} margin-top: 5px;">
                    ⏰ ${new Date().toLocaleString('si-LK')}
                </div>
            `;
        }
        // ✅ PACKAGE EXISTS (Non-admin)
        else if (access.hasAccess) {
            const perm = userPermissions[selectedMethod] || {};
            const total = PACKAGE_BENEFITS[access.package]?.[0] || 0;
            const remaining = access.remaining;
            let expDateStr = 'N/A';
            
            if (perm.expirationDate) {
                try {
                    const expDate = new Date(perm.expirationDate);
                    if (!isNaN(expDate.getTime())) {
                        expDateStr = expDate.toLocaleDateString('si-LK');
                    }
                } catch (e) {}
            }
            
            // Package color mapping (dark colors)
            const packageColors = {
                'Platinum': darkStyle.darkPurple,
                'Gold': 'color: #8B4500; font-weight: bold;', // Dark orange
                'Silver': darkStyle.darkGray,
                'Bronze': darkStyle.darkBrown,
                'Basic': darkStyle.darkBlue,
                'default': darkStyle.darkGreen
            };
            
            const packageColor = packageColors[access.package] || packageColors.default;
            
            headerText = `
                <div style="font-size: 1.5rem; font-weight: 900; ${darkStyle.black} letter-spacing: 1px; line-height: 1.2;">
                    BathiXen ${selectedMethod} Pro
                </div>
                <div style="display: flex; align-items: center; gap: 15px; margin-top: 8px; flex-wrap: wrap;">
                    <div style="font-size: 1rem; font-weight: bold; ${packageColor} display: flex; align-items: center; gap: 5px;">
                        <span>📦</span> ${access.package} Package
                    </div>
                    <div style="font-size: 1rem; font-weight: bold; ${darkStyle.darkBlue} display: flex; align-items: center; gap: 5px;">
                        <span>🎯</span> ${remaining}/${total}
                    </div>
                    <div style="font-size: 1rem; font-weight: bold; ${darkStyle.darkRed} display: flex; align-items: center; gap: 5px;">
                        <span>⏳</span> ${expDateStr}
                    </div>
                </div>
                <div style="font-size: 0.8rem; ${darkStyle.darkGray} margin-top: 8px;">
                    ⏰ ${new Date().toLocaleString('si-LK')}
                </div>
            `;
        }
        // ❌ NO PACKAGE
        else {
            headerText = `
                <div style="font-size: 1.5rem; font-weight: 900; ${darkStyle.black} letter-spacing: 1px; line-height: 1.2;">
                    BathiXen ${selectedMethod} Pro
                </div>
                <div style="font-size: 1rem; font-weight: bold; ${darkStyle.darkRed} margin-top: 8px; display: flex; align-items: center; gap: 8px;">
                    <span>⚠️</span> NO PACKAGE ASSIGNED
                </div>
                <div style="font-size: 0.8rem; ${darkStyle.darkGray} margin-top: 8px;">
                    ⏰ ${new Date().toLocaleString('si-LK')}
                </div>
            `;
        }
        
        navTitle.innerHTML = headerText;
    }
    
    const calcInputs = document.querySelectorAll('#calcMod input, #calcMod button, #calcMod select');
    calcInputs.forEach(el => {
        if (el.id === 'methodSelector') return;
        el.disabled = !access.hasAccess;
    });
    
    const recipeDisplay = document.getElementById('recipeDisplay');
    if (!access.hasAccess && recipeDisplay) {
        recipeDisplay.innerHTML = `<div style="background:#330000; border:1px solid #ff3131; padding:15px; border-radius:8px; text-align:center;">
            <span style="color: #ff8888;">⚠️ ඔබට ${selectedMethod} සඳහා ප්‍රවේශය නැත.</span>
        </div>`;
    }
}
// ==============================================
// 5. DECREMENT HSOP AFTER RECIPE
// ==============================================
async function decrementHSOP(methodology) {
    if (!currentUser || currentUser.role === 'ADMIN') return true;
    
    const perm = userPermissions[methodology];
    if (!perm || perm.package === "None") return false;
    
    const remaining = perm.remainingHSOP || 0;
    if (remaining <= 0) return false;
    
    const now = new Date();
    const expDate = new Date(perm.expirationDate || now);
    if (now > expDate) return false;
    
    perm.remainingHSOP = remaining - 1;
    userPermissions[methodology] = perm;
    window.userPermissions = userPermissions;
    
    try {
        const userRef = doc(db, "users", currentUserEmail);
        await updateDoc(userRef, { permissions: userPermissions });
        console.log(`✅ HSOP decremented for ${methodology}. Remaining: ${perm.remainingHSOP}`);
        return true;
    } catch (error) {
        console.error("Error decrementing HSOP:", error);
        return false;
    }
}

// ==============================================
// 6. UI VALIDATION & VISUAL LOGIC
// ==============================================
window.refreshUI = function() {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.style.boxShadow = "none";
        btn.style.border = "1px solid #444";
    });

    document.querySelectorAll('.data-check').forEach(c => {
        const parent = c.closest('.item-card') || c.closest('.dye-box') || c.closest('.fabric-row');
        if (!parent) return;

        const priceInput = parent.querySelector('.price-input');
        const widthSelect = parent.querySelector('.store-input');
        const customWInput = parent.querySelector('.custom-w-input');

        if (c.checked) {
            parent.style.border = parent.classList.contains('dye-box') ? "2px solid #ffd700" : "1.5px solid #39ff14";
            
            let isInvalid = false;
            
            if (priceInput && (!priceInput.value || parseFloat(priceInput.value) <= 0)) {
                priceInput.classList.add('blink-active');
                priceInput.style.border = "1px solid #ff3131";
                priceInput.style.backgroundColor = "#330000";
                isInvalid = true;
            } else if(priceInput) {
                priceInput.classList.remove('blink-active');
                priceInput.style.border = "1px solid #39ff14";
                priceInput.style.backgroundColor = "#000";
            }

            if (widthSelect) {
                const isCustom = widthSelect.value === "custom";
                
                if (widthSelect.value === "" || widthSelect.value === null) {
                    widthSelect.style.border = "1px solid #ff3131";
                    widthSelect.classList.add('blink-active');
                    isInvalid = true;
                } else if (isCustom && (!customWInput.value || parseFloat(customWInput.value) <= 0)) {
                    widthSelect.style.border = "1px solid #ff3131";
                    customWInput.style.border = "1px solid #ff3131";
                    customWInput.style.backgroundColor = "#330000";
                    widthSelect.classList.add('blink-active');
                    customWInput.classList.add('blink-active');
                    isInvalid = true;
                } else {
                    widthSelect.classList.remove('blink-active');
                    widthSelect.style.border = "1px solid #39ff14";
                    if(customWInput) {
                        customWInput.style.border = "1px solid #39ff14";
                        customWInput.style.backgroundColor = "#000";
                        customWInput.classList.remove('blink-active');
                    }
                }
            }

            if (isInvalid) {
                const tabView = parent.closest('.tab-view');
                if (tabView) {
                    const tabId = tabView.id;
                    let tabBtn = null;
                    if (tabId === 'v-dyes') tabBtn = document.querySelector('button[onclick*="v-dyes"]');
                    else if (tabId === 'v-fabrics') tabBtn = document.querySelector('button[onclick*="v-fabrics"]');
                    else if (tabId === 'v-wax') tabBtn = document.querySelector('button[onclick*="v-wax"]');
                    else if (tabId === 'v-chem') tabBtn = document.querySelector('button[onclick*="v-chem"]');
                    else if (tabId === 'v-util') tabBtn = document.querySelector('button[onclick*="v-util"]');
                    
                    if (tabBtn) {
                        tabBtn.style.border = "1px solid #ff3131";
                        tabBtn.style.boxShadow = "0 0 10px #ff3131";
                    }
                }
            }
        } else {
            parent.style.border = "1px solid #222";
            if(priceInput) { 
                priceInput.classList.remove('blink-active'); 
                priceInput.style.border = "1px solid #444";
                priceInput.style.backgroundColor = "#000";
            }
            if(widthSelect) { 
                widthSelect.classList.remove('blink-active'); 
                widthSelect.style.border = "1px solid #444";
            }
            if(customWInput) { 
                customWInput.style.border = "1px solid #444";
                customWInput.style.backgroundColor = "#000";
                customWInput.classList.remove('blink-active');
            }
        }
    });
    
    updateHeaderAndAccess();
};

// ==============================================
// 7. SWITCH TAB
// ==============================================
window.switchTab = function(tabId, btn) {
    window.refreshUI();
    const incomplete = document.querySelectorAll('.blink-active');
    
    if (incomplete.length > 0) {
        alert("⚠️ කරුණාකර රතු පැහැයෙන් දිදුලන කොටස් සම්පූර්ණ කරන්න!");
        return; 
    }

    document.querySelectorAll('.tab-view').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.nav-btn').forEach(b => {
        b.style.background = '#222'; 
        b.style.color = '#fff'; 
        b.style.border = '1px solid #444';
    });
    
    document.getElementById(tabId).style.display = 'block';
    btn.style.background = '#ffd700'; 
    btn.style.color = '#000'; 
    btn.style.border = 'none';
    
    window.refreshUI();
};

// ==============================================
// 8. SAVE DATA
// ==============================================
window.saveData = function() {
    window.refreshUI();
    
    if (document.querySelectorAll('.blink-active').length > 0) {
        alert("❌ කරුණාකර රතු පැහැයෙන් දිදුලන කොටස් සම්පූර්ණ කරන්න!");
        return;
    }

    let data = {};
    
    document.querySelectorAll('.dye-box').forEach(container => {
        const nameEl = container.querySelector('.item-name');
        const check = container.querySelector('.data-check');
        if (!nameEl || !check) return;

        const name = nameEl.innerText.trim();
        data[name] = {
            available: check.checked,
            price: container.querySelector('.price-input')?.value || "0"
        };
    });
    
    document.querySelectorAll('.fabric-row').forEach(container => {
        const nameEl = container.querySelector('.item-name');
        const check = container.querySelector('.data-check');
        if (!nameEl || !check) return;

        const name = nameEl.innerText.trim();
        data[name] = {
            available: check.checked,
            price: container.querySelector('.price-input')?.value || "0",
            width: container.querySelector('.store-input')?.value || "",
            custom_w: container.querySelector('.custom-w-input')?.value || "",
            state: container.querySelector('.state-input')?.value || "Finish"
        };
    });
    
    document.querySelectorAll('.item-card').forEach(container => {
        const nameEl = container.querySelector('.item-name');
        const check = container.querySelector('.data-check');
        if (!nameEl || !check) return;

        const name = nameEl.innerText.trim();
        data[name] = {
            available: check.checked,
            price: container.querySelector('.price-input')?.value || "0"
        };
    });

    localStorage.setItem('bathiXen_dye_settings', JSON.stringify(data));
    dyeSettings = data;
    window.dyeSettings = dyeSettings;
    
    alert("✅ දත්ත සාර්ථකව යාවත්කාලීන විය!");
    window.tab('calc');
};

// ==============================================
// 9. MAIN TAB SWITCHING
// ==============================================
window.tab = function(m) {
    const calc = document.getElementById('calcMod');
    const store = document.getElementById('storeMod');
    const admin = document.getElementById('adminMod');
    const modeToggleGroup = document.getElementById('modeToggleGroup');
    const b1 = document.getElementById('b1');
    const b2 = document.getElementById('b2');
    const bAdmin = document.getElementById('bAdmin');
    const stickyTabs = document.getElementById('stickyInventoryTabs');

    if (m === 'store') {
        calc.style.display = 'none';
        store.style.display = 'block';
        if(admin) admin.style.display = 'none';
        if(modeToggleGroup) modeToggleGroup.style.display = 'none';
        if(stickyTabs) stickyTabs.style.display = 'block';
        
        b2.classList.add('active-btn');
        b1.classList.remove('active-btn');
        if(bAdmin) bAdmin.classList.remove('active-btn');
        
        window.renderInventory();
        
    } else if (m === 'admin') {
        calc.style.display = 'none';
        store.style.display = 'none';
        if(admin) admin.style.display = 'block';
        if(modeToggleGroup) modeToggleGroup.style.display = 'none';
        if(stickyTabs) stickyTabs.style.display = 'none';
        
        if(bAdmin) bAdmin.classList.add('active-btn');
        b1.classList.remove('active-btn');
        b2.classList.remove('active-btn');
        
        loadUsers();
        
    } else {
        window.refreshUI();
        
        if (document.querySelectorAll('.blink-active').length > 0) {
            alert("⚠️ කරුණාකර රතු පැහැයෙන් දිදුලන කොටස් සම්පූර්ණ කරන්න!");
            return;
        }
        
        calc.style.display = 'block';
        store.style.display = 'none';
        if(admin) admin.style.display = 'none';
        if(modeToggleGroup) modeToggleGroup.style.display = 'grid';
        if(stickyTabs) stickyTabs.style.display = 'none';
        
        b1.classList.add('active-btn');
        b2.classList.remove('active-btn');
        if(bAdmin) bAdmin.classList.remove('active-btn');
        
        window.updateFabricDropdown();
        updateHeaderAndAccess();
    }
};

// ==============================================
// 10. RENDER INVENTORY
// ==============================================
window.renderInventory = function() {
    const storeMod = document.getElementById('storeMod');
    storeMod.innerHTML = `
        <div style="padding:10px; display:flex; flex-direction:column; gap:10px;">
            <div style="display:flex; justify-content:space-between; align-items:center; background:#111; padding:15px; border-radius:12px; border:1px solid #333;">
                <span style="color:#ffd700; font-weight:bold; font-size:1.3rem;">🛒 Stores</span>
                <button onclick="window.tab('calc')" style="background:#ff3131; color:white; border:none; border-radius:50%; width:30px; height:30px; cursor:pointer;">✕</button>
            </div>
            
            <div style="position: sticky; top: 128px; z-index: 1400; background: #050505; display:flex; gap:8px; overflow-x:auto; padding: 10px 0; border-bottom: 1px solid #222;">
                <button class="nav-btn" onclick="window.switchTab('v-dyes', this)" style="min-width:90px; padding:12px; border-radius:10px; background:#ffd700; color:#000; font-weight:bold; border:none; cursor:pointer;">සායම්</button>
                <button class="nav-btn" onclick="window.switchTab('v-fabrics', this)" style="min-width:90px; padding:12px; border-radius:10px; background:#222; color:#fff; border:none; cursor:pointer;">රෙදි</button>
                <button class="nav-btn" onclick="window.switchTab('v-wax', this)" style="min-width:90px; padding:12px; border-radius:10px; background:#222; color:#fff; border:none; cursor:pointer;">ඉටි</button>
                <button class="nav-btn" onclick="window.switchTab('v-chem', this)" style="min-width:90px; padding:12px; border-radius:10px; background:#222; color:#fff; border:none; cursor:pointer;">රසායන</button>
                <button class="nav-btn" onclick="window.switchTab('v-util', this)" style="min-width:90px; padding:12px; border-radius:10px; background:#222; color:#fff; border:none; cursor:pointer;">යුටිලිටීස්</button>
            </div>
        </div>
        
        <div id="v-dyes" class="tab-view" style="display:block; padding:10px;">${renderDyeGrid()}</div>
        <div id="v-fabrics" class="tab-view" style="display:none; padding:10px;">${renderFabricList()}</div>
        <div id="v-wax" class="tab-view" style="display:none; padding:10px;">${renderSimpleList(auxiliaries.WAX, "රු/කිලෝ")}</div>
        <div id="v-chem" class="tab-view" style="display:none; padding:10px;">${renderSimpleList(auxiliaries.CHEMICALS, "රු/කිලෝ")}</div>
        <div id="v-util" class="tab-view" style="display:none; padding:10px;">${renderSimpleList(auxiliaries.UTILITIES, "රු/ඒකකය")}</div>
        
        <div style="padding:15px;">
            <button onclick="window.saveData()" style="width:100%; background:#39ff14; color:#000; border:none; padding:16px; border-radius:12px; font-weight:bold; font-size:14px; cursor:pointer;">
                💾 වෙනස්කම් සුරකින්න
            </button>
        </div>
    `;
    
    window.refreshUI();
};

// ==============================================
// 11. RENDER DYES GRID
// ==============================================
window.renderDyeGrid = function() {
    const dyes = window.allDyes || [];
    
    if (!dyes || dyes.length === 0) {
        return '<p style="color:#ff3131; text-align:center;">සායම් දත්ත පූරණය වී නැත</p>';
    }
    
    try {
        const groups = {};
        
        dyes.forEach(dye => {
            if (!dye) return;
            const group = dye.groupId || "Other";
            if (!groups[group]) groups[group] = [];
            groups[group].push(dye);
        });
        
        const groupConfig = {
            "Reactive": { color: "#ffd700", icon: "🔥", name: "Reactive Dyes" },
            "Vat": { color: "#39ff14", icon: "⚙️", name: "Vat Dyes" },
            "Napthol": { color: "#ff3131", icon: "🧪", name: "Napthol Dyes" },
            "Acid": { color: "#ff69b4", icon: "🧪", name: "Acid Dyes" },
            "Pigment": { color: "#ff9900", icon: "🎨", name: "Pigment Dyes" },
            "Disperse": { color: "#00ffff", icon: "💧", name: "Disperse Dyes" },
            "FiberReactive": { color: "#ffd700", icon: "🔥", name: "Fiber Reactive Dyes" },
            "Indigo": { color: "#4b0082", icon: "🔮", name: "Indigo Dyes" },
            "Cyanotype": { color: "#00ced1", icon: "☀️", name: "Cyanotype Dyes" },
            "Photo": { color: "#888", icon: "📷", name: "Photo Dyes" },
            "Other": { color: "#888", icon: "📦", name: "Other Dyes" }
        };
        
        let html = '';
        
        for (const [groupName, dyeList] of Object.entries(groups)) {
            if (!dyeList || dyeList.length === 0) continue;
            
            const config = groupConfig[groupName] || groupConfig["Other"];
            
            html += `
                <div style="margin-bottom:25px;">
                    <div style="background:${config.color}; color:#000; padding:10px 15px; border-radius:10px; margin-bottom:15px; font-weight:bold; font-size:14px; display:flex; justify-content:space-between; align-items:center;">
                        <span>${config.icon} ${config.name}</span>
                        <span style="background:rgba(0,0,0,0.2); padding:3px 12px; border-radius:20px;">${dyeList.length}</span>
                    </div>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
            `;
            
            dyeList.forEach(d => {
                if (!d) return;
                
                const saved = window.dyeSettings && window.dyeSettings[d.name] ? window.dyeSettings[d.name] : {};
                const checked = saved.available ? 'checked' : '';
                const price = saved.price || '';
                
                html += `
                    <div class="dye-box" style="background:#161616; padding:15px; border-radius:15px; border:1px solid #222; display:flex; flex-direction:column; justify-content:space-between; align-items:center; min-height:160px;">
                        <div style="width:30px; height:30px; border-radius:50%; background:rgb(${d.r || 0},${d.g || 0},${d.b || 0}); border:2px solid #444;"></div>
                        <div class="item-name" style="font-size:11px; color:#fff; font-weight:bold; height:30px; overflow:hidden; text-align:center; margin:8px 0;">${d.name || 'Unknown'}</div>
                        <div style="font-size:9px; color:#888;">රු/100g</div>
                        <div style="display:flex; align-items:center; gap:8px; margin-top:5px;">
                            <input type="checkbox" class="data-check" onchange="window.refreshUI()" ${checked} style="width:18px; height:18px;">
                            <input type="number" class="price-input" value="${price}" oninput="window.refreshUI()" placeholder="0" style="width:70px; background:#000; color:#39ff14; border:1px solid #333; padding:6px; border-radius:6px; text-align:center; font-size:11px;">
                        </div>
                    </div>
                `;
            });
            
            html += `</div></div>`;
        }
        
        return html;
        
    } catch (error) {
        console.error('Error in renderDyeGrid:', error);
        return `<p style="color:#ff3131; text-align:center;">⚠️ දෝෂයකි</p>`;
    }
};

// ==============================================
// 12. RENDER FABRICS LIST
// ==============================================
function renderFabricList() {
    return auxiliaries.FABRICS.map((f, i) => {
        const saved = dyeSettings[f.name] || { available: false, price: '', width: '', state: 'Finish', custom_w: '' };
        const isCustom = saved.width === 'custom';
        
        return `
            <div class="fabric-row" style="background:#161616; padding:15px; border-radius:12px; margin-bottom:12px; border:1px solid #222;">
                <div style="display:flex; align-items:center; gap:10px; margin-bottom:10px;">
                    <input type="checkbox" class="data-check" onchange="window.refreshUI()" ${saved.available ? 'checked' : ''} style="width:18px; height:18px;">
                    <div class="item-name" style="color:#ffd700; font-weight:bold; font-size:13px;">${f.name}</div>
                </div>
                
                <div style="font-size:10px; color:#888; margin-left:28px; margin-bottom:6px;">රු/යාරය</div>
                
                <div style="display:flex; gap:6px; margin-left:28px; flex-wrap:wrap;">
                    <select class="state-input" onchange="window.refreshUI()" style="width:70px; background:#000; color:#39ff14; padding:6px 4px; border:1px solid #444; border-radius:5px; font-size:10px;">
                        <option value="Finish" ${saved.state === 'Finish' ? 'selected' : ''}>Finish</option>
                        <option value="Amu" ${saved.state === 'Amu' ? 'selected' : ''}>Amu</option>
                    </select>
                    
                    <div style="position:relative; width:80px;">
                        <select class="store-input" onchange="window.handleWidthChange(this, ${i}); window.refreshUI()" style="width:100%; background:#000; color:#fff; padding:6px 4px; border:1px solid #444; border-radius:5px; font-size:10px;">
                            <option value="">පළල</option>
                            ${f.widths.map(w => `<option value='${w}' ${String(saved.width).trim() === String(w).trim() ? 'selected' : ''}>${w}</option>`).join('')}
                            <option value="custom" ${isCustom ? 'selected' : ''}>අතින්</option>
                        </select>
                        
                        <input type="number" id="custom-w-${i}" class="custom-w-input" 
                               value="${saved.custom_w || ''}" 
                               oninput="window.refreshUI()" 
                               placeholder="අගල්" 
                               style="display:${isCustom ? 'block' : 'none'}; width:100%; margin-top:5px; background:#000; color:#fff; padding:5px; border-radius:5px; font-size:10px; text-align:center; border:1px solid #444;">
                    </div>
                    
                    <input type="number" class="price-input" value="${saved.price || ''}" 
                           oninput="window.refreshUI()" 
                           placeholder="මිල" 
                           style="width:70px; background:#000; color:#39ff14; border:1px solid #444; border-radius:5px; text-align:center; font-size:10px; padding:6px 4px;">
                </div>
            </div>`;
    }).join('');
}

// ==============================================
// 13. RENDER SIMPLE LIST
// ==============================================
function renderSimpleList(list, unit) {
    return list.map(item => {
        const saved = dyeSettings[item] || {};
        return `
            <div class="item-card" style="display:flex; align-items:center; background:#161616; padding:12px; border-radius:10px; margin-bottom:8px; border:1px solid #222;">
                <input type="checkbox" class="data-check" onchange="window.refreshUI()" ${saved.available ? 'checked' : ''} style="width:18px; height:18px; margin-right:10px;">
                <div class="item-name" style="flex:1; color:#fff; font-size:11px;">${item}</div>
                <div style="display:flex; align-items:center; gap:5px;">
                    <input type="number" class="price-input" value="${saved.price || ''}" oninput="window.refreshUI()" placeholder="0" style="width:70px; background:#000; color:#39ff14; border:1px solid #444; padding:6px; border-radius:5px; text-align:center; font-size:10px;">
                    <span style="font-size:9px; color:#888; min-width:45px;">${unit}</span>
                </div>
            </div>`;
    }).join('');
}

// ==============================================
// 14. UTILITY FUNCTIONS
// ==============================================
window.handleWidthChange = function(s, i) {
    const custom = document.getElementById(`custom-w-${i}`);
    if(custom) {
        custom.style.display = (s.value === 'custom') ? 'block' : 'none';
    }
};

window.updateFabricDropdown = function() {
    const fabricSelect = document.getElementById('fabric');
    if (!fabricSelect) return;
    
    fabricSelect.innerHTML = '<option value="">රෙදි වර්ගය තෝරන්න</option>';
    
    auxiliaries.FABRICS.forEach(f => {
        const data = dyeSettings[f.name];
        if (data && data.available && data.price && parseFloat(data.price) > 0) {
            const w = data.width === 'custom' ? data.custom_w : data.width;
            if (w) {
                const opt = document.createElement('option');
                opt.value = f.name;
                opt.innerText = `${f.name} (${w}") - ${data.state || 'Finish'}`;
                fabricSelect.appendChild(opt);
            }
        }
    });
};

// ==============================================
// 15. RECIPE GENERATOR - FIXED WAX COVERAGE
// ==============================================
window.process = async function() {
    console.log('🚀 process() started');
    
    const access = getMethodologyAccess(currentMethodology);
    
    if (!access.hasAccess) {
        alert(`❌ ඔබට ${currentMethodology} සඳහා ප්‍රවේශය නැත.`);
        return;
    }
    
    const targetRGB = document.getElementById('targetRGBDisp')?.innerText || '0,0,0';
    const bgRGB = document.getElementById('bgRGBDisp')?.innerText || '255,255,255';
    const fabric = document.getElementById('fabric')?.value;
    const weight = parseFloat(document.getElementById('weight')?.value);
    
    // ✅ FIX: waxSlider එකෙන් කෙලින්ම value එක ගන්න
    const waxSlider = document.getElementById('waxSlider');
    let coverage = 0;
    if (waxSlider) {
        coverage = parseFloat(waxSlider.value);
        console.log('Wax slider value:', coverage);
    } else {
        console.warn('waxSlider not found, using default 0');
        coverage = 0;
    }
    
    // ✅ FIX: isNaN check එක පමණක් භාවිතා කරන්න (|| 50 ඉවත් කර ඇත)
    if (isNaN(coverage)) {
        coverage = 0; // parse නොවුණොත් default 0
        console.log('Using default coverage: 0');
    }
    
    console.log('Final coverage value being sent:', coverage);
    
    if (!fabric) {
        alert('❌ කරුණාකර රෙදි වර්ගය තෝරන්න');
        return;
    }
    if (!weight || weight <= 0) {
        alert('❌ කරුණාකර බර ඇතුළත් කරන්න');
        return;
    }
    
    try {
        const recipe = await generateRecipe({
            targetRGB: targetRGB,
            bgRGB: bgRGB,
            fabric: fabric,
            weight: weight,
            coverage: coverage // දැන් 0 වෙන්න පුළුවන්
        });
        
        const recipeDisplay = document.getElementById('recipeDisplay');
        if (recipeDisplay) {
            recipeDisplay.innerHTML = formatRecipeHTML(recipe);
        }
        
        if (recipe.error) return;
        
        if (currentUser && currentUser.role !== 'ADMIN') {
            const success = await decrementHSOP(currentMethodology);
            if (success) {
                updateHeaderAndAccess();
                const remaining = userPermissions[currentMethodology]?.remainingHSOP || 0;
                alert(`✅ වට්ටෝරුව සාදන ලදී! ඉතුරු HSOP ගණන: ${remaining}`);
            }
        }
    } catch (error) {
        console.error('🔴 Recipe generation error:', error);
        alert('❌ වට්ටෝරුව සෑදීමේ දෝෂයකි');
    }
};

// ==============================================
// 16. LOAD USERS
// ==============================================
async function loadUsers() {
    const container = document.getElementById('userListContainer');
    if (!container) return;
    
    try {
        const querySnapshot = await getDocs(collection(db, "users"));
        let html = '<h4 style="color:#ffd700; margin-bottom:15px;">📋 පරිශීලකයින්</h4>';
        
        querySnapshot.forEach((doc) => {
            const user = doc.data();
            const email = doc.id;
            
            html += `
                <div class="user-card" style="background:#111; padding:12px; border-radius:10px; margin-bottom:8px; border:1px solid #222; cursor:pointer;" onclick="showUserDetails('${email}')">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <div>
                            <b style="color:#fff; font-size:13px;">${user.name || 'නම නැත'}</b><br>
                            <small style="color:#666; font-size:10px;">${email}</small>
                        </div>
                        <span style="color:${user.role === 'ADMIN' ? '#ffd700' : '#39ff14'}; font-size:10px; background:#000; padding:3px 6px; border-radius:4px;">${user.role || 'USER'}</span>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
    } catch (error) {
        console.error('Error loading users:', error);
        container.innerHTML = '<p style="color:#ff3131;">❌ දෝෂයකි</p>';
    }
}

// ==============================================
// 17. USER DETAILS
// ==============================================
window.showUserDetails = async function(email) {
    try {
        const userRef = doc(db, "users", email);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
            const user = userSnap.data();
            const userPermissionsData = user.permissions || {};
            
            let methodologyHtml = '';
            METHOD_NAMES.forEach(method => {
                const perm = userPermissionsData[method] || { package: "None", remainingHSOP: 0, activationDate: new Date().toISOString() };
                methodologyHtml += `
                    <div style="display:flex; align-items:center; justify-content:space-between; background:#000; padding:8px 10px; border-radius:6px; margin-bottom:5px;">
                        <span style="color:#aaa; font-size:11px;">${method}</span>
                        <select id="perm-${method.replace(/\s/g, '')}" style="background:#111; color:#39ff14; border:1px solid #333; padding:4px; border-radius:4px; font-size:10px;">
                            ${PACKAGES.map(p => `<option value="${p}" ${(perm.package || "None") === p ? 'selected' : ''}>${p}</option>`).join('')}
                        </select>
                    </div>
                `;
            });
            
            const detailsHtml = `
                <div style="position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.95); z-index:10000; display:flex; align-items:center; justify-content:center; overflow-y:auto; padding:20px;" onclick="this.remove()">
                    <div style="background:#111; padding:20px; border-radius:15px; max-width:450px; width:100%; border:1px solid #333; max-height:90vh; overflow-y:auto;" onclick="event.stopPropagation()">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                            <h3 style="color:#ffd700; margin:0; font-size:16px;">${user.name || 'පරිශීලක'}</h3>
                            <button onclick="this.closest('div[onclick]').remove()" style="background:#ff3131; color:white; border:none; border-radius:50%; width:30px; height:30px;">✕</button>
                        </div>
                        
                        <div style="margin-bottom:15px; background:#0a0a0a; padding:12px; border-radius:8px;">
                            <div style="display:grid; grid-template-columns:80px 1fr; gap:8px; font-size:12px;">
                                <div style="color:#888;">ඊමේල්:</div><div style="color:#0ff;">${email}</div>
                                <div style="color:#888;">WhatsApp:</div><div style="color:#fff;">${user.whatsapp_number || 'නැත'}</div>
                                <div style="color:#888;">භූමිකාව:</div><div style="color:${user.role === 'ADMIN' ? '#ffd700' : '#39ff14'};">${user.role || 'USER'}</div>
                            </div>
                        </div>
                        
                        <h4 style="color:#ffd700; font-size:13px; margin:15px 0 10px;">📦 ක්‍රමවේද පැකේජ</h4>
                        
                        <div style="max-height:300px; overflow-y:auto; margin-bottom:15px;">
                            ${methodologyHtml}
                        </div>
                        
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                            <button onclick="saveUserPermissions('${email}')" style="background:#39ff14; color:#000; border:none; padding:12px; border-radius:6px;">💾 සුරකින්න</button>
                            <button onclick="resetUserDevice('${email}')" style="background:#444; color:#fff; border:none; padding:12px; border-radius:6px;">🔄 උපාංග reset</button>
                            <button onclick="deleteUser('${email}')" style="grid-column:span 2; background:#ff3131; color:#fff; border:none; padding:12px; border-radius:6px;">❌ මකන්න</button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', detailsHtml);
        }
    } catch (error) {
        console.error('Error loading user details:', error);
        alert('❌ දෝෂයකි');
    }
};

// ==============================================
// 18. SAVE USER PERMISSIONS
// ==============================================
window.saveUserPermissions = async function(email) {
    try {
        let newPermissions = {};
        const now = new Date();
        
        const userRef = doc(db, "users", email);
        const userSnap = await getDoc(userRef);
        const currentPerms = userSnap.exists() ? (userSnap.data().permissions || {}) : {};
        
        METHOD_NAMES.forEach(method => {
            const selectId = `perm-${method.replace(/\s/g, '')}`;
            const select = document.getElementById(selectId);
            if (select) {
                const pkg = select.value;
                const benefits = PACKAGE_BENEFITS[pkg] || PACKAGE_BENEFITS["None"];
                
                const oldPerm = currentPerms[method] || { package: "None", remainingHSOP: 0, activationDate: now.toISOString() };
                let activationDate = oldPerm.activationDate;
                let remainingHSOP = oldPerm.remainingHSOP;
                
                if (pkg !== oldPerm.package) {
                    activationDate = now.toISOString();
                    remainingHSOP = benefits[0];
                } else {
                    if (pkg === "None") {
                        remainingHSOP = 0;
                    } else if (!remainingHSOP || remainingHSOP <= 0) {
                        remainingHSOP = benefits[0];
                    }
                }
                
                let expirationDate;
                if (pkg === "None") {
                    expirationDate = now.toISOString();
                } else {
                    const expDate = new Date(activationDate);
                    expDate.setDate(expDate.getDate() + benefits[1]);
                    expirationDate = expDate.toISOString();
                }
                
                newPermissions[method] = {
                    package: pkg,
                    remainingHSOP: remainingHSOP,
                    activationDate: activationDate,
                    expirationDate: expirationDate
                };
            }
        });
        
        await updateDoc(userRef, { permissions: newPermissions });
        
        alert("✅ පරිශීලක අවසර සුරකින ලදී!");
        
        const popup = document.querySelector('div[style*="position:fixed"]');
        if (popup) popup.remove();
        loadUsers();
        
    } catch (error) {
        console.error('Error saving permissions:', error);
        alert("❌ දෝෂයකි");
    }
};

// ==============================================
// 19. ADD NEW USER
// ==============================================
window.addNewUser = async function() {
    const name = document.getElementById('reg-name')?.value.trim();
    const email = document.getElementById('reg-email')?.value.trim().toLowerCase();
    const whatsapp = document.getElementById('reg-whatsapp')?.value.trim();
    const role = document.getElementById('reg-role')?.value;

    if (!name || !email || !whatsapp) {
        alert("❌ කරුණාකර නම, ඊමේල් සහ WhatsApp අංකය ඇතුළත් කරන්න!");
        return;
    }

    try {
        let permissions = {};
        const now = new Date().toISOString();
        METHOD_NAMES.forEach(method => {
            permissions[method] = {
                package: "None",
                remainingHSOP: 0,
                activationDate: now,
                expirationDate: now
            };
        });
        
        await setDoc(doc(db, "users", email), {
            name: name,
            email: email,
            whatsapp_number: whatsapp,
            role: role || "USER",
            permissions: permissions,
            device_id: "",
            createdAt: now
        });
        
        alert("✅ නව පරිශීලකයා එකතු කරන ලදී!");
        
        document.getElementById('reg-name').value = "";
        document.getElementById('reg-email').value = "";
        document.getElementById('reg-whatsapp').value = "";
        
        loadUsers();
        
    } catch (error) {
        console.error('Error adding user:', error);
        alert("❌ දෝෂයකි");
    }
};

// ==============================================
// 20. RESET USER DEVICE
// ==============================================
window.resetUserDevice = async function(email) {
    if (confirm(`🔓 ${email} ගේ උපාංග අගුළ ඉවත් කරන්නද?`)) {
        try {
            await updateDoc(doc(db, "users", email), { device_id: "" });
            alert('✅ උපාංග අගුළ ඉවත් කරන ලදී');
            const popup = document.querySelector('div[style*="position:fixed"]');
            if (popup) popup.remove();
            loadUsers();
        } catch (error) {
            console.error('Error resetting device:', error);
            alert('❌ දෝෂයකි');
        }
    }
};

// ==============================================
// 21. DELETE USER
// ==============================================
window.deleteUser = async function(email) {
    if (confirm(`❌ ${email} සම්පූර්ණයෙන්ම මකා දමන්නද?`)) {
        try {
            await deleteDoc(doc(db, "users", email));
            alert('✅ පරිශීලකයා මකා දමන ලදී');
            const popup = document.querySelector('div[style*="position:fixed"]');
            if (popup) popup.remove();
            loadUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('❌ දෝෂයකි');
        }
    }
};

// ==============================================
// 22. COLOR WHEEL FUNCTIONS
// ==============================================
let activeMode = 'target';
let targetBaseRGB = [0, 0, 0];
let bgBaseRGB = [255, 255, 255];

window.setMode = function(m) {
    activeMode = m;
    document.getElementById('targetModeBtn')?.classList.toggle('mode-active-target', m === 'target');
    document.getElementById('bgModeBtn')?.classList.toggle('mode-active-bg', m === 'bg');
};

window.showImg = function() {
    document.getElementById('wheelContainer').style.display = 'none';
    document.getElementById('canvasBox').style.display = 'block';
    document.getElementById('fileIn').click();
};

window.showWheel = function() {
    document.getElementById('canvasBox').style.display = 'none';
    document.getElementById('wheelContainer').style.display = 'block';
};

window.handleImg = function(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const cvs = document.getElementById('mainCanvas');
                const ctx = cvs.getContext('2d');
                cvs.width = img.width;
                cvs.height = img.height;
                ctx.drawImage(img, 0, 0);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
    }
};

window.applyAdj = function() {
    let base = activeMode === 'target' ? targetBaseRGB : bgBaseRGB;
    let b = parseInt(document.getElementById('bright').value);
    let s = parseInt(document.getElementById('sat').value) / 100 + 1;
    let [r, g, bl] = base;
    
    r = Math.min(255, Math.max(0, r + b));
    g = Math.min(255, Math.max(0, g + b));
    bl = Math.min(255, Math.max(0, bl + b));
    
    let gray = 0.2989 * r + 0.5870 * g + 0.1140 * bl;
    r = Math.round(Math.min(255, Math.max(0, gray + s * (r - gray))));
    g = Math.round(Math.min(255, Math.max(0, gray + s * (g - gray))));
    bl = Math.round(Math.min(255, Math.max(0, gray + s * (bl - gray))));
    
    const prefix = activeMode === 'target' ? 'target' : 'bg';
    const swatch = document.getElementById(prefix + 'Swatch');
    const rgbDisp = document.getElementById(prefix + 'RGBDisp');
    
    if (swatch) swatch.style.background = `rgb(${r},${g},${bl})`;
    if (rgbDisp) rgbDisp.innerText = `${r}, ${g}, ${bl}`;
};

window.pickC = function(e) {
    if (e.buttons !== 1) return;
    const cvs = document.getElementById('mainCanvas');
    if (!cvs) return;
    
    const rect = cvs.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (cvs.width / rect.width);
    const y = (e.clientY - rect.top) * (cvs.height / rect.height);
    
    if (x < 0 || y < 0 || x >= cvs.width || y >= cvs.height) return;
    
    const p = cvs.getContext('2d').getImageData(x, y, 1, 1).data;
    if (p[3] === 0) return;
    
    if (activeMode === 'target') targetBaseRGB = [p[0], p[1], p[2]];
    else bgBaseRGB = [p[0], p[1], p[2]];
    
    applyAdj();
};

window.pickW = function(e) {
    const cvs = document.getElementById('wheelCanvas');
    const rect = cvs.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (x < 0 || y < 0 || x > 220 || y > 220) return;
    
    const p = cvs.getContext('2d').getImageData(x, y, 1, 1).data;
    if (p[3] === 0) return;
    
    const marker = document.getElementById('marker');
    if (marker) {
        marker.style.left = x + 'px';
        marker.style.top = y + 'px';
    }
    
    if (activeMode === 'target') targetBaseRGB = [p[0], p[1], p[2]];
    else bgBaseRGB = [p[0], p[1], p[2]];
    
    applyAdj();
};

// ==============================================
// 23. LOGOUT
// ==============================================
window.logout = function() {
    if (confirm('🚪 පද්ධතියෙන් ඉවත් වෙනවාද?')) {
        localStorage.removeItem('userEmail');
        window.location.replace('login.html');
    }
};

// ==============================================
// 24. METHODOLOGY CHANGE HANDLER
// ==============================================
window.onMethodologyChange = function() {
    const methodSelector = document.getElementById('methodSelector');
    if (methodSelector) {
        const selectedMethod = methodSelector.value;
        currentMethodology = selectedMethod;
        window.currentMethodology = selectedMethod;
        
        updateHeaderAndAccess();
        
        const recipeDisplay = document.getElementById('recipeDisplay');
        if (recipeDisplay) {
            recipeDisplay.innerHTML = '';
        }
    }
};

// ==============================================
// 25. DRAW COLOR WHEEL
// ==============================================
function drawWheel() {
    const canvas = document.getElementById('wheelCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const radius = canvas.width / 2;
    
    for (let i = 0; i < 360; i++) {
        ctx.beginPath();
        ctx.moveTo(radius, radius);
        ctx.arc(radius, radius, radius, (i - 1) * Math.PI / 180, (i + 1) * Math.PI / 180);
        ctx.fillStyle = `hsl(${i}, 100%, 50%)`;
        ctx.fill();
    }
    
    const grad = ctx.createRadialGradient(radius, radius, 0, radius, radius, radius);
    grad.addColorStop(0, 'white');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fill();
}

// ==============================================
// 26. INITIALIZATION
// ==============================================
async function initApp() {
    try {
        console.log('🟢 BathiXen Master ආරම්භ වේ...');
        
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes blinkRed {
                0% { color: #ff3131; opacity: 1; }
                50% { color: #ff8888; opacity: 0.5; }
                100% { color: #ff3131; opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        const savedSettings = localStorage.getItem('bathiXen_dye_settings');
        if (savedSettings) {
            dyeSettings = JSON.parse(savedSettings);
            window.dyeSettings = dyeSettings;
            console.log('✅ Saved dye settings loaded');
        }
        
        await loadUserData();
        
        try {
            const response = await fetch('./data/codex_dyes.json');
            if (response.ok) {
                allDyes = await response.json();
                window.allDyes = allDyes;
                console.log(`✅ සායම් ${allDyes.length}ක් පූරණය කරන ලදී`);
            }
        } catch (e) {
            console.warn('⚠️ Dye load error:', e);
        }
        
        const methodSelector = document.getElementById('methodSelector');
        if (methodSelector) {
            currentMethodology = methodSelector.value || "Reactive Dyeing";
            window.currentMethodology = currentMethodology;
            methodSelector.addEventListener('change', onMethodologyChange);
        }
        
        drawWheel();
        window.updateFabricDropdown();
        setInterval(updateHeaderAndAccess, 1000);
        
        setTimeout(() => {
            const splash = document.getElementById('splash-screen');
            if (splash) {
                splash.classList.add('fade-out');
                setTimeout(() => splash.style.display = 'none', 500);
            }
        }, 1000);
        
    } catch (error) {
        console.error('🔴 Initialization error:', error);
    }
}

// ==============================================
// 27. START APP
// ==============================================
document.addEventListener('DOMContentLoaded', initApp);

// ==============================================
// 28. EXPOSE FUNCTIONS TO WINDOW
// ==============================================
window.refreshUI = refreshUI;
window.switchTab = switchTab;
window.saveData = saveData;
window.tab = tab;
window.process = process;
window.logout = logout;
window.handleWidthChange = handleWidthChange;
window.setMode = setMode;
window.showImg = showImg;
window.showWheel = showWheel;
window.handleImg = handleImg;
window.applyAdj = applyAdj;
window.pickC = pickC;
window.pickW = pickW;
window.showUserDetails = showUserDetails;
window.saveUserPermissions = saveUserPermissions;
window.resetUserDevice = resetUserDevice;
window.deleteUser = deleteUser;
window.addNewUser = addNewUser;
window.onMethodologyChange = onMethodologyChange;

// ==============================================
// 29. EXPOSE GLOBAL VARIABLES FOR DEBUGGING
// ==============================================
window.getMethodologyAccess = getMethodologyAccess;
window.loadUserData = loadUserData;
window.updateHeaderAndAccess = updateHeaderAndAccess;
window.renderInventory = renderInventory;
window.renderDyeGrid = renderDyeGrid;
window.initApp = initApp;

console.log('✅ app.js fully loaded and ready');
