import { useEffect, useState } from "react";
import { getAdvisory } from "../services/api";

export default function AdvisoryForm({ setResult, setLocation, weatherData }) {
  const [form, setForm] = useState({
    nitrogen: 0,
    phosphorus: 0,
    potassium: 0,
    temperature: "",
    humidity: "",
    rainfall: "",
    ph: "",
    location: "Karnataka",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Auto-fill from weather
  useEffect(() => {
    if (weatherData) {
      setForm((f) => ({
        ...f,
        temperature: weatherData.temp ?? f.temperature,
        humidity: weatherData.humidity ?? f.humidity,
        rainfall: weatherData.rainfall ?? f.rainfall,
      }));
    }
  }, [weatherData]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const data = await getAdvisory({
        nitrogen: Number(form.nitrogen),
        phosphorus: Number(form.phosphorus),
        potassium: Number(form.potassium),
        temperature: Number(form.temperature),
        humidity: Number(form.humidity),
        rainfall: Number(form.rainfall),
        ph: Number(form.ph),
      });

      setResult(data);
      setLocation(form.location);
    } catch {
      setError("Failed to get ML advisory");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
      <h2 className="text-base font-semibold mb-4">
        🌱 ML Crop Advisory Input
      </h2>

      <form onSubmit={submitHandler} className="grid grid-cols-2 gap-4">

        {/* SLIDERS */}
        {[
          ["Nitrogen (N)", "nitrogen", 140],
          ["Phosphorus (P)", "phosphorus", 145],
          ["Potassium (K)", "potassium", 205],
        ].map(([label, key, max]) => (
          <div key={key} className="col-span-2">
            <label className="text-sm text-gray-600">
              {label}: <b>{form[key]}</b>
            </label>
            <input
              type="range"
              min="0"
              max={max}
              value={form[key]}
              onChange={(e) =>
                setForm({ ...form, [key]: e.target.value })
              }
              className="w-full"
            />
          </div>
        ))}

        {/* WEATHER-AWARE FIELDS */}
        <input
          type="number"
          placeholder="Temperature (°C)"
          value={form.temperature}
          readOnly={!!weatherData}
          className={weatherData ? "bg-gray-100" : ""}
          onChange={(e) =>
            setForm({ ...form, temperature: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Humidity (%)"
          value={form.humidity}
          readOnly={!!weatherData}
          className={weatherData ? "bg-gray-100" : ""}
          onChange={(e) =>
            setForm({ ...form, humidity: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Rainfall (mm)"
          value={form.rainfall}
          onChange={(e) =>
            setForm({ ...form, rainfall: e.target.value })
          }
        />

        <input
          type="number"
          step="0.1"
          placeholder="Soil pH"
          value={form.ph}
          onChange={(e) =>
            setForm({ ...form, ph: e.target.value })
          }
        />

        {error && (
          <p className="col-span-2 text-red-600 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="col-span-2 bg-green-600 text-white py-2 rounded-lg"
        >
          {loading ? "Predicting..." : "Get ML Advisory"}
        </button>
      </form>
    </div>
  );
}
