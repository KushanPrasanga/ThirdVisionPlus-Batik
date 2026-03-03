import { db } from './firebase-init.js';
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const loginButton = document.getElementById('loginButton');
const emailField = document.getElementById('email');
const errorMessage = document.getElementById('errorMessage');
const otpSection = document.getElementById('otpSection');
const loginForm = document.getElementById('loginForm');
const otpInput = document.getElementById('otpInput');
const verifyButton = document.getElementById('verifyButton');

let generatedOTP = null;
let currentUserEmail = null; // Email එක තාවකාලිකව තබා ගැනීමට

// බාහිර ලයිබ්‍රරි නැතිව ශක්තිමත් Device ID එකක් සාදා ගැනීම
const getSimpleDeviceId = () => {
    let dId = localStorage.getItem('bathiXen_device_unique_id');
    if (!dId) {
        // අහඹු අංක සහ අකුරු සහිත අලුත් ID එකක් සෑදීම
        dId = 'BX-' + Math.random().toString(36).substring(2, 15) + '-' + Date.now();
        localStorage.setItem('bathiXen_device_unique_id', dId);
    }
    return dId;
};

// පණිවිඩ පෙන්වීම සඳහා සරල function එකක්
const updateStatus = (msg, color) => {
    if (errorMessage) {
        errorMessage.style.color = color;
        errorMessage.textContent = msg;
        errorMessage.style.zIndex = "100";
    }
};

if (loginButton) {
    loginButton.onclick = async (e) => {
        e.preventDefault();
        const email = emailField.value.trim().toLowerCase();
        
        if (!email) {
            updateStatus("Email එක ඇතුළත් කරන්න.", "#ff4081");
            return;
        }
        
        updateStatus("පරීක්ෂා කරමින්...", "#00e5ff");
        
        try {
            const userRef = doc(db, "users", email);
            const userSnap = await getDoc(userRef);
            
            if (userSnap.exists()) {
                const data = userSnap.data();
                currentUserEmail = email; // සාර්ථක නම් email එක මතක තබා ගන්න
                
                // දැනට පවතින Device ID එක ලබා ගැනීම
                const currentDeviceId = getSimpleDeviceId();
                
                // 1. Device Lock පරීක්ෂාව
                if (data.device_id && data.device_id !== "" && data.device_id !== currentDeviceId) {
                    updateStatus("මෙම ගිණුම වෙනත් Device එකක් සමඟ සම්බන්ධ කර ඇත!", "#ff4081");
                    return;
                }
                
                // 2. පළමු වර ලොග් වීම නම් Device ID එක සේව් කිරීම
                if (!data.device_id || data.device_id === "") {
                    await updateDoc(userRef, {
                        device_id: currentDeviceId
                    });
                }
                
                // --- OTP යවන කොටස ---
                generatedOTP = Math.floor(100000 + Math.random() * 900000);
                
                await updateDoc(userRef, {
                    current_otp: generatedOTP.toString()
                });
                
                // WhatsApp අංකය තිබේදැයි පරීක්ෂා කිරීම
                if (!data.whatsapp_number) {
                    updateStatus("WhatsApp අංකය Database එකේ නැත!", "#ff4081");
                    return;
                }
                
                let phone = data.whatsapp_number.toString().replace(/\D/g, '');
                const message = `BathiXen Security Code: ${generatedOTP}`;
                const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;
                
                loginForm.style.display = 'none';
                otpSection.style.display = 'block';
                updateStatus("OTP එක WhatsApp වෙත යොමු කරන ලදී.", "#00ff00");
                
                window.open(whatsappUrl, '_blank');
                
            } else {
                updateStatus("මෙම Email එක ලියාපදිංචි කර නැත.", "#ff4081");
            }
        } catch (err) {
            console.error(err);
            updateStatus("සම්බන්ධතා දෝෂයකි!", "#ff4081");
        }
    };
}

if (verifyButton) {
    verifyButton.onclick = () => {
        const enteredOtp = otpInput.value.trim();
        // Master OTP හෝ නිවැරදි OTP පරීක්ෂාව
        if (enteredOtp == generatedOTP || enteredOtp == "284716") {
            
            // ආරක්ෂක දත්ත localStorage හි තැන්පත් කිරීම
            localStorage.setItem('userLoggedIn', 'true');
            localStorage.setItem('userEmail', currentUserEmail);
            
            // Index පිටුවට යොමු කිරීම
            window.location.replace('index.html');
        } else {
            updateStatus("වැරදි OTP එකකි!", "#ff4081");
        }
    };
}