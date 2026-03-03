// ==============================================
// HSOP CALCULATOR - MASTER PRODUCTION VERSION
// Advanced Color Science Engine with Background Adaptation
// CEO: Eng. Kushan Prasanga | ThirdVisionPlus Engineering
// Version: 3.0.6 (FINAL - WITH WAX COMPOSITIONS & FULL COSTING)
// ==============================================

// ==============================================
// 1. GLOBAL STATE & CONFIGURATION
// ==============================================

let currentRecipe = null;
let backgroundAdjustmentMatrix = null;

const METHODOLOGY_GROUPS = {
    "Reactive Dyeing": ["Reactive"],
    "Vat Dyeing": ["Vat"],
    "Napthol Dyeing": ["Napthol"],
    "Eco Batik": ["Reactive", "Vat"],
    "Silk Batik": ["Reactive", "Acid"],
    "Java Lukis": ["Reactive", "Vat"],
    "Shibori Technique": ["Reactive", "Vat", "Indigo"],
    "Tie Dye": ["Reactive", "Vat", "FiberReactive"],
    "Block Printing": ["Pigment", "Reactive"],
    "Screen Printing": ["Pigment", "Reactive", "Disperse"],
    "Spray Dyeing": ["Reactive", "Acid"],
    "Ombre/Gradient": ["Reactive", "Vat", "Acid"],
    "Pigment Printing": ["Pigment"],
    "Ice Dyeing (Viral)": ["FiberReactive", "Reactive"],
    "Cyanotype (Sun Printing)": ["Cyanotype", "Photo"]
};

const FABRIC_ADJUSTMENTS = {
    "Rayon (CR)": { factor: 0.9, liquor: 20, saltBase: 70, sodaBase: 18, ureaBase: 10 },
    "Poplin (100% Cotton)": { factor: 1.0, liquor: 20, saltBase: 80, sodaBase: 20, ureaBase: 10 },
    "Super Voile (3)": { factor: 0.95, liquor: 18, saltBase: 75, sodaBase: 18, ureaBase: 10 },
    "Super Voile (4)": { factor: 0.95, liquor: 18, saltBase: 75, sodaBase: 18, ureaBase: 10 },
    "Lanka Voile": { factor: 0.95, liquor: 18, saltBase: 75, sodaBase: 18, ureaBase: 10 },
    "Blue Line (Voile)": { factor: 0.95, liquor: 18, saltBase: 75, sodaBase: 18, ureaBase: 10 },
    "Robin Voile": { factor: 0.95, liquor: 18, saltBase: 75, sodaBase: 18, ureaBase: 10 },
    "2/2 Voile": { factor: 0.95, liquor: 18, saltBase: 75, sodaBase: 18, ureaBase: 10 },
    "Indian Voile": { factor: 0.95, liquor: 18, saltBase: 75, sodaBase: 18, ureaBase: 10 },
    "Full Voile": { factor: 0.95, liquor: 18, saltBase: 75, sodaBase: 18, ureaBase: 10 },
    "Handloom Cotton": { factor: 1.0, liquor: 20, saltBase: 80, sodaBase: 20, ureaBase: 10 },
    "Jubilee": { factor: 1.0, liquor: 20, saltBase: 80, sodaBase: 20, ureaBase: 10 },
    "Viscose Rayon": { factor: 0.9, liquor: 20, saltBase: 70, sodaBase: 18, ureaBase: 10 },
    "Linen (Pure)": { factor: 1.1, liquor: 25, saltBase: 90, sodaBase: 22, ureaBase: 12 },
    "Linen (Cotton Mix)": { factor: 1.05, liquor: 22, saltBase: 85, sodaBase: 20, ureaBase: 11 },
    "Cambric": { factor: 1.0, liquor: 20, saltBase: 80, sodaBase: 20, ureaBase: 10 },
    "Mulmul Cotton": { factor: 0.95, liquor: 18, saltBase: 75, sodaBase: 18, ureaBase: 10 },
    "Twill Cotton": { factor: 1.0, liquor: 20, saltBase: 80, sodaBase: 20, ureaBase: 10 },
    "Canvas (Light)": { factor: 1.1, liquor: 25, saltBase: 90, sodaBase: 22, ureaBase: 12 },
    "Canvas (Heavy)": { factor: 1.15, liquor: 30, saltBase: 100, sodaBase: 25, ureaBase: 15 },
    "Satin Cotton": { factor: 0.95, liquor: 18, saltBase: 75, sodaBase: 18, ureaBase: 10 },
    "Double Gauze": { factor: 0.9, liquor: 16, saltBase: 70, sodaBase: 16, ureaBase: 8 },
    "Crinkle Rayon": { factor: 0.9, liquor: 20, saltBase: 70, sodaBase: 18, ureaBase: 10 },
    "Jersey Cotton": { factor: 1.0, liquor: 20, saltBase: 80, sodaBase: 20, ureaBase: 10 },
    "Organdie": { factor: 0.95, liquor: 18, saltBase: 75, sodaBase: 18, ureaBase: 10 },
    "Corduroy": { factor: 1.1, liquor: 22, saltBase: 85, sodaBase: 20, ureaBase: 12 }
};

// ==============================================
// 2. COLOR FAMILY DEFINITIONS
// ==============================================

const COLOR_FAMILIES = {
    RED: { 
        hueRange: [[0, 20], [340, 360]], 
        baseDOS: 2.0,
        name: "Red",
        emoji: "🔴",
        description: "Pure red to slightly orange/blue red"
    },
    ORANGE: { 
        hueRange: [[21, 45]], 
        baseDOS: 2.2,
        name: "Orange",
        emoji: "🟠",
        description: "Red-orange to yellow-orange"
    },
    YELLOW: { 
        hueRange: [[46, 70]], 
        baseDOS: 2.5,
        name: "Yellow",
        emoji: "🟡",
        description: "Green-yellow to pure yellow"
    },
    GREEN: { 
        hueRange: [[71, 160]], 
        baseDOS: 2.0,
        name: "Green",
        emoji: "🟢",
        description: "Yellow-green to blue-green"
    },
    CYAN: { 
        hueRange: [[161, 200]], 
        baseDOS: 1.8,
        name: "Cyan",
        emoji: "🔵",
        description: "Green-blue to pure cyan"
    },
    BLUE: { 
        hueRange: [[201, 260]], 
        baseDOS: 1.8,
        name: "Blue",
        emoji: "🔵",
        description: "Cyan-blue to violet-blue"
    },
    VIOLET: { 
        hueRange: [[261, 300]], 
        baseDOS: 2.2,
        name: "Violet",
        emoji: "🟣",
        description: "Blue-violet to purple"
    },
    MAGENTA: { 
        hueRange: [[301, 330]], 
        baseDOS: 2.4,
        name: "Magenta",
        emoji: "💜",
        description: "Purple to pink-magenta"
    },
    PINK: { 
        hueRange: [[331, 345]], 
        baseDOS: 2.0,
        name: "Pink",
        emoji: "💗",
        description: "Light red to pink"
    },
    BROWN: { 
        hueRange: [[346, 359], [0, 10]], 
        baseDOS: 2.8,
        name: "Brown",
        emoji: "🟤",
        description: "Dark orange-red to brown"
    },
    BLACK: { 
        special: "value", 
        threshold: 0.15, 
        baseDOS: 6.0,
        name: "Black",
        emoji: "⚫",
        description: "Very dark (value < 0.15)"
    },
    WHITE: { 
        special: "value", 
        threshold: 0.9, 
        baseDOS: 0,
        name: "White",
        emoji: "⚪",
        description: "Very light (value > 0.9)"
    },
    GREY: { 
        special: "saturation", 
        threshold: 0.1, 
        baseDOS: 2.0,
        name: "Grey",
        emoji: "◻️",
        description: "Low saturation (saturation < 0.1)"
    }
};

// ==============================================
// 3. REPRESENTATIVE HSV FOR EACH COLOR FAMILY
// ==============================================

const FAMILY_REPRESENTATIVE_HSV = {
    "RED": { h: 0, s: 1.0, v: 0.8 },
    "ORANGE": { h: 30, s: 1.0, v: 0.8 },
    "YELLOW": { h: 60, s: 1.0, v: 0.9 },
    "GREEN": { h: 120, s: 1.0, v: 0.7 },
    "CYAN": { h: 180, s: 1.0, v: 0.8 },
    "BLUE": { h: 240, s: 1.0, v: 0.7 },
    "VIOLET": { h: 280, s: 1.0, v: 0.7 },
    "MAGENTA": { h: 310, s: 1.0, v: 0.8 },
    "PINK": { h: 340, s: 0.8, v: 0.9 },
    "BROWN": { h: 30, s: 0.8, v: 0.3 },
    "BLACK": { h: 0, s: 0.0, v: 0.05 },
    "WHITE": { h: 0, s: 0.0, v: 0.95 },
    "GREY": { h: 0, s: 0.0, v: 0.5 }
};

// ==============================================
// 4. DEPTH OF SHADE CONFIGURATION
// ==============================================

const DEPTH_ADJUSTMENTS = {
    "veryLight": { min: 0.3, max: 1.0, default: 0.65, factor: 0.3 },
    "light": { min: 1.0, max: 2.0, default: 1.5, factor: 0.5 },
    "mediumLight": { min: 2.0, max: 2.5, default: 2.25, factor: 0.7 },
    "medium": { min: 2.5, max: 3.5, default: 3.0, factor: 1.0 },
    "mediumDark": { min: 3.5, max: 4.5, default: 4.0, factor: 1.3 },
    "dark": { min: 4.5, max: 6.0, default: 5.25, factor: 1.6 },
    "extraDark": { min: 6.0, max: 8.0, default: 7.0, factor: 2.0 }
};

// ==============================================
// 5. WAX COVERAGE CONSTANTS
// ==============================================

const WAX_CRACK_FACTOR = 0.6;

// ==============================================
// 6. LIQUOR RATIO TABLE
// ==============================================

const LIQUOR_RATIO_TABLE = [
    { maxWeight: 100, ratio: 25 },
    { maxWeight: 250, ratio: 20 },
    { maxWeight: 750, ratio: 15 },
    { maxWeight: 1500, ratio: 12 },
    { maxWeight: Infinity, ratio: 10 }
];

// ==============================================
// 7. COLOR REQUIREMENTS FOR ALL FAMILIES
// ==============================================

const COLOR_REQUIREMENTS = {
    "RED": {
        required: ["RED", "ORANGE", "MAGENTA", "PINK"],
        avoid: ["GREEN", "BLUE", "CYAN"],
        primary: "RED",
        secondary: "ORANGE",
        description: "Red requires red/orange/magenta base"
    },
    "ORANGE": {
        required: ["RED", "YELLOW", "ORANGE"],
        avoid: ["BLUE", "GREEN", "VIOLET"],
        primary: "RED",
        secondary: "YELLOW",
        description: "Orange requires red and yellow mix"
    },
    "YELLOW": {
        required: ["YELLOW", "ORANGE", "GREEN"],
        avoid: ["BLUE", "VIOLET", "MAGENTA"],
        primary: "YELLOW",
        secondary: "ORANGE",
        description: "Yellow requires yellow/orange base"
    },
    "GREEN": {
        required: ["BLUE", "YELLOW", "GREEN", "CYAN"],
        avoid: ["RED", "MAGENTA", "ORANGE"],
        primary: "BLUE",
        secondary: "YELLOW",
        description: "Green requires blue and yellow mix"
    },
    "CYAN": {
        required: ["BLUE", "GREEN", "CYAN"],
        avoid: ["RED", "ORANGE", "YELLOW"],
        primary: "BLUE",
        secondary: "GREEN",
        description: "Cyan requires blue and green mix"
    },
    "BLUE": {
        required: ["BLUE", "VIOLET", "CYAN", "GREY"],
        avoid: ["RED", "YELLOW", "ORANGE"],
        primary: "BLUE",
        secondary: "VIOLET",
        description: "Blue requires blue/violet base"
    },
    "VIOLET": {
        required: ["BLUE", "RED", "MAGENTA", "VIOLET"],
        avoid: ["GREEN", "YELLOW", "ORANGE"],
        primary: "BLUE",
        secondary: "RED",
        description: "Violet requires blue and red mix"
    },
    "MAGENTA": {
        required: ["RED", "BLUE", "MAGENTA", "VIOLET"],
        avoid: ["GREEN", "YELLOW", "CYAN"],
        primary: "RED",
        secondary: "BLUE",
        description: "Magenta requires red and blue mix"
    },
    "PINK": {
        required: ["RED", "MAGENTA", "PINK"],
        avoid: ["GREEN", "BLUE", "YELLOW"],
        primary: "RED",
        secondary: "MAGENTA",
        description: "Pink requires red/magenta base"
    },
    "BROWN": {
        required: ["RED", "ORANGE", "YELLOW", "BROWN"],
        avoid: ["BLUE", "GREEN", "VIOLET"],
        primary: "RED",
        secondary: "YELLOW",
        description: "Brown requires warm colors mix"
    },
    "BLACK": {
        required: ["BLUE", "RED", "BROWN", "BLACK", "VIOLET"],
        avoid: ["YELLOW", "ORANGE", "PINK"],
        primary: "BLUE",
        secondary: "RED",
        description: "Black requires dark colors mix"
    },
    "GREY": {
        required: ["BLUE", "GREY", "BLACK", "VIOLET"],
        avoid: ["RED", "YELLOW", "ORANGE"],
        primary: "BLUE",
        secondary: "GREY",
        description: "Grey requires blue/grey/black base"
    },
    "WHITE": {
        required: ["WHITE"],
        avoid: ["BLACK", "BLUE", "RED"],
        primary: "WHITE",
        secondary: "",
        description: "White requires white dye"
    }
};

// ==============================================
// 8. DELTA E THRESHOLD CONFIGURATION
// ==============================================

const DELTA_E_THRESHOLD = {
    AVAILABLE: 30,
    PURCHASE: 15,
    PERFECT: 5,
    GOOD: 10,
    MEDIUM: 15,
    POOR: 25,
    IMPOSSIBLE: 30
};

// ==============================================
// 9. BACKGROUND COMPATIBILITY MATRIX
// ==============================================

const BACKGROUND_COMPATIBILITY = {
    "WHITE": {
        "any": { factor: 1.0, difficulty: "VERY_EASY", message: "✅ White background - perfect for any color" }
    },
    "BLACK": {
        "any": { factor: 1.6, difficulty: "VERY_HARD", message: "⚠️ Black background - needs strong dye concentration" },
        "BLACK": { factor: 1.0, difficulty: "EASY", message: "✅ Black on black - use less dye" },
        "BROWN": { factor: 1.2, difficulty: "MEDIUM", message: "Brown on black - possible" }
    },
    "RED": {
        "RED": { factor: 0.9, difficulty: "EASY", message: "✅ Red on red - use darker shade" },
        "GREEN": { factor: 1.4, difficulty: "HARD", message: "⚠️ Complementary colors - difficult" },
        "ORANGE": { factor: 1.1, difficulty: "MEDIUM", message: "Orange on red - possible" },
        "YELLOW": { factor: 1.2, difficulty: "MEDIUM", message: "Yellow on red - needs strong yellow" },
        "BLUE": { factor: 1.3, difficulty: "HARD", message: "Blue on red - challenging" }
    },
    "BLUE": {
        "BLUE": { factor: 0.9, difficulty: "EASY", message: "✅ Blue on blue - use darker shade" },
        "ORANGE": { factor: 1.4, difficulty: "HARD", message: "⚠️ Complementary colors - difficult" },
        "GREEN": { factor: 1.1, difficulty: "MEDIUM", message: "Green on blue - possible" },
        "VIOLET": { factor: 1.0, difficulty: "EASY", message: "Violet on blue - good" },
        "YELLOW": { factor: 1.3, difficulty: "HARD", message: "Yellow on blue - challenging" }
    },
    "GREEN": {
        "GREEN": { factor: 0.9, difficulty: "EASY", message: "✅ Green on green - use darker shade" },
        "RED": { factor: 1.4, difficulty: "HARD", message: "⚠️ Complementary colors - difficult" },
        "BLUE": { factor: 1.1, difficulty: "MEDIUM", message: "Blue on green - possible" },
        "YELLOW": { factor: 1.0, difficulty: "EASY", message: "Yellow on green - good" }
    },
    "YELLOW": {
        "YELLOW": { factor: 0.9, difficulty: "EASY", message: "✅ Yellow on yellow - use darker shade" },
        "VIOLET": { factor: 1.4, difficulty: "HARD", message: "⚠️ Complementary colors - difficult" },
        "ORANGE": { factor: 1.0, difficulty: "EASY", message: "Orange on yellow - good" },
        "GREEN": { factor: 1.1, difficulty: "MEDIUM", message: "Green on yellow - possible" }
    }
};

// ==============================================
// 10. RGB TO HSV CONVERSION
// ==============================================

function rgbToHsv(r, g, b) {
    r = Math.min(255, Math.max(0, Number(r) || 0));
    g = Math.min(255, Math.max(0, Number(g) || 0));
    b = Math.min(255, Math.max(0, Number(b) || 0));
    
    r /= 255; g /= 255; b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    
    let h = 0;
    let s = max === 0 ? 0 : diff / max;
    let v = max;
    
    if (diff !== 0) {
        if (max === r) {
            h = ((g - b) / diff) % 6;
        } else if (max === g) {
            h = (b - r) / diff + 2;
        } else {
            h = (r - g) / diff + 4;
        }
        h = Math.round(h * 60);
        if (h < 0) h += 360;
    }
    
    return { h, s, v };
}

// ==============================================
// 11. HSV TO RGB CONVERSION
// ==============================================

function hsvToRgb(h, s, v) {
    let r, g, b;
    const i = Math.floor(h / 60);
    const f = h / 60 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
    }

    return [
        Math.round(r * 255),
        Math.round(g * 255),
        Math.round(b * 255)
    ];
}

// ==============================================
// 12. RGB TO LAB CONVERSION
// ==============================================

function rgbToLab(r, g, b) {
    r = r / 255; g = g / 255; b = b / 255;
    
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
    
    r *= 100; g *= 100; b *= 100;
    
    const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
    const y = r * 0.2126729 + g * 0.7151522 + b * 0.0721750;
    const z = r * 0.0193339 + g * 0.1191920 + b * 0.9503041;
    
    const xn = 95.047; const yn = 100.0; const zn = 108.883;
    
    const fx = x / xn > 0.008856 ? Math.pow(x / xn, 1/3) : (903.3 * x / xn + 16) / 116;
    const fy = y / yn > 0.008856 ? Math.pow(y / yn, 1/3) : (903.3 * y / yn + 16) / 116;
    const fz = z / zn > 0.008856 ? Math.pow(z / zn, 1/3) : (903.3 * z / zn + 16) / 116;
    
    return {
        l: 116 * fy - 16,
        a: 500 * (fx - fy),
        b: 200 * (fy - fz)
    };
}

// ==============================================
// 13. DELTA E CALCULATION
// ==============================================

function calculateDeltaE(lab1, lab2) {
    const dl = lab1.l - lab2.l;
    const da = lab1.a - lab2.a;
    const db = lab1.b - lab2.b;
    return Math.sqrt(dl * dl + da * da + db * db);
}

// ==============================================
// 14. COLOR FAMILY DETECTION
// ==============================================

function detectColorFamily(r, g, b) {
    const { h, s, v } = rgbToHsv(r, g, b);
    
    if (v < COLOR_FAMILIES.BLACK.threshold) {
        return { family: "BLACK", data: COLOR_FAMILIES.BLACK, hsv: { h, s, v } };
    }
    
    if (v > COLOR_FAMILIES.WHITE.threshold && s < 0.1) {
        return { family: "WHITE", data: COLOR_FAMILIES.WHITE, hsv: { h, s, v } };
    }
    
    if (s < COLOR_FAMILIES.GREY.threshold) {
        return { family: "GREY", data: COLOR_FAMILIES.GREY, hsv: { h, s, v } };
    }
    
    for (const [family, data] of Object.entries(COLOR_FAMILIES)) {
        if (data.hueRange) {
            for (const range of data.hueRange) {
                if (h >= range[0] && h <= range[1]) {
                    return { family, data, hsv: { h, s, v } };
                }
            }
        }
    }
    
    if (h <= 30 || h >= 330) return { family: "RED", data: COLOR_FAMILIES.RED, hsv: { h, s, v } };
    if (h <= 60) return { family: "ORANGE", data: COLOR_FAMILIES.ORANGE, hsv: { h, s, v } };
    if (h <= 150) return { family: "GREEN", data: COLOR_FAMILIES.GREEN, hsv: { h, s, v } };
    if (h <= 200) return { family: "CYAN", data: COLOR_FAMILIES.CYAN, hsv: { h, s, v } };
    if (h <= 260) return { family: "BLUE", data: COLOR_FAMILIES.BLUE, hsv: { h, s, v } };
    if (h <= 300) return { family: "VIOLET", data: COLOR_FAMILIES.VIOLET, hsv: { h, s, v } };
    return { family: "MAGENTA", data: COLOR_FAMILIES.MAGENTA, hsv: { h, s, v } };
}

// ==============================================
// ==============================================
// ==============================================
// 15. GET DYE COLOR FAMILY - OPTIMIZED VERSION
// ==============================================

// Cache එකක් හදාගන්න (performance සඳහා)
const colorFamilyCache = new Map();

function getDyeColorFamily(dye) {
    // Validate input
    if (!dye) {
        return "UNKNOWN";
    }
    
    // Cache එකෙන් බලන්න
    if (colorFamilyCache.has(dye.id)) {
        return colorFamilyCache.get(dye.id);
    }
    
    // Make sure r,g,b exist (ඒවා නැතුව HSV calculate කරන්න බැහැ)
    if (dye.r === undefined || dye.g === undefined || dye.b === undefined) {
        console.log(`⚠️ Dye missing RGB: ${dye.name} (id:${dye.id})`);
        colorFamilyCache.set(dye.id, "UNKNOWN");
        return "UNKNOWN";
    }
    
    try {
        const { h, s, v } = rgbToHsv(dye.r, dye.g, dye.b);
        const name = (dye.name || "").toUpperCase();
        
        // ===== 1. Name-based detection (මේක 100% වැඩ කරයි) =====
        if (name.includes('BROWN')) {
            console.log(`✅ BROWN detected by name: ${dye.name}`);
            colorFamilyCache.set(dye.id, "BROWN");
            return "BROWN";
        }
        
        // Special name-based cases
        if (name.includes('NAVY') || name.includes('ROYAL BLUE') || name.includes('BLUE 3R')) {
            colorFamilyCache.set(dye.id, "BLUE");
            return "BLUE";
        }
        
        if (name.includes('YELLOW') || name.includes('GOLDEN') || name.includes('KAHA')) {
            colorFamilyCache.set(dye.id, "YELLOW");
            return "YELLOW";
        }
        
        if (name.includes('TURQUOISE') || name.includes('CYAN')) {
            colorFamilyCache.set(dye.id, "CYAN");
            return "CYAN";
        }
        
        // ===== 2. Value-based detection =====
        if (v < 0.15) {
            colorFamilyCache.set(dye.id, "BLACK");
            return "BLACK";
        }
        if (v > 0.9 && s < 0.1) {
            colorFamilyCache.set(dye.id, "WHITE");
            return "WHITE";
        }
        if (s < 0.1) {
            colorFamilyCache.set(dye.id, "GREY");
            return "GREY";
        }
        
        // ===== 3. BROWN detection by HSV =====
        // Brown typically has low-medium value and medium saturation
        if (v < 0.6 && s > 0.2 && s < 0.8) {
            // Brown hues are usually in red-orange-yellow range
            if ((h >= 0 && h <= 60) || (h >= 330 && h <= 360)) {
                console.log(`✅ BROWN detected by HSV: ${dye.name} (h:${h}, s:${s}, v:${v})`);
                colorFamilyCache.set(dye.id, "BROWN");
                return "BROWN";
            }
        }
        
        // ===== 4. Color families by hue =====
        let family;
        if ((h >= 0 && h <= 20) || (h >= 340 && h <= 360)) family = "RED";
        else if (h >= 21 && h <= 45) family = "ORANGE";
        else if (h >= 46 && h <= 70) family = "YELLOW";
        else if (h >= 71 && h <= 160) family = "GREEN";
        else if (h >= 161 && h <= 200) family = "CYAN";
        else if (h >= 201 && h <= 260) family = "BLUE";
        else if (h >= 261 && h <= 300) family = "VIOLET";
        else if (h >= 301 && h <= 330) family = "MAGENTA";
        else if (h >= 331 && h <= 345) family = "PINK";
        else family = "BROWN";
        
        colorFamilyCache.set(dye.id, family);
        return family;
        
    } catch (error) {
        console.error(`Error detecting color family for ${dye.name}:`, error);
        colorFamilyCache.set(dye.id, "UNKNOWN");
        return "UNKNOWN";
    }
}
// ==============================================
// 16. CHECK BACKGROUND COMPATIBILITY
// ==============================================

function checkBackgroundCompatibility(bgFamily, targetFamily) {
    if (BACKGROUND_COMPATIBILITY[bgFamily]) {
        if (BACKGROUND_COMPATIBILITY[bgFamily][targetFamily]) {
            return {
                compatible: true,
                ...BACKGROUND_COMPATIBILITY[bgFamily][targetFamily]
            };
        } else if (BACKGROUND_COMPATIBILITY[bgFamily]["any"]) {
            return {
                compatible: true,
                ...BACKGROUND_COMPATIBILITY[bgFamily]["any"]
            };
        }
    }
    
    const complementaryPairs = {
        "RED": "GREEN", "GREEN": "RED",
        "BLUE": "ORANGE", "ORANGE": "BLUE",
        "YELLOW": "VIOLET", "VIOLET": "YELLOW",
        "CYAN": "RED", "MAGENTA": "GREEN"
    };
    
    if (complementaryPairs[bgFamily] === targetFamily) {
        return {
            compatible: true,
            difficulty: "HARD",
            message: `⚠️ ${bgFamily} background is complementary to ${targetFamily}`,
            factor: 1.4
        };
    }
    
    if (bgFamily === targetFamily) {
        return {
            compatible: true,
            difficulty: "EASY",
            message: `✅ Same color family - good for darker shades`,
            factor: 0.9
        };
    }
    
    const darkFamilies = ["BLACK", "BROWN", "GREY"];
    if (darkFamilies.includes(bgFamily) && !darkFamilies.includes(targetFamily)) {
        return {
            compatible: true,
            difficulty: "HARD",
            message: `⚠️ Dark ${bgFamily} background. Light ${targetFamily} may not show well`,
            factor: 1.5
        };
    }
    
    return {
        compatible: true,
        difficulty: "NORMAL",
        message: `Working with ${bgFamily} background for ${targetFamily}`,
        factor: 1.2
    };
}

// ==============================================
// 17. CALCULATE BACKGROUND INFLUENCE
// ==============================================

function calculateBackgroundInfluence(targetHSV, bgHSV) {
    let hueDiff = Math.abs(targetHSV.h - bgHSV.h);
    hueDiff = Math.min(hueDiff, 360 - hueDiff);
    
    const satDiff = Math.abs(targetHSV.s - bgHSV.s);
    const valDiff = Math.abs(targetHSV.v - bgHSV.v);
    
    let influence = 0;
    
    if (hueDiff < 30) influence += 0.4 * (1 - hueDiff/30);
    if (satDiff < 0.3) influence += 0.3 * (1 - satDiff/0.3);
    if (valDiff < 0.3) influence += 0.3 * (1 - valDiff/0.3);
    
    return Math.min(1, influence);
}

// ==============================================
function calculateBackgroundAdjustment(targetRGB, bgRGB) {
    const targetColor = detectColorFamily(targetRGB[0], targetRGB[1], targetRGB[2]);
    const bgColor = detectColorFamily(bgRGB[0], bgRGB[1], bgRGB[2]);
    
    const targetFamily = targetColor.family;
    const bgFamily = bgColor.family;
    
    const targetHSV = targetColor.hsv;
    const bgHSV = bgColor.hsv;
    
    // 1. Hue difference (0-180)
    let hueDiff = Math.abs(targetHSV.h - bgHSV.h);
    hueDiff = Math.min(hueDiff, 360 - hueDiff);
    
    // 2. BASE FACTOR - Color family matrix
    let factor = 1.0;
    
    const familyFactors = {
        "WHITE": { "any": 1.0 },
        "BLACK": { "any": 1.6, "BLACK": 1.0, "BROWN": 1.2, "GREY": 1.2 },
        "RED": { "RED": 0.9, "GREEN": 1.5, "ORANGE": 1.1, "YELLOW": 1.2, 
                "BLUE": 1.3, "PINK": 1.0, "MAGENTA": 1.0, "BROWN": 1.1 },
        "BLUE": { "BLUE": 0.9, "ORANGE": 1.5, "GREEN": 1.1, "VIOLET": 1.0, 
                 "YELLOW": 1.3, "CYAN": 1.0, "MAGENTA": 1.2, "BROWN": 1.2 },
        "GREEN": { "GREEN": 0.9, "RED": 1.5, "BLUE": 1.1, "YELLOW": 1.0, 
                  "CYAN": 1.0, "BROWN": 1.2, "ORANGE": 1.2 },
        "YELLOW": { "YELLOW": 0.9, "VIOLET": 1.5, "ORANGE": 1.0, "GREEN": 1.1, 
                   "BROWN": 1.2, "RED": 1.2 },
        "ORANGE": { "ORANGE": 0.9, "BLUE": 1.5, "RED": 1.1, "YELLOW": 1.0, 
                   "BROWN": 1.1, "GREEN": 1.2 },
        "VIOLET": { "VIOLET": 0.9, "YELLOW": 1.5, "BLUE": 1.1, "MAGENTA": 1.0, 
                   "PINK": 1.2, "RED": 1.2 },
        "CYAN": { "CYAN": 0.9, "RED": 1.5, "BLUE": 1.1, "GREEN": 1.0, 
                 "MAGENTA": 1.2, "YELLOW": 1.2 },
        "MAGENTA": { "MAGENTA": 0.9, "GREEN": 1.5, "RED": 1.1, "VIOLET": 1.0, 
                    "PINK": 1.0, "BLUE": 1.2 },
        "PINK": { "PINK": 0.9, "GREEN": 1.4, "RED": 1.0, "MAGENTA": 1.1, 
                 "VIOLET": 1.2, "BLUE": 1.2 },
        "BROWN": { "BROWN": 0.9, "BLUE": 1.3, "RED": 1.1, "YELLOW": 1.2, 
                  "GREEN": 1.2, "ORANGE": 1.1 },
        "GREY": { "GREY": 0.9, "any": 1.2, "BLACK": 1.0, "WHITE": 1.0 }
    };
    
    // Apply family factors
    if (familyFactors[bgFamily]) {
        if (familyFactors[bgFamily][targetFamily]) {
            factor = familyFactors[bgFamily][targetFamily];
        } else if (familyFactors[bgFamily]["any"]) {
            factor = familyFactors[bgFamily]["any"];
        } else {
            factor = 1.2;
        }
    } else {
        factor = 1.2;
    }
    
    // 3. Hue-based adjustment
    let hueFactor = 1.0;
    if (hueDiff < 20) {
        hueFactor = 0.9;
    } else if (hueDiff < 45) {
        hueFactor = 1.0;
    } else if (hueDiff < 90) {
        hueFactor = 1.1;
    } else if (hueDiff < 135) {
        hueFactor = 1.2;
    } else {
        hueFactor = 1.4;
    }
    
    // 4. Saturation adjustment
    let satFactor = 1.0;
    if (bgHSV.s < 0.2 && targetHSV.s > 0.7) {
        satFactor = 0.9;
    } else if (bgHSV.s > 0.7 && targetHSV.s < 0.3) {
        satFactor = 1.2;
    } else if (Math.abs(bgHSV.s - targetHSV.s) > 0.5) {
        satFactor = 1.1;
    }
    
    // 5. Value (brightness) adjustment
    let valFactor = 1.0;
    const valDiff = Math.abs(targetHSV.v - bgHSV.v);
    
    if (bgHSV.v < 0.2) { // Dark background
        if (targetHSV.v > 0.7) {
            valFactor = 1.6;
        } else if (targetHSV.v > 0.4) {
            valFactor = 1.4;
        } else if (targetHSV.v < 0.2) {
            valFactor = 1.0;
        } else {
            valFactor = 1.2;
        }
    } else if (bgHSV.v > 0.8) { // Light background
        if (targetHSV.v < 0.3) {
            valFactor = 1.3;
        } else if (targetHSV.v > 0.7) {
            valFactor = 0.95;
        }
    } else {
        if (valDiff > 0.5) {
            valFactor = 1.2;
        }
    }
    
    // 6. COMBINE FACTORS
    let finalFactor = factor * hueFactor * satFactor * valFactor;
    
    // 7. SPECIAL CASE OVERRIDES
    if (bgFamily === "WHITE") {
        finalFactor = 1.0;
    }
    
    if (bgFamily === "BLACK" && targetFamily === "BLACK") {
        finalFactor = 1.0;
    } else if (bgFamily === "BLACK") {
        finalFactor = Math.min(1.8, Math.max(1.2, finalFactor));
    }
    
    // Complementary color detection
    const complementaryPairs = {
        "RED": "GREEN", "GREEN": "RED",
        "BLUE": "ORANGE", "ORANGE": "BLUE",
        "YELLOW": "VIOLET", "VIOLET": "YELLOW"
    };
    
    if (complementaryPairs[bgFamily] === targetFamily) {
        finalFactor = Math.max(finalFactor, 1.4);
    }
    
    if (bgFamily === targetFamily) {
        finalFactor = Math.min(finalFactor, 0.95);
    }
    
    // Clamp to reasonable range
    finalFactor = Math.max(0.7, Math.min(2.0, finalFactor));
    
    // Determine difficulty level
    let difficulty = "NORMAL";
    if (finalFactor <= 0.9) difficulty = "EASY";
    else if (finalFactor <= 1.1) difficulty = "MEDIUM";
    else if (finalFactor <= 1.3) difficulty = "HARD";
    else difficulty = "VERY_HARD";
    
    // Generate user-friendly message
    let message = "";
    if (bgFamily === targetFamily) {
        message = `✅ ${bgFamily} පසුබිම මත ${targetFamily} පාට - පහසුයි (factor: ${finalFactor.toFixed(2)})`;
    } else if (complementaryPairs[bgFamily] === targetFamily) {
        message = `⚠️ ${bgFamily} සහ ${targetFamily} ප්‍රතිවිරුද්ධ පාට - ඩයි ප්‍රමාණය ${Math.round((finalFactor-1)*100)}% වැඩි කරන්න`;
    } else if (bgHSV.v < 0.2 && targetHSV.v > 0.6) {
        message = `⚠️ අඳුරු ${bgFamily} පසුබිම මත ලා ${targetFamily} පාට - ඩයි ප්‍රමාණය ${Math.round((finalFactor-1)*100)}% වැඩි කරන්න`;
    } else {
        message = `${targetFamily} පාට ${bgFamily} පසුබිම මත - adjustment factor: ${finalFactor.toFixed(2)}`;
    }
    
    return {
        factor: finalFactor,
        difficulty: difficulty,
        message: message,
        isBgDarker: bgHSV.v < targetHSV.v,
        brightnessDiff: targetHSV.v - bgHSV.v,
        hueDiff: hueDiff,
        bgFamily: bgFamily,
        targetFamily: targetFamily,
        rawComponents: {
            familyFactor: factor,
            hueFactor: hueFactor,
            satFactor: satFactor,
            valFactor: valFactor
        }
    };
}
// ==============================================
function applyBackgroundAdjustmentToDeltaE(deltaE, bgAdjustment, dye, targetFamily) {
    if (!bgAdjustment || !bgAdjustment.factor) {
        return deltaE;
    }
    
    let adjustedDeltaE = deltaE;
    
    // Background factor එක apply කරන්න
    adjustedDeltaE = deltaE * bgAdjustment.factor;
    
    const dyeFamily = getDyeColorFamily(dye);
    
    // Target family එකට ගැලපෙන dyes වලට discount එකක් දෙන්න
    if (dyeFamily === targetFamily) {
        adjustedDeltaE = adjustedDeltaE * 0.85;
    }
    
    // Background එකට අනුව additional adjustments
    if (bgAdjustment.bgFamily === "RED" && dyeFamily === "GREEN") {
        adjustedDeltaE = adjustedDeltaE * 1.3;
    } else if (bgAdjustment.bgFamily === "RED" && (dyeFamily === "YELLOW" || dyeFamily === "ORANGE")) {
        adjustedDeltaE = adjustedDeltaE * 0.9;
    }
    
    if (bgAdjustment.bgFamily === "BLUE" && dyeFamily === "YELLOW") {
        adjustedDeltaE = adjustedDeltaE * 1.2;
    }
    
    if (bgAdjustment.bgFamily === "WHITE") {
        adjustedDeltaE = adjustedDeltaE;
    }
    
    if (bgAdjustment.bgFamily === "BLACK") {
        const dyeHSV = rgbToHsv(dye.r, dye.g, dye.b);
        if (dyeHSV.v < 0.3) {
            adjustedDeltaE = adjustedDeltaE * 0.9;
        } else if (dyeHSV.v > 0.6) {
            adjustedDeltaE = adjustedDeltaE * 1.3;
        }
    }
    
    // Ensure deltaE stays within reasonable range
    adjustedDeltaE = Math.min(100, Math.max(0, adjustedDeltaE));
    
    return adjustedDeltaE;
}

// ==============================================
// 20. IS DYE IN STOCK
// ==============================================

function isDyeInStock(dye) {
    const saved = window.dyeSettings?.[dye.name];
    return saved && saved.available === true && saved.price && parseFloat(saved.price) > 0;
}

// ==============================================
// ==============================================
// ==============================================
// 21. IS DYE AVAILABLE FOR PURCHASE - PRICE SET (0, BLANK, OR ANY) ALL INCLUDED
// ==============================================
function isDyeAvailableForPurchase(dye) {
    const saved = window.dyeSettings?.[dye.name];
    
    // Stock එකේ තියෙන dyes purchase list එකට එකතු නොකරන්න
    if (saved && saved.available === true) {
        return false;
    }
    
    // Price එක set කරලා තියෙනවා නම් (0, blank, 10, 100, etc.), purchase list එකට එකතු කරන්න
    if (saved && saved.price !== undefined) {
        return true;
    }
    
    // Fallback: commonDyes list එක (old method)
    const commonDyes = [
        "VIOLET 5R", "VIOLET RR", "Read Purple 3RE", "Reactive Voilet", "MAGENTHA MP",
        "YELLOW 3R", "YELLOW GR", "YELLOW 4G", "GOLDEN YELLOW",
        "BLUE 3R", "NAVY BLUE", "TURQUOISE BLUE", "ROYAL BLUE"
    ];
    
    return commonDyes.includes(dye.name);
}
// ==============================================
// 22. CLASSIFY DELTA E
// ==============================================

function classifyDeltaE(deltaE) {
    if (deltaE < DELTA_E_THRESHOLD.PERFECT) return { text: "PERFECT", emoji: "✅", color: "#39ff14" };
    if (deltaE < DELTA_E_THRESHOLD.GOOD) return { text: "GOOD", emoji: "👍", color: "#0ff" };
    if (deltaE < DELTA_E_THRESHOLD.MEDIUM) return { text: "MEDIUM", emoji: "⚠️", color: "#ffd700" };
    if (deltaE < DELTA_E_THRESHOLD.POOR) return { text: "POOR", emoji: "⚠️⚠️", color: "#ff9900" };
    return { text: "IMPOSSIBLE", emoji: "❌", color: "#ff3131" };
}

// ==============================================
// 23. MIX DYES
// ==============================================

function mixDyes(dye1, dye2, dye3 = null, p1, p2, p3 = 0) {
    if (dye3) {
        const r = dye1.r * p1 + dye2.r * p2 + dye3.r * p3;
        const g = dye1.g * p1 + dye2.g * p2 + dye3.g * p3;
        const b = dye1.b * p1 + dye2.b * p2 + dye3.b * p3;
        return [Math.round(r), Math.round(g), Math.round(b)];
    } else {
        const r = dye1.r * p1 + dye2.r * p2;
        const g = dye1.g * p1 + dye2.g * p2;
        const b = dye1.b * p1 + dye2.b * p2;
        return [Math.round(r), Math.round(g), Math.round(b)];
    }
}

// ==============================================
// ==============================================
// 24. GENERATE TWO DYE MIXES WITH BACKGROUND - FIXED WITH MANDATORY RULES
// ==============================================

function generateTwoDyeMixesWithBackground(dyes, targetLab, bgAdjustment, targetFamily, preferredFamilies = [], avoidedFamilies = [], mandatoryRules = []) {
    const options = [];
    
    console.log(`🎯 Generating 2-dye mixes with ${dyes.length} dyes`);
    console.log(`📋 2-mix Mandatory Rules:`, mandatoryRules);
    
    let totalCombinations = 0;
    let skippedDueToMandatory = 0;
    let addedCount = 0;
    
    for (let i = 0; i < Math.min(20, dyes.length); i++) {
        for (let j = i + 1; j < Math.min(20, dyes.length); j++) {
            const dye1 = dyes[i];
            const dye2 = dyes[j];
            
            const families = [dye1.family, dye2.family];
            totalCombinations++;
            
            // ===== ✅ CHECK MANDATORY RULES =====
            let meetsMandatory = true;
            if (mandatoryRules && mandatoryRules.length > 0) {
                for (const rule of mandatoryRules) {
                    const hasMandatoryFamily = families.includes(rule.family);
                    if (!hasMandatoryFamily) {
                        meetsMandatory = false;
                        skippedDueToMandatory++;
                        console.log(`   ❌ 2-mix SKIP: ${families.join(',')} - missing ${rule.family}`);
                        break;
                    }
                }
            }
            
            if (!meetsMandatory) {
                continue; // Skip this mix
            }
            
            // ===== CHECK AVOIDED FAMILIES =====
            if (avoidedFamilies.length > 0) {
                const allAvoided = families.every(f => avoidedFamilies.includes(f));
                if (allAvoided) {
                    console.log(`   ❌ 2-mix SKIP: ${families.join(',')} - all avoided`);
                    continue;
                }
            }
            
            const hasPreferred = preferredFamilies.length > 0 ?
                families.some(f => preferredFamilies.includes(f)) : false;
            
            for (let p1 = 10; p1 <= 90; p1 += 10) {
                const p2 = 100 - p1;
                const mixedRGB = mixDyes(dye1, dye2, null, p1 / 100, p2 / 100);
                const mixedLab = rgbToLab(mixedRGB[0], mixedRGB[1], mixedRGB[2]);
                
                let deltaE = calculateDeltaE(targetLab, mixedLab);
                
                deltaE = applyBackgroundAdjustmentToDeltaE(deltaE, bgAdjustment, dye1, targetFamily);
                deltaE = applyBackgroundAdjustmentToDeltaE(deltaE, bgAdjustment, dye2, targetFamily);
                deltaE = deltaE / 2;
                
                if (hasPreferred) {
                    deltaE = deltaE * 0.9;
                }
                
                const families = [dye1.family, dye2.family];
                const hasTargetFamily = families.includes(targetFamily);
                
                if (hasTargetFamily) {
                    deltaE = deltaE * 0.85;
                }
                
                // Background-specific bonuses
                if (bgAdjustment.bgFamily === "RED" && (families.includes("YELLOW") || families.includes("ORANGE"))) {
                    deltaE = deltaE * 0.9;
                }
                
                if (bgAdjustment.bgFamily === "BLUE" && families.includes("YELLOW")) {
                    deltaE = deltaE * 0.95;
                }
                
                if (bgAdjustment.bgFamily === "YELLOW" && families.includes("GREEN")) {
                    deltaE = deltaE * 0.9;
                }
                
                // Only add if deltaE is reasonable
                if (deltaE < 30) {
                    options.push({
                        dyes: [dye1, dye2],
                        percentages: [p1, p2],
                        deltaE,
                        mixedRGB,
                        families,
                        classification: classifyDeltaE(deltaE),
                        bgAdjusted: true
                    });
                    addedCount++;
                    
                    if (families.includes("BROWN")) {
                        console.log(`   ✅ 2-mix ADDED with BROWN: ${families.join(',')} ${p1}/${p2} ΔE=${deltaE.toFixed(2)}`);
                    }
                }
            }
        }
    }
    
    console.log(`📊 2-mix summary: Total=${totalCombinations}, Skipped=${skippedDueToMandatory}, Added=${addedCount}`);
    
    return options.sort((a, b) => a.deltaE - b.deltaE);
}
// ==============================================
// ==============================================
// 25. GENERATE THREE DYE MIXES WITH BACKGROUND - ULTIMATE FIX
// ==============================================

function generateThreeDyeMixesWithBackground(dyes, targetLab, bgAdjustment, targetFamily, preferredFamilies = [], avoidedFamilies = [], mandatoryRules = []) {
    const options = [];
    const commonRatios = [
        [33, 33, 34], [50, 25, 25], [25, 50, 25], [25, 25, 50],
        [60, 20, 20], [20, 60, 20], [20, 20, 60], [40, 30, 30],
        [70, 15, 15], [15, 70, 15], [15, 15, 70]
    ];
    
    console.log("%c🔴🔴🔴 3-DYE MIX GENERATION STARTED 🔴🔴🔴", "color: #ff0000; font-size: 14px");
    console.log(`📊 Total dyes available: ${dyes.length}`);
    console.log(`🎯 Target Family: ${targetFamily}`);
    console.log(`📋 Mandatory Rules:`, mandatoryRules);
    console.log(`⭐ Preferred Families:`, preferredFamilies);
    console.log(`❌ Avoided Families:`, avoidedFamilies);
    
    // Filter dyes to only those that might work
    const relevantDyes = dyes.filter(dye => {
        // Always include target family
        if (dye.family === targetFamily) return true;
        
        // Include preferred families
        if (preferredFamilies.includes(dye.family)) return true;
        
        // Include mandatory families
        if (mandatoryRules.some(rule => rule.family === dye.family)) return true;
        
        // Include if not avoided
        return !avoidedFamilies.includes(dye.family);
    });
    
    console.log(`🎨 Relevant dyes after filtering: ${relevantDyes.length}`);
    
    let totalCombinations = 0;
    let skippedDueToMandatory = 0;
    let skippedDueToAvoided = 0;
    let addedCount = 0;
    
    for (let i = 0; i < Math.min(10, relevantDyes.length); i++) {
        for (let j = i + 1; j < Math.min(10, relevantDyes.length); j++) {
            for (let k = j + 1; k < Math.min(10, relevantDyes.length); k++) {
                
                const dye1 = relevantDyes[i];
                const dye2 = relevantDyes[j];
                const dye3 = relevantDyes[k];
                
                const families = [dye1.family, dye2.family, dye3.family];
                totalCombinations++;
                
                // ===== CHECK MANDATORY RULES =====
                let meetsMandatory = true;
                if (mandatoryRules && mandatoryRules.length > 0) {
                    for (const rule of mandatoryRules) {
                        const hasMandatoryFamily = families.includes(rule.family);
                        if (!hasMandatoryFamily) {
                            meetsMandatory = false;
                            skippedDueToMandatory++;
                            console.log(`   ❌ SKIP: ${families.join(',')} - missing ${rule.family}`);
                            break;
                        }
                    }
                }
                
                if (!meetsMandatory) {
                    continue;
                }
                
                // Skip if all three dyes are in avoided families
                if (avoidedFamilies.length > 0) {
                    const allAvoided = families.every(f => avoidedFamilies.includes(f));
                    if (allAvoided) {
                        skippedDueToAvoided++;
                        console.log(`   ❌ SKIP: ${families.join(',')} - all avoided`);
                        continue;
                    }
                }
                
                // Check if this combination has any preferred family
                const hasPreferred = preferredFamilies.length > 0 ? 
                    families.some(f => preferredFamilies.includes(f)) : false;
                
                const bgFamily = bgAdjustment?.bgFamily || "UNKNOWN";
                
                for (const ratio of commonRatios) {
                    const mixedRGB = mixDyes(
                        dye1, dye2, dye3,
                        ratio[0] / 100, ratio[1] / 100, ratio[2] / 100
                    );
                    const mixedLab = rgbToLab(mixedRGB[0], mixedRGB[1], mixedRGB[2]);
                    
                    let deltaE = calculateDeltaE(targetLab, mixedLab);
                    
                    deltaE = applyBackgroundAdjustmentToDeltaE(deltaE, bgAdjustment, dye1, targetFamily);
                    deltaE = applyBackgroundAdjustmentToDeltaE(deltaE, bgAdjustment, dye2, targetFamily);
                    deltaE = applyBackgroundAdjustmentToDeltaE(deltaE, bgAdjustment, dye3, targetFamily);
                    deltaE = deltaE / 3;
                    
                    if (hasPreferred) {
                        deltaE = deltaE * 0.9;
                    }
                    
                    const preferredCount = families.filter(f => preferredFamilies.includes(f)).length;
                    if (preferredCount >= 2) {
                        deltaE = deltaE * 0.85;
                    }
                    
                    const avoidedCount = families.filter(f => avoidedFamilies.includes(f)).length;
                    if (avoidedCount >= 2) {
                        deltaE = deltaE * 1.2;
                    } else if (avoidedCount === 1) {
                        deltaE = deltaE * 1.1;
                    }
                    
                    // Background-specific bonuses
                    if (bgFamily === "RED" && (families.includes("YELLOW") || families.includes("ORANGE"))) {
                        deltaE = deltaE * 0.9;
                    }
                    
                    if (bgFamily === "BLUE" && families.includes("YELLOW")) {
                        deltaE = deltaE * 0.95;
                    }
                    
                    if (bgFamily === "YELLOW" && families.includes("GREEN")) {
                        deltaE = deltaE * 0.9;
                    }
                    
                    if (bgFamily === "GREEN" && families.includes("YELLOW")) {
                        deltaE = deltaE * 0.9;
                    }
                    
                    if (bgFamily === "WHITE") {
                        deltaE = deltaE * 1.0;
                    }
                    
                    if (bgFamily === "BLACK") {
                        const mixedHSV = rgbToHsv(mixedRGB[0], mixedRGB[1], mixedRGB[2]);
                        if (mixedHSV.v < 0.3) {
                            deltaE = deltaE * 0.9;
                        } else if (mixedHSV.v > 0.7) {
                            deltaE = deltaE * 1.2;
                        }
                    }
                    
                    const hasTargetFamily = families.includes(targetFamily);
                    
                    if (hasTargetFamily) {
                        deltaE = deltaE * 0.9;
                    }
                    
                    // Only add if deltaE is reasonable
                    if (deltaE < 30) {
                        options.push({
                            dyes: [dye1, dye2, dye3],
                            percentages: ratio,
                            deltaE,
                            mixedRGB,
                            families,
                            classification: classifyDeltaE(deltaE),
                            bgAdjusted: true
                        });
                        addedCount++;
                        
                        console.log(`   ✅ ADDED: ${families.join(',')} (${ratio.join('/')}) ΔE=${deltaE.toFixed(2)}`);
                    }
                }
            }
        }
    }
    
    console.log("%c🔴🔴🔴 3-DYE MIX SUMMARY 🔴🔴🔴", "color: #ff0000; font-size: 14px");
    console.log(`📊 Total combinations checked: ${totalCombinations}`);
    console.log(`❌ Skipped (missing mandatory): ${skippedDueToMandatory}`);
    console.log(`❌ Skipped (all avoided): ${skippedDueToAvoided}`);
    console.log(`✅ Successfully added: ${addedCount}`);
    
    if (addedCount === 0) {
        console.log("%c⚠️⚠️⚠️ NO 3-DYE MIXES GENERATED! ⚠️⚠️⚠️", "color: #ff9900; font-size: 16px");
        console.log("Possible reasons:");
        console.log("1. Mandatory rules too strict - no combinations found");
        console.log("2. Not enough relevant dyes");
        console.log("3. All combinations have deltaE > 30");
    }
    
    const sorted = options.sort((a, b) => a.deltaE - b.deltaE);
    console.log(`🏆 Best 3-dye mix deltaE: ${sorted[0]?.deltaE.toFixed(2) || 'N/A'}`);
    
    return sorted;
}
// ==============================================
// ==============================================
// 26. GENERATE MIX PURCHASE OPTIONS - FIXED (NO SAME DYE)
// ==============================================

function generateMixPurchaseOptions(targetLab, stockDyes, purchaseDyes, targetFamily, bgAdjustment) {
    const mixOptions = [];
    const requirements = COLOR_REQUIREMENTS[targetFamily] || { required: [], avoid: [] };
    
    // Track added combinations to avoid duplicates
    const addedCombinations = new Set();
    
    for (let i = 0; i < Math.min(20, stockDyes.length); i++) {
        for (let j = 0; j < Math.min(20, purchaseDyes.length); j++) {
            
            const stockDye = stockDyes[i];
            const purchaseDye = purchaseDyes[j];
            
            // ❌ IMPORTANT: එකම dye එක දෙපාරක් එන එක වලක්වන්න
            if (stockDye.name === purchaseDye.name) {
                continue; // Same dye - skip
            }
            
            const families = [stockDye.family, purchaseDye.family];
            
            let hasRequired = true;
            if (requirements.required.length > 0) {
                hasRequired = families.some(f => requirements.required.includes(f));
            }
            
            const hasAvoid = families.some(f => requirements.avoid.includes(f));
            
            if (!hasRequired || hasAvoid) continue;
            
            // Create unique key for this combination
            const comboKey = [stockDye.name, purchaseDye.name].sort().join('_');
            
            for (let p1 = 10; p1 <= 90; p1 += 10) {
                const p2 = 100 - p1;
                const mixedRGB = mixDyes(stockDye, purchaseDye, null, p1 / 100, p2 / 100);
                const mixedLab = rgbToLab(mixedRGB[0], mixedRGB[1], mixedRGB[2]);
                let deltaE = calculateDeltaE(targetLab, mixedLab);
                
                deltaE = applyBackgroundAdjustmentToDeltaE(deltaE, bgAdjustment, stockDye, targetFamily);
                deltaE = applyBackgroundAdjustmentToDeltaE(deltaE, bgAdjustment, purchaseDye, targetFamily);
                deltaE = deltaE / 2;
                
                if (deltaE < 50) {
                    const classification = classifyDeltaE(deltaE);
                    
                    mixOptions.push({
                        type: "Mix (Use Stock + Purchase)",
                        name: `${stockDye.name} + ${purchaseDye.name}`,
                        percentages: [p1, p2],
                        dyes: [
                            { ...stockDye, inStock: true, source: "inventory" },
                            { ...purchaseDye, inStock: false, source: "purchase" }
                        ],
                        deltaE,
                        families,
                        classification,
                        purchaseNeeded: [purchaseDye.name],
                        note: `✅ You have: ${stockDye.name} | 🛒 Buy: ${purchaseDye.name} (${purchaseDye.family}) - ΔE: ${deltaE.toFixed(2)}`,
                        priority: 1
                    });
                    
                    // Mark this combination as added
                    addedCombinations.add(comboKey);
                    break; // Only take the best percentage for this combo
                }
            }
        }
    }
    
    for (let i = 0; i < Math.min(15, purchaseDyes.length); i++) {
        for (let j = i + 1; j < Math.min(15, purchaseDyes.length); j++) {
            
            const dye1 = purchaseDyes[i];
            const dye2 = purchaseDyes[j];
            
            // ❌ IMPORTANT: එකම dye එක දෙපාරක් එන එක වලක්වන්න
            if (dye1.name === dye2.name) {
                continue; // Same dye - skip
            }
            
            const families = [dye1.family, dye2.family];
            
            let hasRequired = true;
            if (requirements.required.length > 0) {
                hasRequired = families.some(f => requirements.required.includes(f));
            }
            
            const hasAvoid = families.some(f => requirements.avoid.includes(f));
            
            if (!hasRequired || hasAvoid) continue;
            
            // Create unique key for this combination
            const comboKey = [dye1.name, dye2.name].sort().join('_');
            
            for (let p1 = 10; p1 <= 90; p1 += 10) {
                const p2 = 100 - p1;
                const mixedRGB = mixDyes(dye1, dye2, null, p1 / 100, p2 / 100);
                const mixedLab = rgbToLab(mixedRGB[0], mixedRGB[1], mixedRGB[2]);
                let deltaE = calculateDeltaE(targetLab, mixedLab);
                
                deltaE = applyBackgroundAdjustmentToDeltaE(deltaE, bgAdjustment, dye1, targetFamily);
                deltaE = applyBackgroundAdjustmentToDeltaE(deltaE, bgAdjustment, dye2, targetFamily);
                deltaE = deltaE / 2;
                
                if (deltaE < 50) {
                    mixOptions.push({
                        type: "Mix (Both Purchase)",
                        name: `${dye1.name} + ${dye2.name}`,
                        percentages: [p1, p2],
                        dyes: [
                            { ...dye1, inStock: false, source: "purchase" },
                            { ...dye2, inStock: false, source: "purchase" }
                        ],
                        deltaE,
                        families,
                        classification: classifyDeltaE(deltaE),
                        purchaseNeeded: [dye1.name, dye2.name],
                        note: `🛒 Buy both: ${dye1.name} (${dye1.family}) + ${dye2.name} (${dye2.family}) - ΔE: ${deltaE.toFixed(2)}`,
                        priority: 2
                    });
                    
                    // Mark this combination as added
                    addedCombinations.add(comboKey);
                    break; // Only take the best percentage for this combo
                }
            }
        }
    }
    
    mixOptions.sort((a, b) => {
        if (a.priority !== b.priority) return a.priority - b.priority;
        return a.deltaE - b.deltaE;
    });
    
    return mixOptions;
}
// ==============================================
// ==============================================
// ==============================================
// ==============================================
// 27. GENERATE PURCHASE OPTIONS WITH BACKGROUND - FINAL FIXED VERSION
// ==============================================
function generatePurchaseOptionsWithBackground(targetLab, stockDyes, purchaseDyes, targetFamily, bgAdjustment) {
    const options = [];
    
    // ===== STOCK එකේ නැති dyes පමණක් purchase candidates ලෙස ගන්න =====
    const truePurchaseDyes = purchaseDyes.filter(d => !isDyeInStock(d));
    
    // ===== සරල පැහැදිලි කිරීමේ MSG එක =====
    let simpleMsg = "";
    if (bgAdjustment.difficulty === "VERY_HARD") {
        if (bgAdjustment.bgFamily === "RED" && targetFamily === "GREEN") {
            simpleMsg = "🔴 RED පසුබිම මත GREEN පාට ගන්න බැහැ. රතු සහ කොළ මිශ්‍ර වෙලා දුඹුරු වෙනවා.";
        } else if (bgAdjustment.bgFamily === "BLUE" && targetFamily === "ORANGE") {
            simpleMsg = "🔵 BLUE පසුබිම මත ORANGE පාට ගන්න බැහැ. නිල් සහ තැඹිලි මිශ්‍ර වෙලා දුඹුරු වෙනවා.";
        } else if (bgAdjustment.bgFamily === "GREEN" && targetFamily === "RED") {
            simpleMsg = "🟢 GREEN පසුබිම මත RED පාට ගන්න බැහැ. කොළ සහ රතු මිශ්‍ර වෙලා දුඹුරු වෙනවා.";
        } else if (bgAdjustment.bgFamily === "YELLOW" && targetFamily === "VIOLET") {
            simpleMsg = "🟡 YELLOW පසුබිම මත VIOLET පාට ගන්න බැහැ. කහ සහ දම් මිශ්‍ර වෙලා අළු වෙනවා.";
        } else if (bgAdjustment.bgFamily === "BLACK") {
            simpleMsg = "⚫ BLACK පසුබිම මත ලා පාට ගන්න අමාරුයි. කළු උඩ ලා පාට පෙනෙන්නේ නැහැ.";
        } else if (bgAdjustment.bgFamily === "WHITE") {
            simpleMsg = `🟡 ${bgAdjustment.bgFamily} පසුබිම මත ${targetFamily} පාට ගන්න පුළුවන්. පහත විකල්ප බලන්න.`;
        } else {
            simpleMsg = `⚠️ ${bgAdjustment.bgFamily} පසුබිම මත ${targetFamily} පාට ගන්න අමාරුයි. ${Math.round((bgAdjustment.factor-1)*100)}% වැඩිපුර ඩයි ඕන.`;
        }
    } else if (bgAdjustment.difficulty === "HARD") {
        simpleMsg = `⚠️ ${bgAdjustment.bgFamily} පසුබිම මත ${targetFamily} පාට ගන්න ටිකක් අමාරුයි. ${Math.round((bgAdjustment.factor-1)*100)}% වැඩිපුර ඩයි ඕන.`;
    } else if (bgAdjustment.difficulty === "MEDIUM") {
        simpleMsg = `🟡 ${bgAdjustment.bgFamily} පසුබිම මත ${targetFamily} පාට ගන්න පුළුවන්. පහත විකල්ප බලන්න.`;
    } else if (bgAdjustment.difficulty === "EASY") {
        simpleMsg = `✅ ${bgAdjustment.bgFamily} පසුබිම මත ${targetFamily} පාට ගන්න ලේසියි. එකම පාට නිසා අඩු ඩයි ප්‍රමාණවත්.`;
    } else {
        simpleMsg = `${bgAdjustment.bgFamily} පසුබිම මත ${targetFamily} පාට ගන්න පුළුවන්.`;
    }
    
    // ===== TRACK ADDED COMBINATIONS TO AVOID DUPLICATES =====
    const addedCombinations = new Set();
    
    // ===== STOCK + PURCHASE MIXES (truePurchaseDyes පමණක්) =====
    for (let i = 0; i < Math.min(20, stockDyes.length); i++) {
        for (let j = 0; j < Math.min(20, truePurchaseDyes.length); j++) {
            
            const stockDye = stockDyes[i];
            const purchaseDye = truePurchaseDyes[j];
            
            // ❌ එකම dye එක දෙපාරක් එන එක වලක්වන්න
            if (stockDye.name === purchaseDye.name) continue;
            
            const comboKey = [stockDye.name, purchaseDye.name].sort().join('_');
            if (addedCombinations.has(comboKey)) continue;
            
            // Background-specific skip rules
            if (bgAdjustment.bgFamily === "RED" && stockDye.family === "GREEN" && purchaseDye.family === "GREEN") continue;
            
            for (let p1 = 10; p1 <= 90; p1 += 10) {
                const p2 = 100 - p1;
                const mixedRGB = mixDyes(stockDye, purchaseDye, null, p1 / 100, p2 / 100);
                const mixedLab = rgbToLab(mixedRGB[0], mixedRGB[1], mixedRGB[2]);
                let deltaE = calculateDeltaE(targetLab, mixedLab);
                
                deltaE = applyBackgroundAdjustmentToDeltaE(deltaE, bgAdjustment, stockDye, targetFamily);
                deltaE = applyBackgroundAdjustmentToDeltaE(deltaE, bgAdjustment, purchaseDye, targetFamily);
                deltaE = deltaE / 2;
                
                // Background bonuses
                if (bgAdjustment.bgFamily === "RED" && (stockDye.family === "YELLOW" || purchaseDye.family === "YELLOW")) deltaE *= 0.9;
                if (bgAdjustment.bgFamily === "BLUE" && (stockDye.family === "YELLOW" || purchaseDye.family === "YELLOW")) deltaE *= 0.95;
                
                if (deltaE < 50) {
                    const classification = classifyDeltaE(deltaE);
                    
                    let simpleExplanation = "";
                    if (deltaE > 30) simpleExplanation = "❌ මේකෙන් ඕන පාට ගන්න බැහැ";
                    else if (deltaE > 20) simpleExplanation = "⚠️ මේකෙන් ලැබෙන පාට හරි නැහැ";
                    else if (deltaE > 10) simpleExplanation = "🟡 මේකෙන් ලැබෙන පාට සමාන නෙවෙයි";
                    else if (deltaE > 5) simpleExplanation = "👍 මේකෙන් ලැබෙන පාට ළඟයි";
                    else simpleExplanation = "✅ මේකෙන් ඕන පාටම ලැබෙනවා";
                    
                    options.push({
                        type: "Mix (Use Stock + Purchase)",
                        name: `${stockDye.name} + ${purchaseDye.name}`,
                        percentages: [p1, p2],
                        dyes: [
                            { ...stockDye, inStock: true, source: "inventory" },
                            { ...purchaseDye, inStock: false, source: "purchase" }
                        ],
                        deltaE,
                        families: [stockDye.family, purchaseDye.family],
                        classification,
                        purchaseNeeded: [purchaseDye.name], // ✅ true purchase dyes පමණක්
                        note: `✅ ඔයාට තියෙනවා: ${stockDye.name} | 🛒 ගන්න ඕන: ${purchaseDye.name}`,
                        simpleExplanation,
                        priority: 1,
                        bgAdjusted: true
                    });
                    
                    addedCombinations.add(comboKey);
                    break;
                }
            }
        }
    }
    
    // ===== PURCHASE + PURCHASE MIXES (truePurchaseDyes පමණක්) =====
    for (let i = 0; i < Math.min(15, truePurchaseDyes.length); i++) {
        for (let j = i + 1; j < Math.min(15, truePurchaseDyes.length); j++) {
            
            const dye1 = truePurchaseDyes[i];
            const dye2 = truePurchaseDyes[j];
            
            if (dye1.name === dye2.name) continue;
            
            const comboKey = [dye1.name, dye2.name].sort().join('_');
            if (addedCombinations.has(comboKey)) continue;
            
            for (let p1 = 10; p1 <= 90; p1 += 10) {
                const p2 = 100 - p1;
                const mixedRGB = mixDyes(dye1, dye2, null, p1 / 100, p2 / 100);
                const mixedLab = rgbToLab(mixedRGB[0], mixedRGB[1], mixedRGB[2]);
                let deltaE = calculateDeltaE(targetLab, mixedLab);
                
                deltaE = applyBackgroundAdjustmentToDeltaE(deltaE, bgAdjustment, dye1, targetFamily);
                deltaE = applyBackgroundAdjustmentToDeltaE(deltaE, bgAdjustment, dye2, targetFamily);
                deltaE = deltaE / 2;
                
                if (deltaE < 50) {
                    let simpleExplanation = "";
                    if (deltaE > 30) simpleExplanation = "❌ මේකෙන් ඕන පාට ගන්න බැහැ";
                    else if (deltaE > 20) simpleExplanation = "⚠️ මේකෙන් ලැබෙන පාට හරි නැහැ";
                    else if (deltaE > 10) simpleExplanation = "🟡 මේකෙන් ලැබෙන පාට සමාන නෙවෙයි";
                    else if (deltaE > 5) simpleExplanation = "👍 මේකෙන් ලැබෙන පාට ළඟයි";
                    else simpleExplanation = "✅ මේකෙන් ඕන පාටම ලැබෙනවා";
                    
                    options.push({
                        type: "Mix (Both Purchase)",
                        name: `${dye1.name} + ${dye2.name}`,
                        percentages: [p1, p2],
                        dyes: [
                            { ...dye1, inStock: false, source: "purchase" },
                            { ...dye2, inStock: false, source: "purchase" }
                        ],
                        deltaE,
                        families: [dye1.family, dye2.family],
                        classification: classifyDeltaE(deltaE),
                        purchaseNeeded: [dye1.name, dye2.name],
                        note: `🛒 දෙකම ගන්න: ${dye1.name} + ${dye2.name}`,
                        simpleExplanation,
                        priority: 2,
                        bgAdjusted: true
                    });
                    
                    addedCombinations.add(comboKey);
                    break;
                }
            }
        }
    }
    
    // ===== SINGLE PURCHASE DYES (truePurchaseDyes පමණක්) =====
    truePurchaseDyes
        .filter(d => d.deltaE < DELTA_E_THRESHOLD.PURCHASE)
        .forEach(d => {
            let priority = 3;
            if (bgAdjustment.difficulty === "HARD" || bgAdjustment.difficulty === "VERY_HARD") {
                priority = (d.family === targetFamily) ? 1 : 2;
            }
            
            let simpleExplanation = "";
            if (d.deltaE > 30) simpleExplanation = "❌ මේකෙන් ඕන පාට ගන්න බැහැ";
            else if (d.deltaE > 20) simpleExplanation = "⚠️ මේකෙන් ලැබෙන පාට හරි නැහැ";
            else if (d.deltaE > 10) simpleExplanation = "🟡 මේකෙන් ලැබෙන පාට සමාන නෙවෙයි";
            else if (d.deltaE > 5) simpleExplanation = "👍 මේකෙන් ලැබෙන පාට ළඟයි";
            else simpleExplanation = "✅ මේකෙන් ඕන පාටම ලැබෙනවා";
            
            options.push({
                type: "Single Dye (Purchase)",
                name: d.name,
                deltaE: d.deltaE,
                families: [d.family],
                classification: classifyDeltaE(d.deltaE),
                inStock: false,
                note: `🛒 ගන්න: ${d.name}`,
                simpleExplanation,
                priority,
                bgAdjusted: true
            });
        });
    
    // ===== SORT AND FORMAT =====
    options.sort((a, b) => a.deltaE - b.deltaE);
    
    const medals = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣"];
    
    const result = {
        options: options.slice(0, 8).map((opt, index) => ({
            ...opt,
            medal: medals[index] || "",
            rank: index + 1
        })),
        simpleMsg: simpleMsg
    };
    
    return result;
}
// ==============================================
// 28. GET MISSING FAMILIES MESSAGE WITH BACKGROUND
// ==============================================

function getMissingFamiliesMessageWithBackground(targetFamily, bgFamily, stockFamilies, purchaseFamilies) {
    const requirements = COLOR_REQUIREMENTS[targetFamily];
    if (!requirements) return "";
    
    const missing = [];
    const available = [...stockFamilies, ...purchaseFamilies];
    
    requirements.required.forEach(family => {
        if (!available.includes(family)) {
            missing.push(family);
        }
    });
    
    if (missing.length === 0) {
        const bgCheck = checkBackgroundCompatibility(bgFamily, targetFamily);
        if (bgCheck.difficulty === "HARD" || bgCheck.difficulty === "VERY_HARD") {
            return `💡 You have all required dyes, but ${bgCheck.message}`;
        }
        return "";
    }
    
    const inPurchase = missing.filter(f => purchaseFamilies.includes(f));
    const totallyMissing = missing.filter(f => !purchaseFamilies.includes(f));
    
    let message = `💡 For ${targetFamily} on ${bgFamily} background, you need: ${requirements.required.join(', ')}.\n`;
    
    if (inPurchase.length > 0) {
        message += `   🛒 PURCHASE THESE: ${inPurchase.join(', ')} dyes are available to buy!\n`;
    }
    
    if (totallyMissing.length > 0) {
        message += `   ❌ NOT AVAILABLE: ${totallyMissing.join(', ')} dyes are not in your inventory or purchase list.`;
    }
    
    return message;
}

// ==============================================
// ==============================================
// ==============================================
// ==============================================
// depthFactors object එක DOS percentages වලට වෙනස් කරන්න
const depthDOS = {
    "veryLight": 1.5,
    "light": 2.5,
    "mediumLight": 3.5,
    "medium": 5.0,
    "mediumDark": 6.0,
    "dark": 7.0,
    "extraDark": 8.0
};
// ==============================================
// ==============================================
// ==============================================
// 29. CALCULATE BASE DOS - FINAL FIXED VERSION (1.5% - 8% RANGE)
// ==============================================
function calculateBaseDOS(colorFamily, saturation, value, depthPreference = "medium", fabricType = "cotton") {
    
    // ✅ වර්ණ පවුල අනුව මූලික DOS අගයන් (ඔයා දුන්නු අගයන්)
    const familyBaseDOS = {
        "WHITE": 0.8, // සුදු
        "YELLOW": 3.2, // කහ
        "PINK": 2.6, // පින්ක්
        "ORANGE": 3.2, // තැඹිලි
        "RED": 3.6, // රතු
        "GREEN": 3.3, // කොළ
        "CYAN": 3.0, // සයන්
        "BLUE": 3.3, // නිල්
        "VIOLET": 3.5, // දම්
        "MAGENTA": 3.3, // මැජෙන්ටා
        "BROWN": 3.6, // දුඹුරු
        "GREY": 2.2, // අළු
        "BLACK": 6.0 // කළු
    };
    
    // ✅ ගැඹුරුතා මනාපය අනුව ගුණ කිරීමේ සාධක (1.5% - 8% පරාසය සඳහා සකස් කළ)
    const depthFactors = {
        "veryLight": 0.8, // ඉතා ලා පාට
        "light": 1.2, // ලා පාට
        "mediumLight": 1.6, // තරමක් ලා
        "medium": 2.0, // මධ්‍යම
        "mediumDark": 2.5, // තරමක් තද
        "dark": 3.0, // තද
        "extraDark": 3.5 // ඉතා තද
    };
    
    // 1. වර්ණ පවුල අනුව මූලික DOS එක ගන්න
    let baseDOS = familyBaseDOS[colorFamily] || 2.8;
    
    // 2. ගැඹුරුතා මනාපය අනුව ගුණ කරන්න
    const depthFactorValue = depthFactors[depthPreference] || 2.0;
    baseDOS = baseDOS * depthFactorValue;
    
    // 3. Saturation adjustment
    if (saturation < 0.2) baseDOS *= 0.8;
    else if (saturation > 0.8) baseDOS *= 1.1;
    
    // 4. Value adjustment
    if (value < 0.3) baseDOS *= 1.3;
    else if (value > 0.8) baseDOS *= 0.8;
    
    // 5. Fabric factors
    const fabricFactors = {
        "Rayon": 1.0,
        "Viscose": 1.0,
        "Linen": 1.05,
        "Silk": 0.95,
        "Cotton": 1.0,
        "Canvas": 1.05,
        "Voile": 0.98,
        "Poplin": 1.0,
        "Cambric": 1.0,
        "Mulmul": 0.98,
        "Twill": 1.0,
        "Satin": 0.98,
        "Gauze": 0.97,
        "Jersey": 1.02,
        "Organdie": 0.98,
        "Corduroy": 1.05,
        "default": 1.0
    };
    
    let fabricFactor = 1.0;
    
    if (fabricType && typeof fabricType === 'string') {
        const fabricName = fabricType.split(' ')[0];
        
        if (fabricName.includes('Rayon') || fabricName.includes('Viscose')) fabricFactor = 1.0;
        else if (fabricName.includes('Linen')) fabricFactor = 1.05;
        else if (fabricName.includes('Silk')) fabricFactor = 0.95;
        else if (fabricName.includes('Cotton')) fabricFactor = 1.0;
        else if (fabricName.includes('Canvas')) fabricFactor = 1.05;
        else if (fabricName.includes('Voile')) fabricFactor = 0.98;
        else if (fabricName.includes('Poplin')) fabricFactor = 1.0;
        else if (fabricName.includes('Cambric')) fabricFactor = 1.0;
        else if (fabricName.includes('Mulmul')) fabricFactor = 0.98;
        else if (fabricName.includes('Twill')) fabricFactor = 1.0;
        else if (fabricName.includes('Satin')) fabricFactor = 0.98;
        else if (fabricName.includes('Gauze')) fabricFactor = 0.97;
        else if (fabricName.includes('Jersey')) fabricFactor = 1.02;
        else if (fabricName.includes('Organdie')) fabricFactor = 0.98;
        else if (fabricName.includes('Corduroy')) fabricFactor = 1.05;
        else fabricFactor = fabricFactors[fabricName] || 1.0;
    }
    
    baseDOS *= fabricFactor;
    
    // Final clamp (1.5 - 8.0) - අවමය 1.5% දක්වා වැඩි කළා
    baseDOS = Math.min(8.0, Math.max(1.5, baseDOS));
    
    return baseDOS;
}
// ==============================================
// BACKGROUND-BASED DYE SELECTION FOR ALL FAMILIES - COMPLETE VERSION
// WITH MANDATORY RULES, PROHIBITED RULES & QUALITY CHECKING
// ==============================================
// ==============================================
// SMART MANDATORY PERCENTAGE CALCULATION
// ==============================================

function calculateSmartMandatory(targetColor, mandatoryFamily, basePercent) {
    
    const targetHSV = targetColor.hsv;
    let adjustedPercent = basePercent;
    
    // 1. Saturation-based adjustment
    if (targetHSV.s > 0.8) {
        // High saturation - lower mandatory % (preserve brightness)
        adjustedPercent = Math.max(1, basePercent * 0.7);
    } else if (targetHSV.s < 0.3) {
        // Low saturation - higher mandatory % (add depth)
        adjustedPercent = Math.min(5, basePercent * 1.3);
    }
    
    // 2. Value-based adjustment
    if (targetHSV.v > 0.8) {
        // Light colors - lower mandatory %
        adjustedPercent = Math.max(1, adjustedPercent * 0.8);
    } else if (targetHSV.v < 0.3) {
        // Dark colors - slightly higher mandatory %
        adjustedPercent = Math.min(5, adjustedPercent * 1.2);
    }
    
    // 3. Color family sensitivity (muddy risk)
    const delicateColors = ["PINK", "YELLOW", "CYAN", "MAGENTA"];
    if (delicateColors.includes(targetColor.family)) {
        adjustedPercent = Math.max(1, adjustedPercent * 0.6);
    }
    
    // 4. Complementary color check
    const complementaryPairs = {
        "RED": "GREEN", "GREEN": "RED",
        "BLUE": "ORANGE", "ORANGE": "BLUE",
        "YELLOW": "VIOLET", "VIOLET": "YELLOW"
    };
    
    if (complementaryPairs[targetColor.family] === mandatoryFamily) {
        // Mandatory family is complementary - reduce % to avoid muddiness
        adjustedPercent = Math.max(1, adjustedPercent * 0.5);
    }
    
    return Math.round(adjustedPercent * 2) / 2; // 0.5% increments
}
function getBackgroundBasedPreferences(targetFamily, bgFamily, targetColor) {
    let preferredFamilies = [];
    let avoidedFamilies = [];
    let mandatoryRules = [];
    let prohibitedRules = [];
    
    // ===== RED TARGET =====
    if (targetFamily === "RED") {
        if (bgFamily === "YELLOW") {
            preferredFamilies = ["RED", "ORANGE", "MAGENTA"];
            avoidedFamilies = ["BLUE", "GREEN", "CYAN", "VIOLET"];
            mandatoryRules = [];
            prohibitedRules = [
                { family: "BLUE", message: "RED on YELLOW background එකේදී BLUE dyes භාවිතා කළ නොහැක" },
                { family: "GREEN", message: "RED on YELLOW background එකේදී GREEN dyes භාවිතා කළ නොහැක" }
            ];
        } 
        else if (bgFamily === "BLUE") {
            preferredFamilies = ["RED", "MAGENTA", "VIOLET"];
            avoidedFamilies = ["BLUE", "GREEN", "CYAN", "YELLOW"];
            
            const mandatoryPercent = calculateSmartMandatory(targetColor, "BROWN", 3);
            
            mandatoryRules = [
                { 
                    family: "BROWN", 
                    minPercent: mandatoryPercent, 
                    message: `Brown dye අවම වශයෙන් ${mandatoryPercent}%ක් අනිවාර්යයෙන් එකතු කළ යුතුයි` 
                }
            ];
            
            prohibitedRules = [
                { family: "GREEN", message: "RED on BLUE background එකේදී GREEN dyes භාවිතා කළ නොහැක" },
                { family: "CYAN", message: "RED on BLUE background එකේදී CYAN dyes භාවිතා කළ නොහැක" },
                { family: "YELLOW", message: "RED on BLUE background එකේදී YELLOW dyes භාවිතා කළ නොහැක" }
            ];
        }
        else if (bgFamily === "GREEN") {
            preferredFamilies = ["RED", "ORANGE", "BROWN"];
            avoidedFamilies = ["GREEN", "BLUE", "CYAN", "VIOLET"];
            
            const mandatoryPercent = calculateSmartMandatory(targetColor, "BROWN", 2);
            
            mandatoryRules = [
                { 
                    family: "BROWN", 
                    minPercent: mandatoryPercent, 
                    message: `Brown dye අවම වශයෙන් ${mandatoryPercent}%ක් අනිවාර්යයෙන් එකතු කළ යුතුයි` 
                }
            ];
            
            prohibitedRules = [
                { family: "BLUE", message: "RED on GREEN background එකේදී BLUE dyes භාවිතා කළ නොහැක" },
                { family: "CYAN", message: "RED on GREEN background එකේදී CYAN dyes භාවිතා කළ නොහැක" }
            ];
        }
        else if (bgFamily === "ORANGE") {
            preferredFamilies = ["RED", "ORANGE", "MAGENTA"];
            avoidedFamilies = ["BLUE", "GREEN", "CYAN"];
            mandatoryRules = [];
            prohibitedRules = [
                { family: "BLUE", message: "RED on ORANGE background එකේදී BLUE dyes භාවිතා කළ නොහැක" }
            ];
        }
        else if (bgFamily === "VIOLET") {
            preferredFamilies = ["RED", "VIOLET", "MAGENTA"];
            avoidedFamilies = ["GREEN", "YELLOW", "CYAN", "BLUE"];
            
            const mandatoryPercent = calculateSmartMandatory(targetColor, "BROWN", 2);
            
            mandatoryRules = [
                { 
                    family: "BROWN", 
                    minPercent: mandatoryPercent, 
                    message: `Brown dye අවම වශයෙන් ${mandatoryPercent}%ක් අනිවාර්යයෙන් එකතු කළ යුතුයි` 
                }
            ];
            prohibitedRules = [];
        }
        else if (bgFamily === "PINK") {
            preferredFamilies = ["RED", "PINK", "MAGENTA"];
            avoidedFamilies = ["GREEN", "BLUE", "CYAN"];
            mandatoryRules = [];
            prohibitedRules = [];
        }
        else if (bgFamily === "BROWN") {
            preferredFamilies = ["RED", "ORANGE", "BROWN"];
            avoidedFamilies = ["BLUE", "GREEN", "CYAN"];
            
            const mandatoryPercent = calculateSmartMandatory(targetColor, "BROWN", 5);
            
            mandatoryRules = [
                { 
                    family: "BROWN", 
                    minPercent: mandatoryPercent, 
                    message: `Brown dye අවම වශයෙන් ${mandatoryPercent}%ක් අනිවාර්යයෙන් එකතු කළ යුතුයි` 
                }
            ];
            prohibitedRules = [];
        }
        else if (bgFamily === "GREY") {
            preferredFamilies = ["RED", "MAGENTA", "VIOLET"];
            avoidedFamilies = ["GREEN", "YELLOW", "CYAN"];
            
            const mandatoryPercent = calculateSmartMandatory(targetColor, "GREY", 3);
            
            mandatoryRules = [
                { 
                    family: "GREY", 
                    minPercent: mandatoryPercent, 
                    message: `Grey dye අවම වශයෙන් ${mandatoryPercent}%ක් අනිවාර්යයෙන් එකතු කළ යුතුයි` 
                }
            ];
            prohibitedRules = [];
        }
        else if (bgFamily === "WHITE") {
            preferredFamilies = ["RED", "MAGENTA", "ORANGE"];
            avoidedFamilies = [];
            mandatoryRules = [];
            prohibitedRules = [];
        }
        else if (bgFamily === "BLACK") {
            preferredFamilies = ["RED", "BROWN", "VIOLET"];
            avoidedFamilies = ["YELLOW", "PINK", "ORANGE", "GREEN"];
            
            const mandatoryPercent = calculateSmartMandatory(targetColor, "BROWN", 4);
            
            mandatoryRules = [
                { 
                    family: "BROWN", 
                    minPercent: mandatoryPercent, 
                    message: `Brown dye අවම වශයෙන් ${mandatoryPercent}%ක් අනිවාර්යයෙන් එකතු කළ යුතුයි` 
                }
            ];
            
            prohibitedRules = [
                { family: "YELLOW", message: "BLACK background එකේදී YELLOW dyes භාවිතා කළ නොහැක" },
                { family: "PINK", message: "BLACK background එකේදී PINK dyes භාවිතා කළ නොහැක" },
                { family: "ORANGE", message: "BLACK background එකේදී ORANGE dyes භාවිතා කළ නොහැක" }
            ];
        }
        else if (bgFamily === "CYAN") {
            preferredFamilies = ["RED", "MAGENTA", "VIOLET"];
            avoidedFamilies = ["CYAN", "GREEN", "BLUE", "YELLOW"];
            
            const mandatoryPercent = calculateSmartMandatory(targetColor, "BROWN", 2);
            
            mandatoryRules = [
                { 
                    family: "BROWN", 
                    minPercent: mandatoryPercent, 
                    message: `Brown dye අවම වශයෙන් ${mandatoryPercent}%ක් අනිවාර්යයෙන් එකතු කළ යුතුයි` 
                }
            ];
            prohibitedRules = [];
        }
    }
    
    // ===== ORANGE TARGET =====
    else if (targetFamily === "ORANGE") {
        if (bgFamily === "RED") {
            preferredFamilies = ["ORANGE", "RED", "YELLOW"];
            avoidedFamilies = ["BLUE", "GREEN", "VIOLET", "CYAN"];
            
            const mandatoryPercent = calculateSmartMandatory(targetColor, "BROWN", 2);
            
            mandatoryRules = [
                { 
                    family: "BROWN", 
                    minPercent: mandatoryPercent, 
                    message: `Brown dye අවම වශයෙන් ${mandatoryPercent}%ක් අනිවාර්යයෙන් එකතු කළ යුතුයි` 
                }
            ];
            prohibitedRules = [
                { family: "BLUE", message: "ORANGE on RED background එකේදී BLUE dyes භාවිතා කළ නොහැක" }
            ];
        } 
        else if (bgFamily === "YELLOW") {
            preferredFamilies = ["ORANGE", "YELLOW", "RED"];
            avoidedFamilies = ["BLUE", "VIOLET", "GREEN", "CYAN"];
            
            const mandatoryPercent = calculateSmartMandatory(targetColor, "BROWN", 1);
            
            mandatoryRules = [
                { 
                    family: "BROWN", 
                    minPercent: mandatoryPercent, 
                    message: `Brown dye අවම වශයෙන් ${mandatoryPercent}%ක් අනිවාර්යයෙන් එකතු කළ යුතුයි` 
                }
            ];
            prohibitedRules = [];
        }
        else if (bgFamily === "BLUE") {
            preferredFamilies = ["ORANGE", "YELLOW", "RED", "BROWN"];
            avoidedFamilies = ["BLUE", "VIOLET", "GREEN", "CYAN"];
            
            const mandatoryPercent = calculateSmartMandatory(targetColor, "BROWN", 3);
            
            mandatoryRules = [
                { 
                    family: "BROWN", 
                    minPercent: mandatoryPercent, 
                    message: `Brown dye අවම වශයෙන් ${mandatoryPercent}%ක් අනිවාර්යයෙන් එකතු කළ යුතුයි` 
                }
            ];
            
            prohibitedRules = [
                { family: "BLUE", message: "ORANGE on BLUE background එකේදී BLUE dyes භාවිතා කළ නොහැක" },
                { family: "CYAN", message: "ORANGE on BLUE background එකේදී CYAN dyes භාවිතා කළ නොහැක" },
                { family: "GREEN", message: "ORANGE on BLUE background එකේදී GREEN dyes භාවිතා කළ නොහැක" }
            ];
        }
        // ... continue for other backgrounds (add similar blocks for all target families)
        else {
            // Default case - just return preferred/avoided
            mandatoryRules = [];
            prohibitedRules = [];
        }
    }
    
    // ===== GREEN TARGET =====
    else if (targetFamily === "GREEN") {
        if (bgFamily === "YELLOW") {
            preferredFamilies = ["GREEN", "YELLOW", "CYAN"];
            avoidedFamilies = ["RED", "MAGENTA", "VIOLET", "ORANGE"];
            
            const mandatoryPercent = calculateSmartMandatory(targetColor, "BROWN", 1);
            
            mandatoryRules = [
                { 
                    family: "BROWN", 
                    minPercent: mandatoryPercent, 
                    message: `Brown dye අවම වශයෙන් ${mandatoryPercent}%ක් අනිවාර්යයෙන් එකතු කළ යුතුයි` 
                }
            ];
            prohibitedRules = [];
        }
        else if (bgFamily === "BLUE") {
            preferredFamilies = ["GREEN", "BLUE", "CYAN"];
            avoidedFamilies = ["RED", "ORANGE", "YELLOW", "MAGENTA"];
            
            const mandatoryPercent = calculateSmartMandatory(targetColor, "BROWN", 1);
            
            mandatoryRules = [
                { 
                    family: "BROWN", 
                    minPercent: mandatoryPercent, 
                    message: `Brown dye අවම වශයෙන් ${mandatoryPercent}%ක් අනිවාර්යයෙන් එකතු කළ යුතුයි` 
                }
            ];
            prohibitedRules = [];
        }
        else if (bgFamily === "RED") {
            preferredFamilies = ["GREEN", "YELLOW", "CYAN", "BROWN"];
            avoidedFamilies = ["RED", "MAGENTA", "PINK", "ORANGE"];
            
            const mandatoryPercent = calculateSmartMandatory(targetColor, "BROWN", 3);
            
            mandatoryRules = [
                { 
                    family: "BROWN", 
                    minPercent: mandatoryPercent, 
                    message: `Brown dye අවම වශයෙන් ${mandatoryPercent}%ක් අනිවාර්යයෙන් එකතු කළ යුතුයි` 
                }
            ];
            
            prohibitedRules = [
                { family: "RED", message: "GREEN on RED background එකේදී RED dyes භාවිතා කළ නොහැක" },
                { family: "PINK", message: "GREEN on RED background එකේදී PINK dyes භාවිතා කළ නොහැක" },
                { family: "MAGENTA", message: "GREEN on RED background එකේදී MAGENTA dyes භාවිතා කළ නොහැක" }
            ];
        }
        else {
            mandatoryRules = [];
            prohibitedRules = [];
        }
    }
    
    // ===== YELLOW TARGET =====
    else if (targetFamily === "YELLOW") {
        if (bgFamily === "RED") {
            preferredFamilies = ["YELLOW", "ORANGE", "GREEN"];
            avoidedFamilies = ["RED", "BLUE", "VIOLET", "MAGENTA"];
            
            const mandatoryPercent = calculateSmartMandatory(targetColor, "BROWN", 2);
            
            mandatoryRules = [
                { 
                    family: "BROWN", 
                    minPercent: mandatoryPercent, 
                    message: `Brown dye අවම වශයෙන් ${mandatoryPercent}%ක් අනිවාර්යයෙන් එකතු කළ යුතුයි` 
                }
            ];
            prohibitedRules = [];
        }
        else if (bgFamily === "BLUE") {
            preferredFamilies = ["YELLOW", "ORANGE", "GREEN"];
            avoidedFamilies = ["BLUE", "VIOLET", "MAGENTA", "RED"];
            
            const mandatoryPercent = calculateSmartMandatory(targetColor, "BROWN", 2);
            
            mandatoryRules = [
                { 
                    family: "BROWN", 
                    minPercent: mandatoryPercent, 
                    message: `Brown dye අවම වශයෙන් ${mandatoryPercent}%ක් අනිවාර්යයෙන් එකතු කළ යුතුයි` 
                }
            ];
            prohibitedRules = [];
        }
        else if (bgFamily === "VIOLET") {
            preferredFamilies = ["YELLOW", "ORANGE", "GREEN"];
            avoidedFamilies = ["VIOLET", "BLUE", "MAGENTA", "RED"];
            
            const mandatoryPercent = calculateSmartMandatory(targetColor, "BROWN", 3);
            
            mandatoryRules = [
                { 
                    family: "BROWN", 
                    minPercent: mandatoryPercent, 
                    message: `Brown dye අවම වශයෙන් ${mandatoryPercent}%ක් අනිවාර්යයෙන් එකතු කළ යුතුයි` 
                }
            ];
            
            prohibitedRules = [
                { family: "VIOLET", message: "YELLOW on VIOLET background එකේදී VIOLET dyes භාවිතා කළ නොහැක" }
            ];
        }
        else {
            mandatoryRules = [];
            prohibitedRules = [];
        }
    }
    
    // ===== BLUE TARGET =====
    else if (targetFamily === "BLUE") {
        if (bgFamily === "RED") {
            preferredFamilies = ["BLUE", "VIOLET", "CYAN"];
            avoidedFamilies = ["RED", "ORANGE", "YELLOW", "MAGENTA"];
            
            const mandatoryPercent = calculateSmartMandatory(targetColor, "BROWN", 3);
            
            mandatoryRules = [
                { 
                    family: "BROWN", 
                    minPercent: mandatoryPercent, 
                    message: `Brown dye අවම වශයෙන් ${mandatoryPercent}%ක් අනිවාර්යයෙන් එකතු කළ යුතුයි` 
                }
            ];
            
            prohibitedRules = [
                { family: "RED", message: "BLUE on RED background එකේදී RED dyes භාවිතා කළ නොහැක" },
                { family: "ORANGE", message: "BLUE on RED background එකේදී ORANGE dyes භාවිතා කළ නොහැක" }
            ];
        }
        else if (bgFamily === "ORANGE") {
            preferredFamilies = ["BLUE", "VIOLET", "CYAN"];
            avoidedFamilies = ["ORANGE", "RED", "YELLOW", "GREEN"];
            
            const mandatoryPercent = calculateSmartMandatory(targetColor, "BROWN", 3);
            
            mandatoryRules = [
                { 
                    family: "BROWN", 
                    minPercent: mandatoryPercent, 
                    message: `Brown dye අවම වශයෙන් ${mandatoryPercent}%ක් අනිවාර්යයෙන් එකතු කළ යුතුයි` 
                }
            ];
            
            prohibitedRules = [
                { family: "ORANGE", message: "BLUE on ORANGE background එකේදී ORANGE dyes භාවිතා කළ නොහැක" },
                { family: "YELLOW", message: "BLUE on ORANGE background එකේදී YELLOW dyes භාවිතා කළ නොහැක" }
            ];
        }
        else {
            mandatoryRules = [];
            prohibitedRules = [];
        }
    }
    
    // ===== CYAN TARGET =====
    else if (targetFamily === "CYAN") {
        if (bgFamily === "BLUE") {
            preferredFamilies = ["CYAN", "BLUE", "GREEN"];
            avoidedFamilies = ["RED", "ORANGE", "YELLOW", "MAGENTA"];
            mandatoryRules = [];
            prohibitedRules = [
                { family: "RED", message: "CYAN on BLUE background එකේදී RED dyes භාවිතා කළ නොහැක" },
                { family: "ORANGE", message: "CYAN on BLUE background එකේදී ORANGE dyes භාවිතා කළ නොහැක" }
            ];
        }
        else if (bgFamily === "ORANGE") {
            preferredFamilies = ["CYAN", "BLUE", "GREEN", "VIOLET"];
            avoidedFamilies = ["ORANGE", "RED", "YELLOW", "MAGENTA"];
            
            const mandatoryPercent = calculateSmartMandatory(targetColor, "BROWN", 2);
            
            mandatoryRules = [
                { 
                    family: "BROWN", 
                    minPercent: mandatoryPercent, 
                    message: `Brown dye අවම වශයෙන් ${mandatoryPercent}%ක් අනිවාර්යයෙන් එකතු කළ යුතුයි` 
                }
            ];
            
            prohibitedRules = [
                { family: "ORANGE", message: "CYAN on ORANGE background එකේදී ORANGE dyes භාවිතා කළ නොහැක" },
                { family: "YELLOW", message: "CYAN on ORANGE background එකේදී YELLOW dyes භාවිතා කළ නොහැක" }
            ];
        }
        else {
            mandatoryRules = [];
            prohibitedRules = [];
        }
    }
    
    // ===== VIOLET TARGET =====
    else if (targetFamily === "VIOLET") {
        if (bgFamily === "YELLOW") {
            preferredFamilies = ["VIOLET", "MAGENTA", "BLUE", "PINK"];
            avoidedFamilies = ["YELLOW", "GREEN", "ORANGE", "RED"];
            
            const mandatoryPercent = calculateSmartMandatory(targetColor, "BROWN", 3);
            
            mandatoryRules = [
                { 
                    family: "BROWN", 
                    minPercent: mandatoryPercent, 
                    message: `Brown dye අවම වශයෙන් ${mandatoryPercent}%ක් අනිවාර්යයෙන් එකතු කළ යුතුයි` 
                }
            ];
            
            prohibitedRules = [
                { family: "YELLOW", message: "VIOLET on YELLOW background එකේදී YELLOW dyes භාවිතා කළ නොහැක" },
                { family: "GREEN", message: "VIOLET on YELLOW background එකේදී GREEN dyes භාවිතා කළ නොහැක" }
            ];
        }
        else {
            mandatoryRules = [];
            prohibitedRules = [];
        }
    }
    
    // ===== PINK TARGET =====
    else if (targetFamily === "PINK") {
        if (bgFamily === "RED") {
            preferredFamilies = ["PINK", "RED", "MAGENTA"];
            avoidedFamilies = ["GREEN", "BLUE", "YELLOW", "CYAN"];
            
            const mandatoryPercent = calculateSmartMandatory(targetColor, "BROWN", 1);
            
            mandatoryRules = [
                { 
                    family: "BROWN", 
                    minPercent: mandatoryPercent, 
                    message: `Brown dye අවම වශයෙන් ${mandatoryPercent}%ක් අනිවාර්යයෙන් එකතු කළ යුතුයි` 
                }
            ];
            prohibitedRules = [];
        }
        else {
            mandatoryRules = [];
            prohibitedRules = [];
        }
    }
    
    // ===== BROWN TARGET =====
    else if (targetFamily === "BROWN") {
        if (bgFamily === "RED") {
            preferredFamilies = ["BROWN", "RED", "ORANGE", "YELLOW"];
            avoidedFamilies = ["BLUE", "GREEN", "CYAN", "VIOLET"];
            
            const mandatoryPercent = calculateSmartMandatory(targetColor, "BROWN", 3);
            
            mandatoryRules = [
                { 
                    family: "BROWN", 
                    minPercent: mandatoryPercent, 
                    message: `Brown dye අවම වශයෙන් ${mandatoryPercent}%ක් අනිවාර්යයෙන් එකතු කළ යුතුයි` 
                }
            ];
            prohibitedRules = [];
        }
        else {
            mandatoryRules = [];
            prohibitedRules = [];
        }
    }
    
    // ===== GREY TARGET =====
    else if (targetFamily === "GREY") {
        if (bgFamily === "WHITE") {
            preferredFamilies = ["GREY", "BLACK", "BLUE", "VIOLET"];
            avoidedFamilies = ["YELLOW", "PINK", "ORANGE", "RED"];
            
            const mandatoryPercent = calculateSmartMandatory(targetColor, "GREY", 2);
            
            mandatoryRules = [
                { 
                    family: "GREY", 
                    minPercent: mandatoryPercent, 
                    message: `Grey dye අවම වශයෙන් ${mandatoryPercent}%ක් අනිවාර්යයෙන් එකතු කළ යුතුයි` 
                }
            ];
            prohibitedRules = [];
        }
        else if (bgFamily === "BLACK") {
            preferredFamilies = ["GREY", "BLACK", "WHITE", "BLUE"];
            avoidedFamilies = ["RED", "GREEN", "YELLOW", "ORANGE"];
            
            const mandatoryPercent = calculateSmartMandatory(targetColor, "GREY", 3);
            
            mandatoryRules = [
                { 
                    family: "GREY", 
                    minPercent: mandatoryPercent, 
                    message: `Grey dye අවම වශයෙන් ${mandatoryPercent}%ක් අනිවාර්යයෙන් එකතු කළ යුතුයි` 
                }
            ];
            prohibitedRules = [];
        }
        else {
            mandatoryRules = [];
            prohibitedRules = [];
        }
    }
    
    // ===== BLACK TARGET =====
    else if (targetFamily === "BLACK") {
        if (bgFamily === "WHITE") {
            preferredFamilies = ["BLACK", "BLUE", "BROWN", "VIOLET"];
            avoidedFamilies = ["YELLOW", "PINK", "ORANGE", "GREEN"];
            
            const mandatoryPercent = calculateSmartMandatory(targetColor, "BLACK", 4);
            
            mandatoryRules = [
                { 
                    family: "BLACK", 
                    minPercent: mandatoryPercent, 
                    message: `Black dye අවම වශයෙන් ${mandatoryPercent}%ක් අනිවාර්යයෙන් එකතු කළ යුතුයි` 
                }
            ];
            prohibitedRules = [];
        }
        else if (bgFamily === "BLACK") {
            preferredFamilies = ["BLACK", "GREY", "BLUE", "BROWN"];
            avoidedFamilies = ["YELLOW", "PINK", "GREEN", "ORANGE"];
            
            const mandatoryPercent = calculateSmartMandatory(targetColor, "BLACK", 3);
            
            mandatoryRules = [
                { 
                    family: "BLACK", 
                    minPercent: mandatoryPercent, 
                    message: `Black dye අවම වශයෙන් ${mandatoryPercent}%ක් අනිවාර්යයෙන් එකතු කළ යුතුයි` 
                }
            ];
            prohibitedRules = [];
        }
        else {
            mandatoryRules = [];
            prohibitedRules = [];
        }
    }
    
    // ===== WHITE TARGET =====
    else if (targetFamily === "WHITE") {
        if (bgFamily === "WHITE") {
            preferredFamilies = ["WHITE", "GREY", "YELLOW", "PINK"];
            avoidedFamilies = ["BLACK", "BLUE", "RED", "GREEN"];
            
            const mandatoryPercent = calculateSmartMandatory(targetColor, "WHITE", 2);
            
            mandatoryRules = [
                { 
                    family: "WHITE", 
                    minPercent: mandatoryPercent, 
                    message: `White dye අවම වශයෙන් ${mandatoryPercent}%ක් අනිවාර්යයෙන් එකතු කළ යුතුයි` 
                }
            ];
            prohibitedRules = [];
        }
        else if (bgFamily === "BLACK") {
            preferredFamilies = ["WHITE", "YELLOW", "PINK", "GREY"];
            avoidedFamilies = ["BLACK", "BLUE", "RED", "GREEN"];
            
            const mandatoryPercent = calculateSmartMandatory(targetColor, "WHITE", 3);
            
            mandatoryRules = [
                { 
                    family: "WHITE", 
                    minPercent: mandatoryPercent, 
                    message: `White dye අවම වශයෙන් ${mandatoryPercent}%ක් අනිවාර්යයෙන් එකතු කළ යුතුයි` 
                }
            ];
            prohibitedRules = [];
        }
        else {
            mandatoryRules = [];
            prohibitedRules = [];
        }
    }
    
    return { 
        preferredFamilies, 
        avoidedFamilies,
        mandatoryRules,
        prohibitedRules
    };
}
// ==============================================
// ==============================================
// ==============================================
// ==============================================
// ==============================================
// ==============================================
// ==============================================
// ==============================================
// 30. CALCULATE EFFECTIVE WEIGHT WITH WAX
// ==============================================

function calculateEffectiveWeight(totalWeight, waxPercent) {
    const waxFreeWeight = totalWeight * (100 - waxPercent) / 100;
    const penetrationWeight = totalWeight * waxPercent / 100 * WAX_CRACK_FACTOR;
    
    return {
        effective: waxFreeWeight + penetrationWeight,
        waxFree: waxFreeWeight,
        penetration: penetrationWeight,
        total: totalWeight,
        waxPercent: waxPercent
    };
}

// ==============================================
// 31. GET LIQUOR RATIO
// ==============================================

function getLiquorRatio(weight) {
    for (const level of LIQUOR_RATIO_TABLE) {
        if (weight <= level.maxWeight) {
            return level.ratio;
        }
    }
    return 10;
}

// ==============================================
// 32. CALCULATE CHEMICALS & UTILITIES COST
// ==============================================

function calculateChemicals(weight, fabricType, waxPercent, dyes) {
    const fabricData = FABRIC_ADJUSTMENTS[fabricType] || FABRIC_ADJUSTMENTS["Poplin (100% Cotton)"];
    const liquorRatio = getLiquorRatio(weight);
    const waterVolume = (weight * liquorRatio) / 1000; // Liters
    
    // Chemical quantities (grams)
    const saltGrams = fabricData.saltBase * waterVolume;
    const sodaAshGrams = fabricData.sodaBase * waterVolume;
    const ureaGrams = fabricData.ureaBase * waterVolume;
    
    // Get unit prices from dyeSettings (assuming Rs/kg, so convert to Rs/g)
    const settings = window.dyeSettings || {};
    
    const getPrice = (itemName, defaultPrice = 0) => {
        const saved = settings[itemName];
        return saved && saved.price ? parseFloat(saved.price) / 1000 : defaultPrice; // Rs/g
    };
    
    // Chemical costs (Rs)
    const saltCost = saltGrams * getPrice("Glauber's Salt", 50/1000); // Default Rs.50/kg
    const sodaAshCost = sodaAshGrams * getPrice("Soda Ash", 60/1000);  // Default Rs.60/kg
    const ureaCost = ureaGrams * getPrice("Urea", 80/1000);           // Default Rs.80/kg
    
    // Utilities costs
    const waterCostPerLiter = getPrice("Water", 0.1); // Default Rs.0.1/L
    const electricityCostPerKwh = getPrice("Electricity", 30); // Default Rs.30/kWh
    const labourCostPerHour = getPrice("Labour Cost", 200); // Default Rs.200/hour
    
    // Water cost
    const waterCost = waterVolume * waterCostPerLiter;
    
    // Electricity cost (simplified: assume 0.5 kWh per kg of fabric)
    const electricityKwh = weight / 1000 * 0.5; // 0.5 kWh per kg
    const electricityCost = electricityKwh * electricityCostPerKwh;
    
    // Labour cost (simplified: assume 1 hour per kg of fabric)
    const labourHours = weight / 1000; // 1 hour per kg
    const labourCost = labourHours * labourCostPerHour;
    
    const temp = Math.max(...(dyes || []).map(d => d.temp || 60));
    const time = Math.max(...(dyes || []).map(d => d.time || 60));
    
    return {
        // Quantities
        water: waterVolume.toFixed(2) + " L",
        liquorRatio: liquorRatio + ":1",
        salt: saltGrams.toFixed(2) + " g",
        sodaAsh: sodaAshGrams.toFixed(2) + " g",
        urea: ureaGrams.toFixed(2) + " g",
        temperature: temp + "°C",
        time: time + " min",
        
        // Costs
        saltCost: saltCost.toFixed(2),
        sodaAshCost: sodaAshCost.toFixed(2),
        ureaCost: ureaCost.toFixed(2),
        waterCost: waterCost.toFixed(2),
        electricityCost: electricityCost.toFixed(2),
        labourCost: labourCost.toFixed(2),
        
        // Total chemicals cost (excluding utilities)
        totalChemicalsCost: (saltCost + sodaAshCost + ureaCost).toFixed(2),
        
        // Total utilities cost
        totalUtilitiesCost: (waterCost + electricityCost + labourCost).toFixed(2),
        
        // Grand total (dyes cost will be added separately)
        totalAuxCost: (saltCost + sodaAshCost + ureaCost + waterCost + electricityCost + labourCost).toFixed(2)
    };
}

// ==============================================
// ==============================================
// ==============================================
// ==============================================
// ==============================================
// ==============================================
// ==============================================
// ==============================================
// 33. WAX COMPOSITIONS - USER SELECTABLE
// ==============================================

const WAX_COMPOSITIONS = {
    "standard": {
        name: "🏮 සම්මත මිශ්‍රණය (70% Paraffin, 20% Bee, 10% Omini)",
        description: "45°C-50°C - හොඳින් ඉරිතැලීම්",
        composition: {
            "Paraffin Wax": 70,
            "Bee Wax": 20,
            "Omini Wax": 10
        }
    },
    "high_covering": {
        name: "🔥 High Covering (60% Paraffin, 20% Bee, 20% Omini)",
        description: "55°C-60°C - අධික ආවරණය, ඇතුළට කාන්දු වීම අඩු",
        composition: {
            "Paraffin Wax": 60,
            "Bee Wax": 20,
            "Omini Wax": 20
        }
    },
    "fine_lines": {
        name: "✨ සියුම් රේඛා (50% Paraffin, 15% Bee, 25% Omini, 10% Rosin)",
        description: "65°C-70°C - ඉතා සියුම් රේඛා, Portrait Masterpiece",
        composition: {
            "Paraffin Wax": 50,
            "Bee Wax": 15,
            "Omini Wax": 25,
            "Rosin": 10
        }
    },
    "eco_noboil": {
        name: "🌿 Eco No-Boil (80% Paraffin, 20% Rosin)",
        description: "40°C - ඉතා පහසුවෙන් ඉවත් කළ හැකි",
        composition: {
            "Paraffin Wax": 80,
            "Rosin": 20
        }
    }
};

// ==============================================
// 34. CALCULATE WAX QUANTITY AND COST (USER SELECTABLE COMPOSITION)
// ==============================================

function calculateWaxQuantity(totalWeight, waxCoveragePercent, compositionKey = "standard") {
    // Wax application rate (ග්‍රෑම් ඉටි / ග්‍රෑම් රෙදි)
    // සාමාන්‍යයෙන් රෙදි බරෙන් 30-50% පමණ ඉටි යොදනවා. අපි 40% ගමු.
    const WAX_APPLICATION_RATE = 0.4; // 40% of fabric weight
    
    // යෙදිය යුතු මුළු ඉටි ප්‍රමාණය (wax coverage % එක අනුව)
    const totalWaxGrams = totalWeight * WAX_APPLICATION_RATE * (waxCoveragePercent / 100);
    
    // තෝරාගත් composition එක ගන්න
    const selectedComposition = WAX_COMPOSITIONS[compositionKey] || WAX_COMPOSITIONS["standard"];
    const composition = selectedComposition.composition;
    
    // එක් එක් ඉටි වර්ගය සඳහා ගත යුතු ප්‍රමාණය
    const waxComponents = [];
    let totalCost = 0;
    
    // Unit prices ගන්න (window.dyeSettings වලින්)
    const settings = window.dyeSettings || {};
    
    const getPrice = (waxName) => {
        const saved = settings[waxName];
        return saved && saved.price ? parseFloat(saved.price) : 0; // රු/කිලෝ
    };
    
    for (const [waxName, percentage] of Object.entries(composition)) {
        const grams = totalWaxGrams * (percentage / 100);
        const pricePerKg = getPrice(waxName);
        const cost = (grams / 1000) * pricePerKg; // කිලෝවට මිල ගණනය
        
        waxComponents.push({
            name: waxName,
            percentage: percentage,
            grams: grams.toFixed(2),
            cost: cost.toFixed(2)
        });
        
        totalCost += cost;
    }
    
    return {
        compositionName: selectedComposition.name,
        compositionDescription: selectedComposition.description,
        totalWaxGrams: totalWaxGrams.toFixed(2),
        waxComponents: waxComponents,
        totalCost: totalCost.toFixed(2)
    };
}

// ==============================================
// 35. FIND BEST DYE MATCHES WITH BACKGROUND - METHODOLOGY FILTER
// ==============================================

function findBestDyeMatchesWithBackground(targetRGB, dyes, methodology, bgRGB) {
    const targetLab = rgbToLab(targetRGB[0], targetRGB[1], targetRGB[2]);
    const targetColor = detectColorFamily(targetRGB[0], targetRGB[1], targetRGB[2]);
    const targetFamily = targetColor.family;
    
    const bgColor = detectColorFamily(bgRGB[0], bgRGB[1], bgRGB[2]);
    const bgFamily = bgColor.family;
    
    const bgAdjustment = calculateBackgroundAdjustment(targetRGB, bgRGB);
    
    // Get preferences with mandatoryRules
    const { preferredFamilies, avoidedFamilies, mandatoryRules, prohibitedRules } =
    getBackgroundBasedPreferences(targetFamily, bgFamily, targetColor);
    
    console.log("%c🔵🔵🔵 FIND BEST DYE MATCHES 🔵🔵🔵", "color: #0000ff; font-size: 14px");
    console.log(`🎯 Target: ${targetFamily} on ${bgFamily} background`);
    console.log(`🎯 Methodology: ${methodology}`);
    console.log(`📋 Mandatory Rules:`, mandatoryRules);
    
    // ✅ METHODOLOGY FILTER - මෙතනදී විතරයි filter කරන්නේ
    const allowedGroups = METHODOLOGY_GROUPS[methodology] || ["Reactive"];
    console.log(`📋 Allowed groups for ${methodology}:`, allowedGroups);
    
    // Stock dyes filter by methodology
    const stockDyes = dyes.filter(dye => {
        const inStock = isDyeInStock(dye);
        const groupAllowed = allowedGroups.includes(dye.groupId);
        
        if (inStock && groupAllowed) {
            return true;
        }
        
        if (dye.groupId === "Reactive" && !allowedGroups.includes("Reactive")) {
            console.log(`   ❌ Excluding Reactive dye: ${dye.name} (not allowed for ${methodology})`);
        }
        
        return false;
    });
    
    // Purchase dyes filter by methodology
    const purchaseDyes = dyes.filter(dye => {
        const available = isDyeAvailableForPurchase(dye);
        const groupAllowed = allowedGroups.includes(dye.groupId);
        
        if (available && groupAllowed) {
            return true;
        }
        
        return false;
    });
    
    console.log(`📦 Stock dyes (${methodology} only): ${stockDyes.length}`);
    console.log(`🛒 Purchase dyes (${methodology} only): ${purchaseDyes.length}`);
    
    if (stockDyes.length === 0) {
        return {
            error: true,
            message: `${methodology} සඳහා stock එකේ සායම් නැත. කරුණාකර stores එකෙන් ${methodology} සායම් tick කරන්න.`
        };
    }
    
    // Process stock dyes with background adjustment
    const stockDyesWithDelta = stockDyes.map(dye => {
        const dyeLab = rgbToLab(dye.r, dye.g, dye.b);
        const dyeFamily = getDyeColorFamily(dye);
        
        let deltaE = calculateDeltaE(targetLab, dyeLab);
        deltaE = applyBackgroundAdjustmentToDeltaE(deltaE, bgAdjustment, dye, targetFamily);
        
        // Apply background-based preferences
        if (preferredFamilies.includes(dyeFamily)) {
            deltaE = deltaE * 0.8;
        }
        
        if (avoidedFamilies.includes(dyeFamily)) {
            deltaE = deltaE * 1.3;
        }
        
        return { ...dye, deltaE, family: dyeFamily, inStock: true };
    });
    
    stockDyesWithDelta.sort((a, b) => a.deltaE - b.deltaE);
    
    console.log(`🥇 Best single dye: ${stockDyesWithDelta[0]?.name} (ΔE=${stockDyesWithDelta[0]?.deltaE.toFixed(2)})`);
    
    // Process purchase dyes
    const purchaseDyesWithDelta = purchaseDyes.map(dye => {
        const dyeLab = rgbToLab(dye.r, dye.g, dye.b);
        const dyeFamily = getDyeColorFamily(dye);
        
        let deltaE = calculateDeltaE(targetLab, dyeLab);
        deltaE = applyBackgroundAdjustmentToDeltaE(deltaE, bgAdjustment, dye, targetFamily);
        
        if (preferredFamilies.includes(dyeFamily)) {
            deltaE = deltaE * 0.8;
        }
        
        if (avoidedFamilies.includes(dyeFamily)) {
            deltaE = deltaE * 1.3;
        }
        
        return { ...dye, deltaE, family: dyeFamily, inStock: false };
    });
    
    purchaseDyesWithDelta.sort((a, b) => a.deltaE - b.deltaE);
    
    // Generate 2-dye mixes
    const twoDyeOptions = generateTwoDyeMixesWithBackground(
        stockDyesWithDelta,
        targetLab,
        bgAdjustment,
        targetFamily,
        preferredFamilies,
        avoidedFamilies,
        mandatoryRules
    );
    console.log(`📊 2-dye mixes generated: ${twoDyeOptions.length}`);
    
    // Generate 3-dye mixes with mandatory rules
    const threeDyeOptions = generateThreeDyeMixesWithBackground(
        stockDyesWithDelta,
        targetLab,
        bgAdjustment,
        targetFamily,
        preferredFamilies,
        avoidedFamilies,
        mandatoryRules
    );
    
    console.log(`📊 3-dye mixes generated: ${threeDyeOptions.length}`);
    
    // Generate purchase options
    const purchaseOptions = generatePurchaseOptionsWithBackground(
        targetLab, stockDyesWithDelta, purchaseDyesWithDelta, targetFamily, bgAdjustment
    );
    
    // Get recommendations
    const recommendations = getMissingFamiliesMessageWithBackground(
        targetFamily, bgFamily,
        stockDyesWithDelta.map(d => d.family),
        purchaseDyesWithDelta.map(d => d.family)
    );
    
    return {
        single: stockDyesWithDelta[0] ? {
            dye: stockDyesWithDelta[0],
            deltaE: stockDyesWithDelta[0].deltaE,
            classification: classifyDeltaE(stockDyesWithDelta[0].deltaE),
            rgb: [stockDyesWithDelta[0].r, stockDyesWithDelta[0].g, stockDyesWithDelta[0].b],
            family: stockDyesWithDelta[0].family,
            bgAdjusted: true
        } : null,
        twoDye: twoDyeOptions[0] || null,
        threeDye: threeDyeOptions[0] || null,
        allOptions: {
            single: stockDyesWithDelta.slice(0, 10),
            twoDye: twoDyeOptions.slice(0, 10),
            threeDye: threeDyeOptions.slice(0, 10)
        },
        purchaseOptions,
        recommendations,
        bgAdjustment,
        bgFamily,
        targetFamily,
        mandatoryRules: mandatoryRules,
        threeDyeCount: threeDyeOptions.length
    };
}
// ==============================================
// 36. MAIN RECIPE GENERATION FUNCTION
// ==============================================

async function generateRecipeFromDatabase(params) {
    console.log("🎨 HSOP Calculator Started - WITH FULL BACKGROUND INTEGRATION");
    
    try {
        const targetRGB = typeof params.targetRGB === 'string'
            ? params.targetRGB.split(',').map(v => parseInt(v.trim()))
            : params.targetRGB;
            
        const bgRGB = typeof params.bgRGB === 'string'
            ? params.bgRGB.split(',').map(v => parseInt(v.trim()))
            : params.bgRGB;
        
        const methodology = params.methodology || window.currentMethodology || "Reactive Dyeing";
        const fabric = params.fabric;
        const totalWeight = parseFloat(params.weight);
        let waxPercent = parseFloat(params.coverage);
        const waxComposition = params.waxComposition || "standard";
        
        if (isNaN(waxPercent)) waxPercent = 50;
        
        if (!targetRGB || targetRGB.length !== 3) {
            return { error: true, message: "Invalid target RGB" };
        }
        
        if (!bgRGB || bgRGB.length !== 3) {
            return { error: true, message: "Invalid background RGB" };
        }
        
        if (isNaN(totalWeight) || totalWeight <= 0) {
            return { error: true, message: "Invalid fabric weight" };
        }
        
        if (waxPercent < 0 || waxPercent > 100) {
            return { error: true, message: "Wax coverage must be 0-100%" };
        }
        
        const allDyes = window.allDyes;
        if (!allDyes || allDyes.length === 0) {
            return { error: true, message: "Dye database not loaded" };
        }
        
        const targetColor = detectColorFamily(targetRGB[0], targetRGB[1], targetRGB[2]);
        const bgColor = detectColorFamily(bgRGB[0], bgRGB[1], bgRGB[2]);
        
        const weightCalc = calculateEffectiveWeight(totalWeight, waxPercent);
        
        let depthPreference = "medium";
        if (targetColor.hsv.v < 0.2) depthPreference = "extraDark";
        else if (targetColor.hsv.v < 0.3) depthPreference = "dark";
        else if (targetColor.hsv.v < 0.4) depthPreference = "mediumDark";
        else if (targetColor.hsv.v > 0.8) depthPreference = "veryLight";
        else if (targetColor.hsv.v > 0.6) depthPreference = "light";
        
        const baseDOS = calculateBaseDOS(
            targetColor.family,
            targetColor.hsv.s,
            targetColor.hsv.v,
            depthPreference,
            fabric
        );
        
        const bgAdjustment = calculateBackgroundAdjustment(targetRGB, bgRGB);
        
        let finalDOS = baseDOS * bgAdjustment.factor;
        finalDOS = Math.min(8.0, Math.max(0.3, finalDOS));
        
        const matches = findBestDyeMatchesWithBackground(targetRGB, allDyes, methodology, bgRGB);
        
        if (matches.error) return matches;
        
        const totalDyeGrams = (weightCalc.effective * finalDOS / 100);
        
        const options = {};
        
        if (matches.single) {
            const quantity = totalDyeGrams;
            const cost = (quantity * (window.dyeSettings?.[matches.single.dye.name]?.price || 0) / 100).toFixed(2);
            
            options.single = {
                ...matches.single,
                quantity: {
                    grams: quantity.toFixed(2),
                    percentage: 100,
                    cost: cost
                }
            };
        }
        
        if (matches.twoDye) {
            const dye1grams = totalDyeGrams * matches.twoDye.percentages[0] / 100;
            const dye2grams = totalDyeGrams * matches.twoDye.percentages[1] / 100;
            
            const dyes = [
                {
                    name: matches.twoDye.dyes[0].name,
                    grams: dye1grams.toFixed(2),
                    percentage: matches.twoDye.percentages[0],
                    cost: ((dye1grams * (window.dyeSettings?.[matches.twoDye.dyes[0].name]?.price || 0) / 100)).toFixed(2)
                },
                {
                    name: matches.twoDye.dyes[1].name,
                    grams: dye2grams.toFixed(2),
                    percentage: matches.twoDye.percentages[1],
                    cost: ((dye2grams * (window.dyeSettings?.[matches.twoDye.dyes[1].name]?.price || 0) / 100)).toFixed(2)
                }
            ];
            
            const totalCost = dyes.reduce((sum, d) => sum + parseFloat(d.cost), 0).toFixed(2);
            
            options.twoDye = {
                ...matches.twoDye,
                quantity: {
                    dyes,
                    totalGrams: totalDyeGrams.toFixed(2),
                    totalCost
                }
            };
        }
        
        if (matches.threeDye) {
            const dyes = matches.threeDye.dyes.map((dye, index) => {
                const grams = totalDyeGrams * matches.threeDye.percentages[index] / 100;
                return {
                    name: dye.name,
                    grams: grams.toFixed(2),
                    percentage: matches.threeDye.percentages[index],
                    cost: ((grams * (window.dyeSettings?.[dye.name]?.price || 0) / 100)).toFixed(2)
                };
            });
            
            const totalCost = dyes.reduce((sum, d) => sum + parseFloat(d.cost), 0).toFixed(2);
            
            options.threeDye = {
                ...matches.threeDye,
                quantity: {
                    dyes,
                    totalGrams: totalDyeGrams.toFixed(2),
                    totalCost
                }
            };
        }
        
        const allDyesUsed = matches.single ? [matches.single.dye] :
            (matches.twoDye ? matches.twoDye.dyes : 
                (matches.threeDye ? matches.threeDye.dyes : []));
        
        const chemicals = calculateChemicals(totalWeight, fabric, waxPercent, allDyesUsed);
        
        // ==============================================
        // WAX CALCULATION
        // ==============================================
        const waxCalculation = calculateWaxQuantity(totalWeight, waxPercent, waxComposition);
        
        // ==============================================
        // PROCESS STEPS CALCULATION (Best Option from STOCK first)
        // ==============================================
        let processSteps = null;
        let recipeSource = "none"; // "stock" or "purchase"

        // පළමුව STOCK එකේ තියෙන විකල්ප වලින් හොඳම එක හොයන්න
        let bestStockOption = null;
        let bestStockDeltaE = Infinity;
        let bestStockType = null;

        // Single dye from stock
        if (options.single && options.single.deltaE < DELTA_E_THRESHOLD.AVAILABLE && options.single.deltaE < bestStockDeltaE) {
            bestStockOption = options.single;
            bestStockDeltaE = options.single.deltaE;
            bestStockType = 'single';
        }
        // 2-dye mix from stock
        if (options.twoDye && options.twoDye.deltaE < DELTA_E_THRESHOLD.AVAILABLE && options.twoDye.deltaE < bestStockDeltaE) {
            bestStockOption = options.twoDye;
            bestStockDeltaE = options.twoDye.deltaE;
            bestStockType = 'twoDye';
        }
        // 3-dye mix from stock
        if (options.threeDye && options.threeDye.deltaE < DELTA_E_THRESHOLD.AVAILABLE && options.threeDye.deltaE < bestStockDeltaE) {
            bestStockOption = options.threeDye;
            bestStockDeltaE = options.threeDye.deltaE;
            bestStockType = 'threeDye';
        }

        // STOCK එකේ හොඳ විකල්පයක් තියෙනවද?
        let finalOption = null;
        let finalType = null;

        if (bestStockOption) {
            // Stock එකේ හොඳම එක තෝරන්න
            finalOption = bestStockOption;
            finalType = bestStockType;
            recipeSource = "stock";
            console.log(`✅ Using BEST STOCK option: ${finalType} with ΔE=${bestStockDeltaE.toFixed(2)}`);
        } else {
            // Stock එකේ හොඳ එකක් නැත්නම්, PURCHASE එකෙන් හොඳම එක ගන්න
            if (matches.purchaseOptions && matches.purchaseOptions.options && matches.purchaseOptions.options.length > 0) {
                // purchaseOptions.options already sorted by deltaE
                const bestPurchase = matches.purchaseOptions.options[0];
                
                // Purchase option එක single dye නම්
                if (bestPurchase.type === "Single Dye (Purchase)") {
                    finalOption = {
                        dye: { name: bestPurchase.name, ...bestPurchase },
                        deltaE: bestPurchase.deltaE,
                        classification: bestPurchase.classification,
                        quantity: { grams: "0", cost: "0" } // Will be calculated below
                    };
                    finalType = 'purchase-single';
                } else {
                    // Purchase option එක mix එකක් නම් (stock+purchase හෝ both purchase)
                    finalOption = {
                        dyes: bestPurchase.dyes,
                        percentages: bestPurchase.percentages,
                        deltaE: bestPurchase.deltaE,
                        classification: bestPurchase.classification,
                        quantity: { dyes: [], totalGrams: "0", totalCost: "0" }
                    };
                    finalType = bestPurchase.type.includes("Mix") ? 'purchase-mix' : 'purchase-other';
                }
                recipeSource = "purchase";
                console.log(`🛒 Using BEST PURCHASE option: ${bestPurchase.name} with ΔE=${bestPurchase.deltaE.toFixed(2)}`);
            }
        }

        // Process steps ගණනය කරන්න (finalOption එකට අනුව)
        if (finalOption) {
            // Stock solutions සඳහා dye grams එකතු කරන්න
            const stockList = [];
            let totalStockMl = 0;
            
            if (finalType === 'single') {
                const grams = parseFloat(finalOption.quantity.grams) || 0;
                const stockMl = grams * 100;
                stockList.push({
                    name: finalOption.dye.name,
                    grams: grams.toFixed(2),
                    stockMl: stockMl.toFixed(0)
                });
                totalStockMl = stockMl;
            } else if (finalType === 'twoDye' || finalType === 'threeDye') {
                finalOption.quantity.dyes.forEach(d => {
                    const grams = parseFloat(d.grams) || 0;
                    const stockMl = grams * 100;
                    stockList.push({
                        name: d.name,
                        grams: grams.toFixed(2),
                        stockMl: stockMl.toFixed(0)
                    });
                    totalStockMl += stockMl;
                });
            } else if (finalType === 'purchase-single') {
                // Purchase single dye සඳහා
                const grams = totalDyeGrams;
                const stockMl = grams * 100;
                stockList.push({
                    name: finalOption.dye.name,
                    grams: grams.toFixed(2),
                    stockMl: stockMl.toFixed(0)
                });
                totalStockMl = stockMl;
                
                // quantity object එක update කරන්න
                finalOption.quantity = {
                    grams: grams.toFixed(2),
                    cost: ((grams * (window.dyeSettings?.[finalOption.dye.name]?.price || 0) / 100)).toFixed(2)
                };
            } else if (finalType === 'purchase-mix') {
                // Purchase mix සඳහා
                finalOption.quantity.dyes = finalOption.dyes.map((dye, index) => {
                    const grams = totalDyeGrams * finalOption.percentages[index] / 100;
                    return {
                        name: dye.name,
                        grams: grams.toFixed(2),
                        percentage: finalOption.percentages[index],
                        cost: ((grams * (window.dyeSettings?.[dye.name]?.price || 0) / 100)).toFixed(2)
                    };
                });
                finalOption.quantity.totalGrams = totalDyeGrams.toFixed(2);
                finalOption.quantity.totalCost = finalOption.quantity.dyes.reduce((sum, d) => sum + parseFloat(d.cost), 0).toFixed(2);
                
                // stockList update
                finalOption.quantity.dyes.forEach(d => {
                    stockList.push({
                        name: d.name,
                        grams: d.grams,
                        stockMl: (parseFloat(d.grams) * 100).toFixed(0)
                    });
                    totalStockMl += parseFloat(d.grams) * 100;
                });
            }
            
            // මුළු ජල ප්‍රමාණය (liquor ratio එකෙන්)
            let liquorRatioNumber = 20;
            if (chemicals && chemicals.liquorRatio) {
                const ratioMatch = chemicals.liquorRatio.match(/(\d+):/);
                if (ratioMatch) liquorRatioNumber = parseInt(ratioMatch[1]);
            }
            const totalWeightNum = parseFloat(params.weight) || 0;
            const totalWaterMl = totalWeightNum * liquorRatioNumber;
            
            // ඉතිරි ජලය
            const remainingWaterMl = totalWaterMl - totalStockMl;
            
            // උෂ්ණත්ව ගණනය
            const targetTemp = chemicals.temperature ? parseInt(chemicals.temperature) : 60;
            const coldTemp = 25;
            const hotTemp = 100;
            
            let hotWaterMl = 0, coldWaterMl = 0;
            if (remainingWaterMl > 0) {
                hotWaterMl = (remainingWaterMl * (targetTemp - coldTemp)) / (hotTemp - coldTemp);
                coldWaterMl = remainingWaterMl - hotWaterMl;
                hotWaterMl = Math.round(hotWaterMl);
                coldWaterMl = Math.round(coldWaterMl);
            }
            
            processSteps = {
                stockList,
                totalStockMl: Math.round(totalStockMl),
                totalWaterMl: Math.round(totalWaterMl),
                remainingWaterMl: Math.round(remainingWaterMl),
                hotWaterMl,
                coldWaterMl,
                targetTemp,
                liquorRatio: liquorRatioNumber,
                urea: chemicals.urea ? parseFloat(chemicals.urea) : 0,
                salt: chemicals.salt ? parseFloat(chemicals.salt) : 0,
                sodaAsh: chemicals.sodaAsh ? parseFloat(chemicals.sodaAsh) : 0,
                time: chemicals.time || "60 min",
                source: recipeSource // stock or purchase
            };
        }
        
        // Calculate total costs
        let dyesTotalCost = 0;
        if (options.single) dyesTotalCost += parseFloat(options.single.quantity.cost || 0);
        if (options.twoDye) dyesTotalCost += parseFloat(options.twoDye.quantity.totalCost || 0);
        if (options.threeDye) dyesTotalCost += parseFloat(options.threeDye.quantity.totalCost || 0);
        
        const chemicalsCost = parseFloat(chemicals.totalAuxCost || 0);
        const waxCost = parseFloat(waxCalculation.totalCost || 0);
        const totalCost = dyesTotalCost + chemicalsCost + waxCost;
        
        let message = "";
        if (matches.bgAdjustment.difficulty === "VERY_HARD") {
            message = `⚠️ ${matches.bgAdjustment.message}`;
        } else if (matches.single && matches.single.classification.text === "PERFECT") {
            message = "✅ Perfect match found with single dye!";
        } else if (matches.single && matches.single.classification.text === "GOOD") {
            message = "👍 Good match with single dye";
        } else if (matches.twoDye && matches.twoDye.classification.text !== "IMPOSSIBLE") {
            message = `⚠️ 2-dye mix gives ${matches.twoDye.classification.text} result (background adjusted)`;
        } else if (matches.threeDye && matches.threeDye.classification.text !== "IMPOSSIBLE") {
            message = `⚠️ 3-dye mix gives ${matches.threeDye.classification.text} result (background adjusted)`;
        } else {
            message = "❌ Cannot achieve target color with available dyes";
        }
        
        const recipe = {
            success: true,
            timestamp: new Date().toISOString(),
            inputs: {
                targetColor: `rgb(${targetRGB[0]},${targetRGB[1]},${targetRGB[2]})`,
                targetFamily: targetColor.family,
                targetEmoji: targetColor.data?.emoji || "🎨",
                background: `rgb(${bgRGB[0]},${bgRGB[1]},${bgRGB[2]})`,
                backgroundFamily: bgColor.family,
                backgroundEmoji: bgColor.data?.emoji || "🎨",
                methodology,
                fabric,
                totalWeight: totalWeight + "g",
                waxCoverage: waxPercent + "%",
                effectiveWeight: weightCalc.effective.toFixed(2) + "g",
                waxComposition: waxComposition
            },
            analysis: {
                targetHSV: {
                    h: targetColor.hsv.h.toFixed(1) + "°",
                    s: (targetColor.hsv.s * 100).toFixed(1) + "%",
                    v: (targetColor.hsv.v * 100).toFixed(1) + "%"
                },
                backgroundHSV: {
                    h: bgColor.hsv.h.toFixed(1) + "°",
                    s: (bgColor.hsv.s * 100).toFixed(1) + "%",
                    v: (bgColor.hsv.v * 100).toFixed(1) + "%"
                },
                depthPreference,
                baseDOS: baseDOS.toFixed(2) + "%",
                backgroundAdjustment: {
                    factor: bgAdjustment.factor.toFixed(2),
                    difficulty: bgAdjustment.difficulty,
                    message: bgAdjustment.message
                },
                finalDOS: finalDOS.toFixed(2) + "%"
            },
            weightCalculation: {
                total: weightCalc.total + "g",
                waxPercent: weightCalc.waxPercent + "%",
                waxFreeArea: weightCalc.waxFree.toFixed(2) + "g",
                penetrationArea: weightCalc.penetration.toFixed(2) + "g",
                effective: weightCalc.effective.toFixed(2) + "g",
                crackFactor: WAX_CRACK_FACTOR
            },
            options,
            chemicals,
            waxCalculation,
            purchaseOptions: matches.purchaseOptions || [],
            recommendations: matches.recommendations || "",
            processSteps,
            source: recipeSource,
            dyesTotalCost: dyesTotalCost.toFixed(2),
            chemicalsCost: chemicalsCost.toFixed(2),
            waxCost: waxCost.toFixed(2),
            totalCost: totalCost.toFixed(2),
            message
        };
        
        currentRecipe = recipe;
        window.currentRecipe = recipe;
        
        return recipe;
        
    } catch (error) {
        console.error("🔴 HSOP Calculator Error:", error);
        return { error: true, message: error.message };
    }
}

// ==============================================
// 37. HTML FORMATTING FUNCTION
// ==============================================

function formatDatabaseRecipeHTML(recipe) {
    if (recipe.error) {
        return `
            <div style="background: #330000; border: 2px solid #ff3131; border-radius: 15px; padding: 20px; margin: 20px 0;">
                <div style="font-size: 40px; text-align: center; margin-bottom: 10px;">❌</div>
                <h3 style="color: #ff3131; text-align: center; margin: 0 0 10px 0;">Error</h3>
                <p style="color: #ff8888; text-align: center; margin: 0;">${recipe.message}</p>
            </div>
        `;
    }
    
    if (!recipe || !recipe.options) {
        return `
            <div style="background: #330000; border: 2px solid #ff3131; border-radius: 15px; padding: 20px; margin: 20px 0;">
                <div style="font-size: 40px; text-align: center; margin-bottom: 10px;">⚠️</div>
                <h3 style="color: #ff3131; text-align: center; margin: 0 0 10px 0;">Invalid Recipe Data</h3>
                <p style="color: #ff8888; text-align: center; margin: 0;">Recipe data is incomplete</p>
            </div>
        `;
    }
    
    let minDeltaE_Available = Infinity;
    let minDeltaEOption_Available = null;
    
    if (recipe.options.single && recipe.options.single.deltaE < minDeltaE_Available) {
        minDeltaE_Available = recipe.options.single.deltaE;
        minDeltaEOption_Available = { type: 'single', data: recipe.options.single };
    }
    if (recipe.options.twoDye && recipe.options.twoDye.deltaE < minDeltaE_Available) {
        minDeltaE_Available = recipe.options.twoDye.deltaE;
        minDeltaEOption_Available = { type: 'twoDye', data: recipe.options.twoDye };
    }
    if (recipe.options.threeDye && recipe.options.threeDye.deltaE < minDeltaE_Available) {
        minDeltaE_Available = recipe.options.threeDye.deltaE;
        minDeltaEOption_Available = { type: 'threeDye', data: recipe.options.threeDye };
    }
    
    const getClassificationColor = (cls) => {
        if (!cls) return "#888";
        if (cls.text === "PERFECT") return "#39ff14";
        if (cls.text === "GOOD") return "#0ff";
        if (cls.text === "MEDIUM") return "#ffd700";
        if (cls.text === "POOR") return "#ff9900";
        return "#ff3131";
    };
    
    const getClassificationEmoji = (cls) => {
        if (!cls) return "❓";
        return cls.emoji || "🎨";
    };
    
    const getClassificationText = (cls) => {
        if (!cls) return "UNKNOWN";
        return cls.text || "UNKNOWN";
    };
    
    const getOptionHTML = (option, title, optionType) => {
        if (!option) return '';
        if (optionType !== 'purchase' && option.deltaE > DELTA_E_THRESHOLD.AVAILABLE) {
            return '';
        }
        
        const classification = option.classification || { text: "UNKNOWN", emoji: "❓" };
        const color = getClassificationColor(classification);
        
        const isBestOption = (minDeltaEOption_Available && 
                             minDeltaEOption_Available.type === optionType && 
                             minDeltaEOption_Available.data === option);
        
        const bestOptionStyle = isBestOption ? `
            animation: goldenBlink 1.5s infinite;
            border: 3px solid #ffd700;
            box-shadow: 0 0 20px #ffd700;
            position: relative;
            background: linear-gradient(145deg, #1a1a00, #111);
        ` : '';
        
        const bestBadge = isBestOption ? `
            <div style="position: absolute; top: -10px; right: -10px; background: #ffd700; color: #000; 
                        padding: 5px 10px; border-radius: 20px; font-size: 10px; font-weight: bold;
                        box-shadow: 0 0 15px #ffd700; z-index: 10;">
                ⭐ BEST MATCH ⭐
            </div>
        ` : '';
        
        return `
            <div style="position: relative; background: #111; border-radius: 12px; padding: 15px; margin-bottom: 15px; 
                        border-left: 4px solid ${color}; ${bestOptionStyle}">
                ${bestBadge}
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h4 style="color: #ffd700; margin: 0;">${title}</h4>
                    <span style="color: ${color}; font-size: 12px; font-weight: bold;">
                        ${getClassificationEmoji(classification)} ${getClassificationText(classification)} (ΔE: ${(option.deltaE || 0).toFixed(2)})
                        ${isBestOption ? ' 👑' : ''}
                    </span>
                </div>
                
                ${option.quantity ? `
                    <div style="background: #1a1a1a; border-radius: 8px; padding: 10px;">
                        ${option.quantity.dyes ? option.quantity.dyes.map(d => `
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 5px 0; border-bottom: 1px solid #333;">
                                <span style="color: #0ff; font-size: 11px;">${d.name || 'Unknown'}</span>
                                <span style="color: #39ff14; font-size: 11px;">${d.percentage || 0}%</span>
                                <span style="color: #fff; font-size: 11px;">${d.grams || '0g'}</span>
                                <span style="color: #ffd700; font-size: 11px;">Rs.${d.cost || '0'}</span>
                            </div>
                        `).join('') : `
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 5px 0;">
                                <span style="color: #0ff; font-size: 11px;">${option.dye?.name || 'Unknown'}</span>
                                <span style="color: #39ff14; font-size: 11px;">100%</span>
                                <span style="color: #fff; font-size: 11px;">${option.quantity.grams || '0g'}</span>
                                <span style="color: #ffd700; font-size: 11px;">Rs.${option.quantity.cost || '0'}</span>
                            </div>
                        `}
                        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 8px; margin-top: 5px; border-top: 2px solid #333; font-weight: bold;">
                            <span style="color: #ffd700;">Total</span>
                            <span style="color: #fff;">${option.quantity.totalGrams || option.quantity.grams || '0g'}</span>
                            <span style="color: #ffd700;">Rs.${option.quantity.totalCost || option.quantity.cost || '0'}</span>
                        </div>
                    </div>
                ` : ''}
                
                ${option.bgAdjusted ? `
                    <div style="margin-top: 8px; font-size: 9px; color: #888; text-align: right;">
                        Background adjusted
                    </div>
                ` : ''}
            </div>
        `;
    };
    
    let html = `
        <style>
            @keyframes goldenBlink {
                0% { box-shadow: 0 0 5px #ffd700; border-color: #ffd700; }
                50% { box-shadow: 0 0 25px #ffd700, 0 0 40px #ffaa00; border-color: #fff700; }
                100% { box-shadow: 0 0 5px #ffd700; border-color: #ffd700; }
            }
        </style>
        
        <div style="background: linear-gradient(145deg, #0a0a0a, #111); border: 2px solid #ffd700; border-radius: 20px; padding: 25px; margin: 20px 0; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 2px solid #333;">
                <div>
                    <h2 style="color: #ffd700; margin: 0; font-size: 20px;">🎨 HSOP Recipe with Background Adaptation</h2>
                    <div style="font-size: 11px; color: #888; margin-top: 5px;">${recipe.timestamp ? new Date(recipe.timestamp).toLocaleString('si-LK') : new Date().toLocaleString('si-LK')}</div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 14px; color: #0ff; font-weight: bold;">${recipe.inputs?.methodology || 'Unknown'}</div>
                    <div style="font-size: 11px; color: #888;">${recipe.inputs?.fabric || 'Unknown'}</div>
                </div>
            </div>
            
            <div style="display: flex; gap: 20px; margin-bottom: 20px; background: #1a1a1a; border-radius: 12px; padding: 15px;">
                <div style="flex: 1; text-align: center;">
                    <div style="width: 60px; height: 60px; border-radius: 10px; background: ${recipe.inputs?.targetColor || '#000'}; border: 2px solid #0ff; margin: 0 auto 8px;"></div>
                    <div style="font-size: 20px;">${recipe.inputs?.targetEmoji || '🎨'}</div>
                    <div style="font-size: 12px; color: #0ff;">${recipe.inputs?.targetFamily || 'Unknown'}</div>
                    <div style="font-size: 10px; color: #888;">TARGET</div>
                </div>
                <div style="flex: 1; text-align: center;">
                    <div style="width: 60px; height: 60px; border-radius: 10px; background: ${recipe.inputs?.background || '#fff'}; border: 2px solid #ff69b4; margin: 0 auto 8px;"></div>
                    <div style="font-size: 20px;">${recipe.inputs?.backgroundEmoji || '🎨'}</div>
                    <div style="font-size: 12px; color: #ff69b4;">${recipe.inputs?.backgroundFamily || 'Unknown'}</div>
                    <div style="font-size: 10px; color: #888;">BACKGROUND</div>
                </div>
            </div>
            
            <div style="background: #1a1a1a; border-radius: 12px; padding: 15px; margin-bottom: 20px;">
                <h4 style="color: #0ff; margin: 0 0 10px 0;">📊 Background Analysis</h4>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; text-align: center;">
                    <div>
                        <div style="font-size: 9px; color: #888;">Compatibility</div>
                        <div style="font-size: 12px; color: ${recipe.analysis?.backgroundAdjustment?.difficulty === 'VERY_EASY' ? '#39ff14' : (recipe.analysis?.backgroundAdjustment?.difficulty === 'EASY' ? '#0ff' : (recipe.analysis?.backgroundAdjustment?.difficulty === 'NORMAL' ? '#ffd700' : '#ff3131'))};">
                            ${recipe.analysis?.backgroundAdjustment?.difficulty || 'UNKNOWN'}
                        </div>
                    </div>
                    <div>
                        <div style="font-size: 9px; color: #888;">Adjustment Factor</div>
                        <div style="font-size: 14px; color: #ffd700;">${recipe.analysis?.backgroundAdjustment?.factor || '1.00'}x</div>
                    </div>
                    <div>
                        <div style="font-size: 9px; color: #888;">Final DOS</div>
                        <div style="font-size: 14px; color: #39ff14;">${recipe.analysis?.finalDOS || '0%'}</div>
                    </div>
                </div>
                <div style="margin-top: 10px; padding: 8px; background: #000; border-radius: 6px; font-size: 11px; color: #ffd700; text-align: center;">
                    ${recipe.analysis?.backgroundAdjustment?.message || 'Background analysis complete'}
                </div>
            </div>
            
            <div style="background: #1a1a1a; border-radius: 12px; padding: 15px; margin-bottom: 20px;">
                <h4 style="color: #0ff; margin: 0 0 10px 0;">📊 Weight Analysis with Wax Coverage</h4>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; text-align: center;">
                    <div>
                        <div style="font-size: 9px; color: #888;">Total</div>
                        <div style="font-size: 14px; color: #fff;">${recipe.inputs?.totalWeight || '0g'}</div>
                    </div>
                    <div>
                        <div style="font-size: 9px; color: #888;">Wax %</div>
                        <div style="font-size: 14px; color: #ffd700;">${recipe.inputs?.waxCoverage || '0%'}</div>
                    </div>
                    <div>
                        <div style="font-size: 9px; color: #888;">Wax-free</div>
                        <div style="font-size: 12px; color: #0ff;">${recipe.weightCalculation?.waxFreeArea || '0g'}</div>
                    </div>
                    <div>
                        <div style="font-size: 9px; color: #888;">Penetration</div>
                        <div style="font-size: 12px; color: #39ff14;">${recipe.weightCalculation?.penetrationArea || '0g'}</div>
                    </div>
                </div>
                <div style="margin-top: 10px; padding: 8px; background: #000; border-radius: 8px; text-align: center;">
                    <span style="color: #888;">Effective Weight:</span>
                    <span style="color: #39ff14; font-size: 18px; font-weight: bold; margin-left: 10px;">${recipe.inputs?.effectiveWeight || '0g'}</span>
                </div>
            </div>
            
            <h4 style="color: #ffd700; margin: 20px 0 10px 0;">🎯 Available Options (Background Adjusted)</h4>
            ${getOptionHTML(recipe.options?.single, "Single Dye", 'single')}
            ${getOptionHTML(recipe.options?.twoDye, "2-Dye Mix", 'twoDye')}
            ${getOptionHTML(recipe.options?.threeDye, "3-Dye Mix", 'threeDye')}
    `;
    
    // ==============================================
    // CHEMICALS & UTILITIES
    // ==============================================
    html += `
        <div style="background: #1a1a1a; border-radius: 12px; padding: 15px; margin-top: 20px;">
            <h4 style="color: #0ff; margin: 0 0 10px 0;">🧪 රසායනික ද්‍රව්‍ය හා උපයෝගිතා</h4>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                <div>
                    <div style="font-size: 9px; color: #888;">ජලය</div>
                    <div style="font-size: 12px; color: #0ff;">${recipe.chemicals?.water || '0 L'}</div>
                    <div style="font-size: 9px; color: #ff69b4;">රු. ${recipe.chemicals?.waterCost || '0'}</div>
                </div>
                <div>
                    <div style="font-size: 9px; color: #888;">ලුණු (Glauber's Salt)</div>
                    <div style="font-size: 12px; color: #39ff14;">${recipe.chemicals?.salt || '0 g'}</div>
                    <div style="font-size: 9px; color: #ff69b4;">රු. ${recipe.chemicals?.saltCost || '0'}</div>
                </div>
                <div>
                    <div style="font-size: 9px; color: #888;">සෝඩා අළු (Soda Ash)</div>
                    <div style="font-size: 12px; color: #ffd700;">${recipe.chemicals?.sodaAsh || '0 g'}</div>
                    <div style="font-size: 9px; color: #ff69b4;">රු. ${recipe.chemicals?.sodaAshCost || '0'}</div>
                </div>
                <div>
                    <div style="font-size: 9px; color: #888;">යුරියා (Urea)</div>
                    <div style="font-size: 12px; color: #ff69b4;">${recipe.chemicals?.urea || '0 g'}</div>
                    <div style="font-size: 9px; color: #ff69b4;">රු. ${recipe.chemicals?.ureaCost || '0'}</div>
                </div>
                <div>
                    <div style="font-size: 9px; color: #888;">විදුලිය</div>
                    <div style="font-size: 12px; color: #0ff;">${(parseFloat(recipe.inputs?.totalWeight) / 1000 * 0.5).toFixed(2)} kWh</div>
                    <div style="font-size: 9px; color: #ff69b4;">රු. ${recipe.chemicals?.electricityCost || '0'}</div>
                </div>
                <div>
                    <div style="font-size: 9px; color: #888;">ශ්‍රමය</div>
                    <div style="font-size: 12px; color: #0ff;">${(parseFloat(recipe.inputs?.totalWeight) / 1000).toFixed(2)} h</div>
                    <div style="font-size: 9px; color: #ff69b4;">රු. ${recipe.chemicals?.labourCost || '0'}</div>
                </div>
            </div>
            <div style="display: flex; gap: 20px; margin-top: 10px; padding-top: 10px; border-top: 1px solid #333;">
                <div><span style="color: #888;">උෂ්ණත්වය:</span> <span style="color: #ff3131;">${recipe.chemicals?.temperature || '60°C'}</span></div>
                <div><span style="color: #888;">කාලය:</span> <span style="color: #ff3131;">${recipe.chemicals?.time || '60 min'}</span></div>
                <div><span style="color: #888;">Liquor Ratio:</span> <span style="color: #0ff;">${recipe.chemicals?.liquorRatio || '20:1'}</span></div>
            </div>
        </div>
    `;
    
    // ==============================================
    // WAX COMPOSITION DISPLAY
    // ==============================================
    if (recipe.waxCalculation && recipe.waxCalculation.waxComponents.length > 0) {
        const wax = recipe.waxCalculation;
        const waxRows = wax.waxComponents.map(w => `
            <tr>
                <td style="padding: 4px 0; color: #ffd700;">${w.name}</td>
                <td style="padding: 4px 0; text-align: right; color: #fff;">${w.percentage}%</td>
                <td style="padding: 4px 0; text-align: right; color: #39ff14;">${w.grams}g</td>
                <td style="padding: 4px 0; text-align: right; color: #ff69b4;">රු. ${w.cost}</td>
            </tr>
        `).join('');
        
        html += `
            <div style="background: #1a1a1a; border-radius: 12px; padding: 15px; margin: 20px 0;">
                <h4 style="color: #ffd700; margin: 0 0 10px 0;">🕯️ ඉටි මිශ්‍රණය (Wax Composition)</h4>
                <div style="margin-bottom: 10px; background: #111; padding: 10px; border-radius: 8px;">
                    <div style="color: #ffd700; font-size: 11px;">${wax.compositionName}</div>
                    <div style="color: #aaa; font-size: 9px;">${wax.compositionDescription}</div>
                </div>
                <table style="width: 100%; font-size: 11px;">
                    <thead>
                        <tr>
                            <th style="text-align: left; color: #888;">ඉටි වර්ගය</th>
                            <th style="text-align: right; color: #888;">%</th>
                            <th style="text-align: right; color: #888;">ප්‍රමාණය (g)</th>
                            <th style="text-align: right; color: #888;">පිරිවැය</th>
                        </tr>
                    </thead>
                    <tbody>${waxRows}</tbody>
                </table>
                <div style="margin-top: 10px; display: flex; justify-content: space-between; background: #000; padding: 8px; border-radius: 6px;">
                    <span style="color: #888;">මුළු ඉටි ප්‍රමාණය:</span>
                    <span style="color: #39ff14; font-weight: bold;">${wax.totalWaxGrams} g</span>
                    <span style="color: #888;">මුළු ඉටි පිරිවැය:</span>
                    <span style="color: #ff69b4; font-weight: bold;">රු. ${wax.totalCost}</span>
                </div>
            </div>
        `;
    }
    
    // ==============================================
    // PROCESS STEPS (with Sinhala explanations)
    // ==============================================
    if (recipe.processSteps) {
        const ps = recipe.processSteps;
        
        // Source badge
        if (recipe.source) {
            const sourceColor = recipe.source === 'stock' ? '#39ff14' : '#ffd700';
            const sourceText = recipe.source === 'stock' ? '✅ ඔබගේ තොගයෙන්' : '🛒 මිලදී ගැනීමට අවශ්‍යයි';
            html += `
                <div style="margin: 15px 0; padding: 8px 12px; background: #111; border-left: 4px solid ${sourceColor}; border-radius: 8px;">
                    <span style="color: ${sourceColor}; font-size: 12px; font-weight: bold;">${sourceText}</span>
                </div>
            `;
        }
        
        const stockRows = ps.stockList.map(item => `
            <tr>
                <td style="padding: 4px 0; color: #0ff;">${item.name}</td>
                <td style="padding: 4px 0; text-align: right; color: #fff;">${item.grams}g</td>
                <td style="padding: 4px 0; text-align: right; color: #39ff14;">${item.stockMl} ml</td>
            </tr>
        `).join('');
        
        html += `
            <div style="background: #1a1a1a; border-radius: 12px; padding: 15px; margin: 20px 0;">
                <h4 style="color: #ffd700; margin: 0 0 10px 0;">📋 ඩයි කිරීමේ පියවර</h4>
                
                <div style="margin-bottom: 15px; background: #111; padding: 10px; border-radius: 8px;">
                    <div style="font-size: 11px; color: #ffd700; margin-bottom: 5px;">🧪 1% Stock Solution (10g/L) සකස් කිරීම</div>
                    <table style="width: 100%; font-size: 11px;">
                        <thead><tr><th style="text-align: left; color: #888;">ඩයි</th><th style="text-align: right; color: #888;">කුඩු (g)</th><th style="text-align: right; color: #888;">Stock (ml)</th></tr></thead>
                        <tbody>${stockRows}</tbody>
                    </table>
                    <div style="margin-top: 5px; font-size: 10px; color: #aaa; text-align: right;">මුළු stock ප්‍රමාණය: <span style="color: #39ff14;">${ps.totalStockMl} ml</span></div>
                </div>
                
                <div style="background: #111; padding: 10px; border-radius: 8px; margin-bottom: 10px;">
                    <div style="font-size: 11px; color: #ffd700; margin-bottom: 5px;">💧 ජල ගණනය (Liquor Ratio 1:${ps.liquorRatio})</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 11px;">
                        <div><span style="color: #888;">මුළු ජලය:</span> <span style="color: #0ff;">${ps.totalWaterMl} ml</span></div>
                        <div><span style="color: #888;">Stock සඳහා ගිය ජලය:</span> <span style="color: #ff8888;">${ps.totalStockMl} ml</span></div>
                        <div><span style="color: #888;">ඉතිරි ජලය:</span> <span style="color: #fff;">${ps.remainingWaterMl} ml</span></div>
                        <div></div>
                    </div>
                </div>
                
                <div style="background: #111; padding: 10px; border-radius: 8px; margin-bottom: 10px;">
                    <div style="font-size: 11px; color: #ffd700; margin-bottom: 5px;">🌡️ උෂ්ණත්වය ${ps.targetTemp}°C ට ගැනීම</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 11px;">
                        <div><span style="color: #888;">උණු වතුර (100°C):</span> <span style="color: #ff3131;">${ps.hotWaterMl} ml</span></div>
                        <div><span style="color: #888;">සීතල වතුර (25°C):</span> <span style="color: #0ff;">${ps.coldWaterMl} ml</span></div>
                    </div>
                </div>
                
                <div style="background: #111; padding: 10px; border-radius: 8px; margin-bottom: 10px;">
                    <div style="font-size: 11px; color: #ffd700; margin-bottom: 5px;">⏳ ඩයි කිරීමේ පියවර</div>
                    <ol style="margin: 0; padding-left: 20px; font-size: 10px; color: #ccc; line-height: 1.8;">
                        <li>බඳුනට <strong>උණු වතුර ${ps.hotWaterMl} ml</strong> සහ <strong>සීතල වතුර ${ps.coldWaterMl} ml</strong> දමා ${ps.targetTemp}°C ට ගන්න.</li>
                        <li><strong>Urea ${ps.urea}g</strong> එකතු කර කලවම් කරන්න.</li>
                        <li>Softening agent (අවශ්‍ය නම්) එකතු කරන්න.</li>
                        <li>රෙද්ද බඳුනට දමා විනාඩි 5ක් පොඟවා ගන්න.</li>
                        <li>Stock solutions එකතු කරන්න: ${ps.stockList.map(s => `${s.stockMl} ml ${s.name}`).join(', ')}.</li>
                        <li>විනාඩි 15ක් රෙද්ද ඩයි වල තබා ගන්න.</li>
                        <li><strong>Glauber's Salt ${ps.salt}g</strong> වෙනම උණු වතුරේ දියකර බඳුනේ බිත්තිය දිගේ එකතු කරන්න.</li>
                        <li>තවත් විනාඩි 15ක් තබා ගන්න.</li>
                        <li><strong>Soda Ash ${ps.sodaAsh}g</strong> වෙනම උණු වතුරේ දියකර බඳුනේ බිත්තිය දිගේ එකතු කරන්න.</li>
                        <li>විනාඩි 10ක් තබා ගන්න.</li>
                        <li>Fixation period: <strong>${ps.time}</strong> තෙක් බඳුනේම තබා ගන්න.</li>
                        <li>රෙද්ද ඉවතට ගෙන සීතල වතුරෙන් හොඳට සෝදන්න.</li>
                        <li>Soaping: උණු වතුරට soaping agent එකතු කර රෙද්ද විනාඩි 10-15ක් තම්බන්න (හෝ රත් කරන්න).</li>
                        <li>යලිත් සීතල වතුරෙන් සෝදා වියළා ගන්න.</li>
                        <li>මද තෙතමනයක් ඇති විට අයන් කරන්න.</li>
                    </ol>
                </div>
                
                <div style="background: #000; padding: 8px; border-radius: 6px; font-size: 9px; color: #888; text-align: center;">
                    ⚠️ සටහන: 1% stock solution (10g/L) සඳහා අවශ්‍ය ඩයි ග්‍රෑම් × 100 = stock මිලිලීටර්.
                </div>
            </div>
        `;
    }
    
    // ==============================================
    // PURCHASE OPTIONS
    // ==============================================
    if (recipe.purchaseOptions && recipe.purchaseOptions.options && recipe.purchaseOptions.options.length > 0) {
        html += `
            <div style="background: #1a1a1a; border-radius: 12px; padding: 15px; margin-top: 20px;">
                <h4 style="color: #ffd700; margin: 0 0 10px 0;">
                    🛒 ගන්න ඕන ඩයි වර්ග
                </h4>
                
                ${recipe.purchaseOptions.simpleMsg ? `
                    <div style="margin-bottom: 15px; padding: 12px; background: #111; border-radius: 8px; border-left: 4px solid ${recipe.analysis?.backgroundAdjustment?.difficulty === 'VERY_HARD' ? '#ff3131' : (recipe.analysis?.backgroundAdjustment?.difficulty === 'HARD' ? '#ff9900' : '#ffd700')};">
                        <div style="display: flex; align-items: flex-start; gap: 10px;">
                            <span style="font-size: 20px;">💡</span>
                            <div style="color: #ffd700; font-size: 12px; line-height: 1.5;">${recipe.purchaseOptions.simpleMsg}</div>
                        </div>
                    </div>
                ` : ''}
                
                ${recipe.purchaseOptions.options.map((opt, index) => {
                    const needsPurchase = opt.purchaseNeeded && opt.purchaseNeeded.length > 0;
                    const bgColor = needsPurchase ? '#1a1a00' : (opt.inStock ? '#111' : '#1a1a1a');
                    const borderColor = needsPurchase ? '#ffd700' : (opt.inStock ? '#39ff14' : '#333');
                    
                    const isBestPurchase = (index === 0);
                    
                    const bestPurchaseStyle = isBestPurchase ? `
                        animation: goldenBlink 1.5s infinite;
                        border: 3px solid #ffd700;
                        box-shadow: 0 0 20px #ffd700;
                        position: relative;
                        background: linear-gradient(145deg, #1a1a00, #111);
                    ` : '';
                    
                    const bestPurchaseBadge = isBestPurchase ? `
                        <div style="position: absolute; top: -10px; right: -10px; background: #ffd700; color: #000; 
                                    padding: 5px 10px; border-radius: 20px; font-size: 10px; font-weight: bold;
                                    box-shadow: 0 0 15px #ffd700; z-index: 10;">
                            ⭐ හොඳම විකල්පය ⭐
                        </div>
                    ` : '';
                    
                    return `
                        <div style="position: relative; display: flex; align-items: center; gap: 8px; padding: 10px; 
                                    background: ${bgColor}; border-radius: 8px; margin-bottom: 8px; 
                                    border-left: 4px solid ${borderColor}; ${bestPurchaseStyle}">
                            ${bestPurchaseBadge}
                            <span style="font-size: 18px;">${opt.medal || '🛒'}</span>
                            <div style="flex: 1;">
                                <div style="display: flex; align-items: center; gap: 5px; flex-wrap: wrap;">
                                    <span style="color: #ffd700; font-size: 11px; font-weight: bold;">${opt.type || ''}</span>
                                    <span style="color: #fff; font-size: 11px;">${opt.name || ''}</span>
                                    ${opt.percentages ? `
                                        <span style="color: #888; font-size: 9px;">(${opt.percentages.map(p => p + '%').join(' + ')})</span>
                                    ` : ''}
                                </div>
                                <div style="display: flex; align-items: center; gap: 10px; margin-top: 3px;">
                                    <span style="font-size: 10px; color: ${opt.classification?.emoji === '✅' ? '#39ff14' : (opt.classification?.emoji === '👍' ? '#0ff' : (opt.classification?.emoji === '⚠️' ? '#ffd700' : '#ff9900'))};">
                                        ${opt.classification?.emoji || '❓'} ${opt.classification?.text || 'UNKNOWN'} (ΔE: ${(opt.deltaE || 0).toFixed(2)})
                                        ${isBestPurchase ? ' 👑' : ''}
                                    </span>
                                </div>
                                
                                ${opt.simpleExplanation ? `
                                    <div style="margin-top: 5px; padding: 4px 8px; background: #000; border-radius: 4px; font-size: 10px; color: ${opt.simpleExplanation.includes('✅') ? '#39ff14' : (opt.simpleExplanation.includes('👍') ? '#0ff' : (opt.simpleExplanation.includes('🟡') ? '#ffd700' : (opt.simpleExplanation.includes('⚠️') ? '#ff9900' : '#ff8888')))};">
                                        ${opt.simpleExplanation}
                                    </div>
                                ` : ''}
                                
                                ${opt.note ? `
                                    <div style="margin-top: 4px; padding: 4px 8px; background: #111; border-radius: 4px; font-size: 9px; color: #aaa;">
                                        ${opt.note}
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
    
    // ==============================================
    // TOTAL COST SUMMARY
    // ==============================================
    const totalDyesCost = parseFloat(recipe.dyesTotalCost || 0);
    const totalChemicalsCost = parseFloat(recipe.chemicalsCost || 0);
    const totalWaxCost = parseFloat(recipe.waxCost || 0);
    const grandTotal = totalDyesCost + totalChemicalsCost + totalWaxCost;
    
    html += `
        <div style="background: linear-gradient(145deg, #1a1a1a, #111); border-radius: 12px; padding: 15px; margin: 20px 0; border: 2px solid #ffd700;">
            <h4 style="color: #ffd700; margin: 0 0 10px 0;">💰 සම්පූර්ණ පිරිවැය (Total Cost)</h4>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div style="background: #000; padding: 10px; border-radius: 8px;">
                    <div style="color: #888; font-size: 10px;">ඩයි පිරිවැය</div>
                    <div style="color: #0ff; font-size: 16px; font-weight: bold;">රු. ${totalDyesCost.toFixed(2)}</div>
                </div>
                <div style="background: #000; padding: 10px; border-radius: 8px;">
                    <div style="color: #888; font-size: 10px;">රසායනික හා උපයෝගිතා</div>
                    <div style="color: #39ff14; font-size: 16px; font-weight: bold;">රු. ${totalChemicalsCost.toFixed(2)}</div>
                </div>
                <div style="background: #000; padding: 10px; border-radius: 8px;">
                    <div style="color: #888; font-size: 10px;">ඉටි පිරිවැය</div>
                    <div style="color: #ffd700; font-size: 16px; font-weight: bold;">රු. ${totalWaxCost.toFixed(2)}</div>
                </div>
                <div style="background: #000; padding: 10px; border-radius: 8px; border: 2px solid #ffd700;">
                    <div style="color: #888; font-size: 10px;">මුළු පිරිවැය</div>
                    <div style="color: #fff; font-size: 18px; font-weight: bold;">රු. ${grandTotal.toFixed(2)}</div>
                </div>
            </div>
        </div>
    `;
    
    html += `
            <div style="margin-top: 20px; padding: 12px; background: #1a1a1a; border-radius: 8px; text-align: center; border-left: 4px solid ${recipe.message?.includes('✅') ? '#39ff14' : (recipe.message?.includes('⚠️') ? '#ffd700' : '#ff3131')};">
                <span style="color: ${recipe.message?.includes('✅') ? '#39ff14' : (recipe.message?.includes('⚠️') ? '#ffd700' : '#ff8888')}; font-size: 12px;">
                    ${recipe.message || 'Recipe generated with background adaptation'}
                </span>
            </div>
            
            <div style="margin-top: 10px; text-align: right; font-size: 9px; color: #444;">
                ThirdVisionPlus Engineering | HSOP v3.0.6 | With Wax Compositions & Full Costing
            </div>
        </div>
    `;
    
    return html;
}

// ==============================================
// 38. TEST FUNCTION
// ==============================================

function generateTestHSOP() {
    console.log("🧪 Testing HSOP Calculator - Full Background Integration Version");
    return {
        success: true,
        message: "HSOP Calculator loaded successfully with full background adaptation",
        version: "3.0.6",
        features: [
            "Background Compatibility Matrix",
            "HSV-based Color Detection",
            "Delta E Calculation",
            "Wax Coverage Analysis",
            "DOS Calculation with Background Factor",
            "2-Dye and 3-Dye Mix Generation",
            "Purchase Recommendations",
            "HTML Formatting",
            "Simple Sinhala Explanations",
            "Stock Priority Selection",
            "Process Steps with 1% Stock Solution",
            "Wax Compositions (Omini Wax Technology)",
            "Full Costing (Dyes, Chemicals, Utilities, Wax)"
        ],
        functions: [
            "rgbToHsv", "hsvToRgb", "rgbToLab", "calculateDeltaE",
            "detectColorFamily", "getDyeColorFamily",
            "checkBackgroundCompatibility", "calculateBackgroundInfluence",
            "calculateBackgroundAdjustment", "applyBackgroundAdjustmentToDeltaE",
            "calculateEffectiveWeight", "calculateBaseDOS",
            "findBestDyeMatchesWithBackground", "generateRecipeFromDatabase",
            "formatDatabaseRecipeHTML", "generateTestHSOP"
        ]
    };
}

// ==============================================
// 39. SINGLE EXPORT STATEMENT - ONLY HERE!
// ==============================================

export {
    rgbToHsv,
    hsvToRgb,
    rgbToLab,
    calculateDeltaE,
    detectColorFamily,
    getDyeColorFamily,
    checkBackgroundCompatibility,
    calculateBackgroundInfluence,
    calculateBackgroundAdjustment,
    applyBackgroundAdjustmentToDeltaE,
    calculateEffectiveWeight,
    calculateBaseDOS,
    findBestDyeMatchesWithBackground,
    generateRecipeFromDatabase,
    formatDatabaseRecipeHTML,
    generateTestHSOP
};

// ==============================================
// INITIALIZATION
// ==============================================

console.log("✅ HSOP Calculator v3.0.6 (WITH WAX COMPOSITIONS & FULL COSTING) loaded");
console.log("📊 Background Compatibility Matrix initialized");
console.log("🎨 Ready for background-adaptive dye recipes");
console.log("📋 Process steps with 1% stock solution calculation included");
console.log("🕯️ Omini Wax compositions available");

// ==============================================
// END OF FILE - ABSOLUTELY NO DUPLICATES!
// ==============================================