function generateTable() {
    const input = document.getElementById("numbers").value;
    const numbers = input.split(",").map(num => parseFloat(num.trim())).filter(num => !isNaN(num));

    if (numbers.length === 0) {
        alert("Please enter valid numbers.");
        return;
    }

    // Compute Mean & Median
    const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    const sortedNumbers = [...numbers].sort((a, b) => a - b);
    const median = sortedNumbers.length % 2 === 0
        ? (sortedNumbers[sortedNumbers.length / 2 - 1] + sortedNumbers[sortedNumbers.length / 2]) / 2
        : sortedNumbers[Math.floor(sortedNumbers.length / 2)];

    // Initialize sums
    let sumX2 = 0, sumX3 = 0, sumX4 = 0;
    let sumAbsDev = 0, sumSqDev = 0, sumAbsMedDev = 0;
    let moment3Sum = 0, moment4Sum = 0;

    const tbody = document.getElementById("statsTable");
    tbody.innerHTML = "";

    numbers.forEach(num => {
        const x2 = num ** 2;
        const x3 = num ** 3;
        const x4 = num ** 4;
        const absDev = Math.abs(num - mean);
        const sqDev = absDev ** 2;
        const absMedDev = Math.abs(num - median);

        sumX2 += x2;
        sumX3 += x3;
        sumX4 += x4;
        sumAbsDev += absDev;
        sumSqDev += sqDev;
        sumAbsMedDev += absMedDev;

        moment3Sum += (num - mean) ** 3;
        moment4Sum += (num - mean) ** 4;

        const row = `<tr>
            <td>${num}</td>
            <td>${x2}</td>
            <td>${x3}</td>
            <td>${x4}</td>
            <td>${absDev.toFixed(2)}</td>
            <td>${sqDev.toFixed(2)}</td>
            <td>${absMedDev.toFixed(2)}</td>
        </tr>`;
        tbody.innerHTML += row;
    });

    // Update table footers
    document.getElementById("sum_x2").innerText = sumX2.toFixed(2);
    document.getElementById("sum_x3").innerText = sumX3.toFixed(2);
    document.getElementById("sum_x4").innerText = sumX4.toFixed(2);
    document.getElementById("sum_abs_dev").innerText = sumAbsDev.toFixed(2);
    document.getElementById("sum_sq_dev").innerText = sumSqDev.toFixed(2);
    document.getElementById("sum_abs_med_dev").innerText = sumAbsMedDev.toFixed(2);

    // Compute Moments
    const variance = sumSqDev / numbers.length;
    const skewness = moment3Sum / numbers.length / Math.pow(variance, 1.5);
    const kurtosis = moment4Sum / numbers.length / Math.pow(variance, 2);

    // Update moments
    document.getElementById("moment1").innerText = mean.toFixed(2);
    document.getElementById("moment2").innerText = variance.toFixed(2);
    document.getElementById("moment3").innerText = skewness.toFixed(2);
    document.getElementById("moment4").innerText = kurtosis.toFixed(2);
}
