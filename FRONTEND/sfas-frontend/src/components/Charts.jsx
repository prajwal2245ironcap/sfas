import { useEffect, useRef, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { getAnalytics, exportAnalyticsCSV } from "../services/api";

export default function Charts() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState("All");
  const [view, setView] = useState("bar");
  const [period, setPeriod] = useState("daily"); // ✅ NEW
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const chartRef = useRef(null);

  /* ---------- FETCH ANALYTICS ---------- */
  useEffect(() => {
    setLoading(true);

    getAnalytics(period)
      .then((res) => {
        setData(res);
        setFilteredData(res);
      })
      .catch((err) => {
        console.error("Analytics error:", err);
        setError("Failed to load analytics data");
      })
      .finally(() => setLoading(false));
  }, [period]);

  /* ---------- FILTER BY CROP ---------- */
  const crops = ["All", ...new Set(data.map((d) => d.crop))];

  useEffect(() => {
    if (selectedCrop === "All") {
      setFilteredData(data);
    } else {
      setFilteredData(data.filter((d) => d.crop === selectedCrop));
    }
  }, [selectedCrop, data]);

  if (loading)
    return <p className="text-gray-500">Loading analytics...</p>;

  if (error)
    return <p className="text-red-500">{error}</p>;

  if (data.length === 0)
    return <p className="text-gray-500">No analytics data</p>;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">
        📊 Advisory Analytics
      </h2>

      {/* ---------- CONTROLS ---------- */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">

        {/* Period Dropdown */}
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-3 py-1 border rounded text-sm"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>

        {/* Crop Filter */}
        <select
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value)}
          className="px-3 py-1 border rounded text-sm"
        >
          {crops.map((crop) => (
            <option key={crop} value={crop}>
              {crop}
            </option>
          ))}
        </select>

        {/* Chart Type */}
        <div className="flex gap-2">
          <button
            onClick={() => setView("bar")}
            className={`px-3 py-1 rounded text-sm ${
              view === "bar"
                ? "bg-green-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Bar
          </button>

          <button
            onClick={() => setView("pie")}
            className={`px-3 py-1 rounded text-sm ${
              view === "pie"
                ? "bg-green-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Pie
          </button>
        </div>

        {/* CSV Export */}
        <button
          onClick={exportAnalyticsCSV}
          className="ml-auto px-3 py-1 bg-blue-600 text-white rounded text-sm"
        >
          📥 Export CSV
        </button>
      </div>

      {/* ---------- CHART ---------- */}
      <div ref={chartRef}>
        <ResponsiveContainer width="100%" height={280}>
          {view === "bar" ? (
            <BarChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="crop" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#16a34a" />
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={filteredData}
                dataKey="count"
                nameKey="crop"
                outerRadius={90}
                label
              >
                {filteredData.map((_, i) => (
                  <Cell
                    key={i}
                    fill={[
                      "#16a34a",
                      "#22c55e",
                      "#4ade80",
                      "#86efac",
                    ][i % 4]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
