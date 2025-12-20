from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime
import requests
import io
import os

# ================== INIT ==================
load_dotenv()

app = Flask(__name__)
CORS(app)

# ================== MONGODB ==================
MONGO_URI = os.getenv("MONGODB_URI")
client = MongoClient(MONGO_URI)
db = client["sfas"]

# ================== HOME ==================
@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "Backend working"})

# ================== ML ADVISORY ==================
from ml_model import predict_crop_ml

@app.route("/api/advisory", methods=["POST"])
def advisory():
    try:
        data = request.get_json()

        crop, confidence = predict_crop_ml(
            data["nitrogen"],
            data["phosphorus"],
            data["potassium"],
            data["temperature"],
            data["humidity"],
            data["rainfall"],
            data["ph"]
        )

        # ---------- STORE IN DB ----------
        advisory_doc = {
            "crop": crop,
            "nitrogen": data["nitrogen"],
            "phosphorus": data["phosphorus"],
            "potassium": data["potassium"],
            "temperature": data["temperature"],
            "humidity": data["humidity"],
            "rainfall": data["rainfall"],
            "ph": data["ph"],
            "confidence": confidence,
            "created_at": datetime.utcnow()
        }

        db.advisories.insert_one(advisory_doc)

        # ---------- RESPONSE ----------
        response = {
            "crop": crop,
            "recommendation": f"Grow {crop}",
            "ml_prediction": confidence,
            "explanation": (
                f"{crop} is recommended based on soil nutrients "
                f"and weather conditions using machine learning."
            ),
            "benefits": {
                "yield": round(confidence * 100, 2),
                "cost": 30,
                "loss": 15
            }
        }

        return jsonify(response)

    except Exception as e:
        print("Advisory error:", e)
        return jsonify({"error": "Failed to generate advisory"}), 500

# ================== ANALYTICS (DATE-WISE) ==================
@app.route("/api/analytics", methods=["GET"])
def analytics():
    try:
        pipeline = [
            {
                "$group": {
                    "_id": {
                        "crop": "$crop",
                        "date": {
                            "$dateToString": {
                                "format": "%Y-%m-%d",
                                "date": "$created_at"
                            }
                        }
                    },
                    "count": {"$sum": 1}
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "crop": "$_id.crop",
                    "date": "$_id.date",
                    "count": 1
                }
            },
            {
                "$sort": {"date": 1}
            }
        ]

        results = list(db.advisories.aggregate(pipeline))
        return jsonify(results)

    except Exception as e:
        print("Analytics error:", e)
        return jsonify([])

# ================== WEATHER ==================
@app.route("/api/weather/<location>")
def weather(location):
    try:
        api_key = os.getenv("OPENWEATHER_API_KEY")

        if not api_key:
            return jsonify({"error": "Weather API key missing"}), 500

        url = (
            "https://api.openweathermap.org/data/2.5/weather"
            f"?q={location},IN&units=metric&appid={api_key}"
        )

        res = requests.get(url, timeout=5).json()

        if res.get("cod") != 200:
            return jsonify({"error": "Invalid location"}), 400

        weather_data = {
            "temp": res["main"]["temp"],
            "humidity": res["main"]["humidity"],
            "rainfall": res.get("rain", {}).get("1h", 0),
            "condition": res["weather"][0]["description"],
            "wind": res["wind"]["speed"],
            "city": res["name"]
        }

        return jsonify(weather_data)

    except Exception as e:
        print("Weather error:", e)
        return jsonify({"error": "Weather fetch failed"}), 500

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
        download_name="SFAS_Report.txt",
        mimetype="application/octet-stream"
    )

# ================== LOCAL RUN ==================
if __name__ == "__main__":
    app.run(port=5000, debug=True)
