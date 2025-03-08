function generateTable() {
    let numbers = document.getElementById("numbersInput").value;
    if (!numbers) {
        alert("Please enter numbers separated by commas.");
        return;
    }

    fetch("https://wasiq2144.pythonanywhere.com/generatetable", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ data: numbers })
    })
    .then(response => response.json())
    .then(data => {
        let tableBody = document.querySelector("#freqTable tbody");
        tableBody.innerHTML = ""; // Clear previous data

        data.frequency_table.forEach(row => {
            let tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${row["CI"]}</td>
                <td>${row["Lower CB"]}</td>
                <td>${row["Upper CB"]}</td>
                <td>${row["Midpoint"]}</td>
                <td>${row["Freq"]}</td>
                <td>${row["fx"]}</td>
                <td>${row["CF"]}</td>
                <td>${row["fLogX"].toFixed(2)}</td>
                <td>${row["fDivX"].toFixed(4)}</td>
            `;
            tableBody.appendChild(tr);
        });

        // Display statistical measures
        document.getElementById("sumF").textContent = data.sum_f;
        document.getElementById("sumFText").textContent = data.sum_f;
        document.getElementById("sumFX").textContent = data.sum_fx;
        document.getElementById("sumFLogX").textContent = data.sum_f_log_x.toFixed(2);
        document.getElementById("sumFDivX").textContent = data.sum_f_div_x.toFixed(4);
        document.getElementById("mean").textContent = data.mean;
        document.getElementById("median").textContent = data.median;
        document.getElementById("q1").textContent = data.Q1;
        document.getElementById("q3").textContent = data.Q3;
        document.getElementById("mode").textContent = data.mode;
        document.getElementById("d8").textContent = data.D8;
        document.getElementById("p71").textContent = data.P71;
    })
    .catch(error => console.error("Error fetching data:", error));
}