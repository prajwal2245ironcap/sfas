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
    location = data.get("location", "India")

    # Location override
    if location == "Karnataka":
        crop = "Ragi"
    elif location == "Punjab":
        crop = "Wheat"

    ml_score = predict_yield(crop, soil, season, location)

    advisory_data = {
        "crop": crop,
        "soil": soil,
        "season": season,
        "location": location,
        "recommendation": f"Grow {crop}",
        "ml_prediction": ml_score,
        "explanation": f"{crop} suits {soil} soil in {season} season at {location}",
        "benefits": {
            "yield": ml_score,
            "cost": 30,
            "loss": 15
        }
    }

    db.advisories.insert_one(advisory_data)
    advisory_data.pop("_id", None)

    return jsonify(advisory_data)

# ================== ANALYTICS ==================
@app.route("/api/analytics", methods=["GET"])
def analytics():
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

# ================== WEATHER ==================
import requests

@app.route("/api/weather/<location>")
def weather(location):
    API_KEY = "7a8ed48d80f3aa4e554e6ef1eb897353Y"

    url = f"https://api.openweathermap.org/data/2.5/weather?q={location},IN&appid={API_KEY}&units=metric"
    res = requests.get(url).json()

    return jsonify({
        "temp": res["main"]["temp"],
        "humidity": res["main"]["humidity"],
        "rainfall": res.get("rain", {}).get("1h", 0),
        "condition": res["weather"][0]["main"]
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
