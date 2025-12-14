import { useEffect, useState } from "react";
import { getWeather } from "../api"; // ✅ IMPORTANT

export default function Weather() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getWeather()
      .then((data) => {
        setWeather(data);
      })
      .catch((err) => {
        console.error("Weather error:", err);
        setError("Failed to load weather data");
      });
  }, []);

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
      <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-4">
        Weather Overview
      </h2>

      <p>🌡 Temperature: {weather.temp}°C</p>
      <p>🌧 Rainfall: {weather.rainfall}</p>
      <p>💧 Humidity: {weather.humidity}%</p>
    </div>
  );
}


