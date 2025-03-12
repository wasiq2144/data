function generateTable() {
    const input = document.getElementById("numbers").value;
    const numbers = input.split(",").map(num => parseFloat(num.trim())).filter(num => !isNaN(num));

    if (numbers.length === 0) {
        alert("Please enter valid numbers.");
        return;
    }

    // Compute Sum, Mean & Median
    const sumXi = numbers.reduce((sum, num) => sum + num, 0);
    const mean = sumXi / numbers.length;
    const sortedNumbers = [...numbers].sort((a, b) => a - b);
    const median = sortedNumbers.length % 2 === 0
        ? (sortedNumbers[sortedNumbers.length / 2 - 1] + sortedNumbers[sortedNumbers.length / 2]) / 2
        : sortedNumbers[Math.floor(sortedNumbers.length / 2)];

    // Compute table values
    let sumAbsDev = 0, sumSqDev = 0, sumAbsMedDev = 0;
    let moment3Sum = 0, moment4Sum = 0;

    const tbody = document.getElementById("statsTable");
    tbody.innerHTML = ""; // Clear existing table rows

    numbers.forEach(num => {
        const absDev = Math.abs(num - mean);
        const sqDev = absDev ** 2;
        const absMedDev = Math.abs(num - median);

        sumAbsDev += absDev;
        sumSqDev += sqDev;
        sumAbsMedDev += absMedDev;

        moment3Sum += (num - mean) ** 3;
        moment4Sum += (num - mean) ** 4;

        const row = `<tr>
            <td>${num}</td>
            <td>${absDev.toFixed(2)}</td>
            <td>${sqDev.toFixed(2)}</td>
            <td>${absMedDev.toFixed(2)}</td>
        </tr>`;
        tbody.innerHTML += row;
    });

    // Update table footers
    document.getElementById("sum_xi").innerText = sumXi.toFixed(2);
    document.getElementById("sum_abs_dev").innerText = sumAbsDev.toFixed(2);
    document.getElementById("sum_sq_dev").innerText = sumSqDev.toFixed(2);
    document.getElementById("sum_abs_med_dev").innerText = sumAbsMedDev.toFixed(2);

    // Compute Moments
    const variance = sumSqDev / numbers.length;
    let skewness = 0, kurtosis = 0;

    if (variance > 0) {  // Prevent division by zero
        skewness = (moment3Sum / numbers.length) / Math.pow(variance, 1.5);
        kurtosis = (moment4Sum / numbers.length) / Math.pow(variance, 2);
    }

    // Update moments
    document.getElementById("moment1").innerText = mean.toFixed(2);
    document.getElementById("moment2").innerText = variance.toFixed(2);
    document.getElementById("moment3").innerText = skewness.toFixed(2);
    document.getElementById("moment4").innerText = kurtosis.toFixed(2);
}
62,72,66,79,83,61,62,85,72,64,74,71,42,38,91,66,77,90,74,63,64,68,42