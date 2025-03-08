from flask import Flask, request, jsonify
import numpy as np
import math
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def calculate_statistics(data):
    data = sorted([int(x) for x in data])
    
    # Frequency Distribution
    min_val, max_val = min(data), max(data)
    class_interval = 5  # Change this for different intervals
    bins = list(range(min_val, max_val + class_interval, class_interval))
    
    frequency, _ = np.histogram(data, bins)
    midpoints = [(bins[i] + bins[i+1]) / 2 for i in range(len(bins)-1)]
    
    f_x = [f * x for f, x in zip(frequency, midpoints)]
    cum_freq = np.cumsum(frequency)
    f_log_x = [f * math.log(x) if x > 0 else 0 for f, x in zip(frequency, midpoints)]
    f_div_x = [f / x if x > 0 else 0 for f, x in zip(frequency, midpoints)]
    
    # Frequency Table
    frequency_table = [
        {"CI": f"{bins[i]}-{bins[i+1]}", "Freq": frequency[i], "Midpoint": midpoints[i],
         "fx": f_x[i], "CF": cum_freq[i], "fLogX": f_log_x[i], "fDivX": f_div_x[i]}
        for i in range(len(frequency))
    ]
    
    # Summations
    sum_f = sum(frequency)
    sum_fx = sum(f_x)
    sum_f_log_x = sum(f_log_x)
    sum_f_div_x = sum(f_div_x)
    
    # Measures of Central Tendency
    mean = sum_fx / sum_f if sum_f else 0
    median = np.median(data)
    Q1, Q3 = np.percentile(data, [25, 75])
    mode = max(set(data), key=data.count)  # Simplified mode calculation
    
    # Other Statistics
    D8 = np.percentile(data, 80)
    P71 = np.percentile(data, 71)
    
    return {
        "frequency_table": frequency_table,
        "sum_f": sum_f,
        "sum_fx": sum_fx,
        "sum_f_log_x": sum_f_log_x,
        "sum_f_div_x": sum_f_div_x,
        "mean": round(mean, 2),
        "median": median,
        "Q1": Q1,
        "Q3": Q3,
        "mode": mode,
        "D8": D8,
        "P71": P71
    }

@app.route("/generate-table", methods=["POST"])
def generate_table():
    data = request.json.get("data")
    if not data:
        return jsonify({"error": "No data provided"}), 400

    data = data.split(",")
    result = calculate_statistics(data)
    
    # Allowing frontend access
    response = jsonify(result)
    response.headers.add("Access-Control-Allow-Origin", "*")  # Allows all domains
    response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    
    return response

if __name__ == "__main__":
    app.run(debug=True)