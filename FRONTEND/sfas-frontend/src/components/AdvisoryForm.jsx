import { useState } from "react";
import { getAdvisory } from "../services/api";

export default function AdvisoryForm({ setResult, setLocation }) {
  const [form, setForm] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    temperature: "",
    humidity: "",
    rainfall: "",
    ph: "",
    location: "Karnataka",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Sample input for demo
  const fillSampleData = () => {
    setForm({
      nitrogen: 90,
      phosphorus: 42,
      potassium: 43,
      temperature: 28,
      humidity: 80,
      rainfall: 200,
      ph: 6.5,
      location: "Karnataka",
    });
    setError("");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    const values = Object.values(form).slice(0, 7);
    if (values.some(v => v === "" || isNaN(v))) {
      setError("⚠️ Please enter valid values for all fields");
      return;
    }

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
    } catch (err) {
      setError("❌ Failed to get ML advisory");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
      <h2 className="text-base font-semibold mb-4">
        🌱 ML Crop Advisory Input
      </h2>

      <form onSubmit={submitHandler} className="grid grid-cols-2 gap-3">

        <input
          type="number"
          placeholder="Nitrogen (N)"
          title="Nitrogen content in soil (kg/ha)"
          value={form.nitrogen}
          onChange={e => setForm({ ...form, nitrogen: e.target.value })}
        />

        <input
          type="number"
          placeholder="Phosphorus (P)"
          title="Phosphorus content in soil (kg/ha)"
          value={form.phosphorus}
          onChange={e => setForm({ ...form, phosphorus: e.target.value })}
        />

        <input
          type="number"
          placeholder="Potassium (K)"
          title="Potassium content in soil (kg/ha)"
          value={form.potassium}
          onChange={e => setForm({ ...form, potassium: e.target.value })}
        />

        <input
          type="number"
          placeholder="Temperature (°C)"
          title="Average temperature in Celsius"
          value={form.temperature}
          onChange={e => setForm({ ...form, temperature: e.target.value })}
        />

        <input
          type="number"
          placeholder="Humidity (%)"
          title="Relative humidity percentage"
          value={form.humidity}
          onChange={e => setForm({ ...form, humidity: e.target.value })}
        />

        <input
          type="number"
          placeholder="Rainfall (mm)"
          title="Annual rainfall in millimeters"
          value={form.rainfall}
          onChange={e => setForm({ ...form, rainfall: e.target.value })}
        />

        <input
          type="number"
          step="0.1"
          placeholder="Soil pH"
          title="Soil acidity/alkalinity (0–14)"
          value={form.ph}
          onChange={e => setForm({ ...form, ph: e.target.value })}
        />

        {/* Sample Input Button */}
        <button
          type="button"
          onClick={fillSampleData}
          className="col-span-2 bg-blue-100 text-blue-700 py-2 rounded-lg hover:bg-blue-200"
        >
          📊 Use Sample Input (Demo)
        </button>

        {/* Error Message */}
        {error && (
          <p className="col-span-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`col-span-2 py-2 rounded-lg text-white
            ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}
          `}
        >
          {loading ? "Predicting..." : "Get ML Advisory"}
        </button>

      </form>
    </div>
  );
}

