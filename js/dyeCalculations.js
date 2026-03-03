/**
 * ======================================================
 * PROJECT: ULTRA-INTELLIGENT DYE CALCULATOR (PRO)
 * FILE: dyeCalculations.js
 * ======================================================
 */

// 1. DYE GROUP COMPATIBILITY RULES
export const DYE_RULES = {
    'HE': { temp: 80, compatible: ['HE', 'ME'], incompatible: ['VS'] },
    'VS': { temp: 60, compatible: ['VS', 'ME'], incompatible: ['HE'] },
    'ME': { temp: 60, compatible: ['VS', 'ME', 'HE'], incompatible: [] }
};

/**
 * 2. RGB TO CMYK CONVERSION (Subtractive Color Logic)
 * ඩිජිටල් වර්ණය සායම් වර්ණ පද්ධතියට හරවයි.
 */
export function rgbToCmyk(r, g, b) {
    let c = 1 - (r / 255);
    let m = 1 - (g / 255);
    let y = 1 - (b / 255);
    let k = Math.min(c, m, y);

    if (k < 1) {
        c = (c - k) / (1 - k);
        m = (m - k) / (1 - k);
        y = (y - k) / (1 - k);
    } else {
        c = 0; m = 0; y = 0;
    }

    return {
        c: Math.round(c * 100),
        m: Math.round(m * 100),
        y: Math.round(y * 100),
        k: Math.round(k * 100)
    };
}

/**
 * 3. SCIENTIFIC DOS CORRECTION (Kubelka-Munk Theory)
 * වර්ණයේ තද බව (Brightness) අනුව DOS එක ස්වයංක්‍රීයව Adjust කරයි.
 */
function applyScientificCorrection(baseDOS, targetRGB) {
    const brightness = (0.299 * targetRGB.r + 0.587 * targetRGB.g + 0.114 * targetRGB.b) / 255;
    let correctedDOS = baseDOS;

    if (brightness < 0.15) correctedDOS *= 1.30; // Very Dark (30% increase)
    else if (brightness < 0.4) correctedDOS *= 1.15; // Medium Dark (15% increase)
    
    return Math.min(12, Math.max(0.1, correctedDOS));
}

/**
 * 4. 121 MATRIX & RECIPE GENERATOR
 * ප්‍රධාන Function එක - මෙය UI එකෙන් කැඳවිය යුතුය.
 */
export function generateMasterRecipe(targetRGB, bgRGB, fabricType, dyeStock) {
    // CMYK අගයන් ලබා ගැනීම
    const targetCmyk = rgbToCmyk(targetRGB.r, targetRGB.g, targetRGB.b);
    const bgCmyk = rgbToCmyk(bgRGB.r, bgRGB.g, bgRGB.b);

    // 121 Matrix Difference Calculation
    // පසුබිම් වර්ණයට වඩා අවශ්‍ය අතිරේක සායම් ප්‍රමාණය බලයි
    const diff = {
        C: Math.max(0, targetCmyk.c - bgCmyk.c),
        M: Math.max(0, targetCmyk.m - bgCmyk.m),
        Y: Math.max(0, targetCmyk.y - bgCmyk.y),
        K: Math.max(0, targetCmyk.k - bgCmyk.k)
    };

    // මූලික DOS එක ගණනය කිරීම (මෙහිදී රෙදි වර්ගය බලපායි)
    let baseDOS = (diff.C + diff.M + diff.Y + diff.K) / 40; // මූලික අනුපාතය
    if (fabricType === 'Heavy-Cotton') baseDOS *= 1.2;
    
    const finalTotalDOS = applyScientificCorrection(baseDOS, targetRGB);

    let recipeSteps = [];
    let activeGroups = [];

    // වර්ණ හතර (CMYK) සඳහා Stock එකෙන් Dyes තෝරා ගැනීම
    const channels = [
        { key: 'C', name: 'CYAN/BLUE', val: diff.C },
        { key: 'M', name: 'MAGENTA/RED', val: diff.M },
        { key: 'Y', name: 'YELLOW', val: diff.Y },
        { key: 'K', name: 'BLACK', val: diff.K }
    ];

    for (let channel of channels) {
        if (channel.val > 2) { // 2% කට වඩා බලපෑමක් තිබේ නම් පමණක්
            // Stock එකේ ඇති එම වර්ණයට අදාළ dyes සොයා ගැනීම
            let availableDyes = dyeStock.filter(d => d.colorFamily === channel.name && d.inStock);

            // Compatibility Check (Conflict ඇති ඒවා ඉවත් කිරීම)
            if (activeGroups.length > 0) {
                availableDyes = availableDyes.filter(d => 
                    activeGroups.every(g => !DYE_RULES[g].incompatible.includes(d.group))
                );
            }

            if (availableDyes.length > 0) {
                const selectedDye = availableDyes[0]; // පද්ධතිය හොඳම එක තෝරයි
                activeGroups.push(selectedDye.group);

                // සායම් ප්‍රමාණය ගණනය කිරීම (Weight based)
                const componentDOS = (finalTotalDOS * (channel.val / 100));
                recipeSteps.push({
                    dyeName: selectedDye.name,
                    dyeGroup: selectedDye.group,
                    dos: componentDOS.toFixed(3),
                    gramsPerKg: (componentDOS * 10).toFixed(2)
                });
            }
        }
    }

    return {
        recipe: recipeSteps,
        totalDOS: finalTotalDOS.toFixed(2),
        suggestedTemp: activeGroups.length > 0 ? Math.max(...activeGroups.map(g => DYE_RULES[g].temp)) : 60,
        status: recipeSteps.length > 0 ? "SUCCESS" : "NO_MATCH_FOUND"
    };
}