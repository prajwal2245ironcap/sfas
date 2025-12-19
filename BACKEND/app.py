from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from pymongo import MongoClient
import io
import os
from dotenv import load_dotenv


load_dotenv()


app = Flask(__name__)
CORS(app)

# ================== MONGODB ==================
client = MongoClient(os.getenv("MONGODB_URI"))
db = client["sfas"]


# ================== HOME ==================
@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "Backend working"})

# ================== ADVISORY ==================
from ml_model import predict_crop_ml

@app.route("/api/advisory", methods=["POST"])
def advisory():
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

    response = {
        "crop": crop,
        "recommendation": f"Grow {crop}",
        "ml_prediction": confidence,
        "explanation": (
            f"{crop} is recommended based on soil nutrients "
            f"and weather conditions using ML"
        ),
        "benefits": {
            "yield": round(confidence * 100, 2),
            "cost": 30,
            "loss": 15
        }
    }

    return jsonify(response)


# ================== ANALYTICS ==================
# ================== ANALYTICS ==================
@app.route("/api/analytics", methods=["GET"])
def analytics():
    try:
        # Check Mongo connection
        if db is None:
            return jsonify([])

        pipeline = [
            {
                "$group": {
                    "_id": "$crop",
                    "count": {"$sum": 1}
                }
            }
        ]

        results = list(db.advisories.aggregate(pipeline))

        analytics_data = [
            {"crop": item["_id"], "count": item["count"]}
            for item in results
        ]

        return jsonify(analytics_data)

    except Exception as e:
        print("Analytics error:", e)
        # Return empty list instead of 500
        return jsonify([])



# ================== WEATHER ==================
# ================== WEATHER ==================
import requests
import os

@app.route("/api/weather/<location>")
def weather(location):
    try:
        api_key = os.getenv("OPENWEATHER_API_KEY")

        if not api_key:
            return jsonify({"error": "API key missing"}), 500

        url = (
            "https://api.openweathermap.org/data/2.5/weather"
            f"?q={location},IN&units=metric&appid={api_key}"
        )

        res = requests.get(url, timeout=5).json()

        if res.get("cod") != 200:
            return jsonify({"error": "Invalid location"}), 400

        data = {
            "temp": res["main"]["temp"],
            "humidity": res["main"]["humidity"],
            "rainfall": res.get("rain", {}).get("1h", 0),
            "condition": res["weather"][0]["description"],
            "wind": res["wind"]["speed"],
            "city": res["name"]
        }

        return jsonify(data)

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
        download_name="SFAS_Report.txt",  # you can change to .pdf later
        mimetype="application/octet-stream"
    )

# ================== LOCAL RUN ==================
if __name__ == "__main__":
    app.run(port=5000, debug=True)
