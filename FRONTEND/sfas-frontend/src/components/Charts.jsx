import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { getAnalytics } from "../services/api";

export default function Charts() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAnalytics()
      .then((res) => {
        const chartData = res.map((item) => ({
          crop: item.crop,
          count: item.count,
        }));
        setData(chartData);
      })
      .catch((err) => {
        console.error("Analytics error:", err);
        setError("Failed to load analytics data");
      })
      .finally(() => setLoading(false));
  }, []);

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

  /* ---------- CHART ---------- */

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
        📊 Advisory Analytics
      </h2>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={data}
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
      </ResponsiveContainer>
    </div>
  );
}

