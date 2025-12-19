def predict_yield(crop, soil, season, location):
    base_yield = {
        "Wheat": 45,
        "Ragi": 38,
        "Rice": 52,
        "Maize": 48
    }.get(crop, 35)

    soil_factor = {
        "Loamy": 1.2,
        "Black": 1.15,
        "Sandy": 0.9
    }.get(soil, 1.0)

    season_factor = 1.1 if season == "Kharif" else 1.0
    location_factor = 1.15 if location == "Punjab" else 1.05

    return round(base_yield * soil_factor * season_factor * location_factor, 2)
