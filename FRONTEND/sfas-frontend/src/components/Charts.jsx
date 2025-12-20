import { useEffect, useState } from "react";
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

import { getAnalytics } from "../services/api";

export default function Charts() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState("All");
  const [view, setView] = useState("bar");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAnalytics()
      .then((res) => {
        setData(res);
        setFilteredData(res);
      })
      .catch((err) => {
        console.error("Analytics error:", err);
        setError("Failed to load analytics data");
      })
      .finally(() => setLoading(false));
  }, []);

  /* ---------- FILTER ---------- */
  const crops = ["All", ...new Set(data.map((d) => d.crop))];

  useEffect(() => {
    if (selectedCrop === "All") {
      setFilteredData(data);
    } else {
      setFilteredData(data.filter((d) => d.crop === selectedCrop));
    }
  }, [selectedCrop, data]);

  /* ---------- STATES ---------- */

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <p className="text-gray-500 animate-pulse">
          Loading analytics...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <p className="text-gray-500">
          No analytics data available yet
        </p>
      </div>
    );
  }

  /* ---------- UI ---------- */

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
        📊 Advisory Analytics
      </h2>

      {/* CONTROLS */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
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

        {/* View Toggle */}
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
      </div>

      {/* CHART */}
      <ResponsiveContainer width="100%" height={280}>
        {view === "bar" ? (
          <BarChart
            data={filteredData}
            margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />

            <XAxis
              dataKey="crop"
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />

            <YAxis
              allowDecimals={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              label={{
                value: "Number of Advisories",
                angle: -90,
                position: "insideLeft",
                fill: "#6b7280",
              }}
            />

            <Tooltip
              cursor={{ fill: "rgba(22, 163, 74, 0.1)" }}
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#f0fdf4",
              }}
            />

            <Bar
              dataKey="count"
              fill="#16a34a"
              radius={[6, 6, 0, 0]}
              animationDuration={800}
            />
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
              {filteredData.map((_, index) => (
                <Cell
                  key={index}
                  fill={
                    ["#16a34a", "#22c55e", "#4ade80", "#86efac"][
                      index % 4
                    ]
                  }
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

