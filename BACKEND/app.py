from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from pymongo import MongoClient
import io

app = Flask(__name__)
CORS(app)

# ================== MONGODB ==================
client = MongoClient(
    "mongodb+srv://prajwal:Praju%402006@sfas.hd7dxqp.mongodb.net/sfas?retryWrites=true&w=majority"
)
db = client["sfas"]

# ================== HOME ==================
@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "Backend working"})

# ================== ADVISORY ==================
from ml_model import predict_yield

@app.route("/api/advisory", methods=["POST"])
def advisory():
    data = request.get_json(force=True)

    crop = data.get("crop")
    soil = data.get("soil")
    season = data.get("season")
    location = data.get("location")

    ml_yield = predict_yield(crop, soil, season, location)

    advisory_data = {
        "crop": crop,
        "soil": soil,
        "season": season,
        "location": location,
        "recommendation": f"Grow {crop} with proper irrigation",
        "ml_prediction": {
            "expected_yield": ml_yield,
            "unit": "quintal/acre"
        }
    }

    db.advisories.insert_one(advisory_data)
    advisory_data.pop("_id", None)

    return jsonify(advisory_data)

# ================== ANALYTICS ==================
@app.route("/api/analytics")
def analytics():
    pipeline = [
        {
            "$group": {
                "_id": "$crop",
                "avgYield": { "$avg": "$ml_prediction.expected_yield" }
            }
        }
    ]

    data = list(db.advisories.aggregate(pipeline))

    return jsonify([
        { "crop": d["_id"], "avgYield": round(d["avgYield"], 2) }
        for d in data
    ])


# ================== WEATHER ==================
# ================== WEATHER ==================
import requests
import os

@app.route("/api/weather/<location>")
def weather(location):
    try:
        API_KEY = os.getenv("OPENWEATHER_API_KEY")

        if not API_KEY:
            return jsonify({"error": "Weather API key not configured"}), 500

        url = (
            f"https://api.openweathermap.org/data/2.5/weather"
            f"?q={location},IN&units=metric&appid={API_KEY}"
        )

        res = requests.get(url, timeout=5).json()

        if res.get("cod") != 200:
            return jsonify({"error": "Invalid location"}), 400

        return jsonify({
            "temp": res["main"]["temp"],
            "humidity": res["main"]["humidity"],
            "rainfall": res.get("rain", {}).get("1h", 0),
            "condition": res["weather"][0]["description"],
            "wind": res["wind"]["speed"],
            "city": res["name"]
        })

    except Exception as e:
        print("Weather error:", e)
        return jsonify({"error": "Failed to fetch weather"}), 500

    })


# ================== PDF REPORT ==================
@app.route("/api/report", methods=["GET"])
def report():
    content = (
        "SFAS – Smart Farming Advisory System\n\n"
        "Report Generated Successfully\n\n"
        "Thank you for using SFAS."
    )

    file = io.BytesIO()
    file.write(content.encode("utf-8"))
    file.seek(0)

    return send_file(
        file,
        as_attachment=True,
        download_name="SFAS_Report.txt",  # you can change to .pdf later
        mimetype="application/octet-stream"
    )

# ================== LOCAL RUN ==================
if __name__ == "__main__":
    app.run(port=5000, debug=True)
