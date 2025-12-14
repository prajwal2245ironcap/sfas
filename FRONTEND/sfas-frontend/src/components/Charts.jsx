import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { getAnalytics } from "../api"; // ✅ IMPORTANT

export default function Charts() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAnalytics()
      .then((res) => {
        // Convert backend data → chart format
        const chartData = res.map((item) => ({
          name: item.crop,
          value: item.count,
        }));
        setData(chartData);
      })
      .catch((err) => {
        console.error("Analytics error:", err);
        setError("Failed to load analytics");
      });
  }, []);

  if (error) {
    return (
      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-gray-500">No analytics data yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Advisory Analytics
      </h2>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="value" fill="#16a34a" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

