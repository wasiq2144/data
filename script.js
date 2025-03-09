function generateTable() {
    const input = document.getElementById("numbers").value;
    const numbers = input.split(",").map(num => parseInt(num.trim())).filter(num => !isNaN(num));
    
    if (numbers.length === 0) return;
    
    const min = Math.min(...numbers);
    const max = Math.max(...numbers);
    const classWidth = 6;
    let classIntervals = [];
    
    for (let i = min; i <= max; i += classWidth) {
        let lowerCB = i - 0.5;
        let upperCB = i + classWidth - 1 + 0.5;
        let midpoint = (i + (i + classWidth - 1)) / 2; 
        
        classIntervals.push({
            lower: i,
            upper: i + classWidth - 1,
            lowerCB,
            upperCB,
            midpoint,
            frequency: 0
        });
    }
    
    numbers.forEach(num => {
        for (let ci of classIntervals) {
            if (num >= ci.lower && num <= ci.upper) {
                ci.frequency++;
                break;
            }
        }
    });
    
    let cumulativeFrequency = 0;
    let sumF = 0, sumFX = 0, sumFLogX = 0, sumFDivX = 0;
    let cumulativeFrequencies = [];
    const tbody = document.querySelector("#frequencyTable tbody");
    tbody.innerHTML = "";
    
    classIntervals.forEach(ci => {
        cumulativeFrequency += ci.frequency;
        cumulativeFrequencies.push({ ...ci, cumulativeFrequency });
        
        let fx = ci.frequency * ci.midpoint;
        let flogx = ci.frequency * Math.log10(ci.midpoint || 1);
        let fdivx = ci.frequency / (ci.midpoint || 1);
        
        sumF += ci.frequency;
        sumFX += fx;
        sumFLogX += flogx;
        sumFDivX += fdivx;
        
        const row = `<tr>
            <td>${ci.lower} - ${ci.upper}</td>
            <td>${ci.lowerCB.toFixed(1)} - ${ci.upperCB.toFixed(1)}</td>
            <td>${ci.midpoint.toFixed(2)}</td>
            <td>${ci.frequency}</td>
            <td>${fx.toFixed(2)}</td>
            <td>${cumulativeFrequency}</td>
            <td>${flogx.toFixed(2)}</td>
            <td>${fdivx.toFixed(2)}</td>
        </tr>`;
        tbody.innerHTML += row;
    });

    document.getElementById("sum_f").textContent = sumF;
    document.getElementById("sum_fx").textContent = sumFX.toFixed(2);
    document.getElementById("sum_flogx").textContent = sumFLogX.toFixed(2);
    document.getElementById("sum_fdivx").textContent = sumFDivX.toFixed(2);
    
    document.getElementById("am").textContent = (sumFX / sumF).toFixed(2);
    document.getElementById("gm").textContent = (Math.pow(10, sumFLogX / sumF)).toFixed(2);
    document.getElementById("hm").textContent = (sumF / sumFDivX).toFixed(2);

    // Calculate Median
    const median = calculateMedian(cumulativeFrequencies, sumF);
    document.getElementById("median").textContent = median.toFixed(2);

    // Calculate Mode
    const mode = calculateMode(classIntervals);
    document.getElementById("mode").textContent = mode.toFixed(2);
}

// Function to Calculate Median
function calculateMedian(cumulativeFrequencies, sumF) {
    const medianPosition = sumF / 2;
    let medianClass = cumulativeFrequencies.find(ci => ci.cumulativeFrequency >= medianPosition);

    let L = medianClass.lower - 0.5;
    let F = cumulativeFrequencies.find(ci => ci.upper === medianClass.lower - 1)?.cumulativeFrequency || 0;
    let f = medianClass.frequency;
    let h = 6; // Class width

    return L + ((medianPosition - F) / f) * h;
}

// Function to Calculate Mode
function calculateMode(classIntervals) {
    let modalClass = classIntervals.reduce((max, ci) => (ci.frequency > max.frequency ? ci : max), classIntervals[0]);

    let L = modalClass.lower - 0.5;
    let f1 = modalClass.frequency;
    let f0 = classIntervals.find(ci => ci.upper === modalClass.lower - 1)?.frequency || 0;
    let f2 = classIntervals.find(ci => ci.lower === modalClass.upper + 1)?.frequency || 0;
    let h = 6; // Class width

    return L + ((f1 - f0) / ((2 * f1) - f0 - f2)) * h;
}
