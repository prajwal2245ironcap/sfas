import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import Slidebar from "./components/Slidebar";
import Dashboard from "./pages/Dashboard";
import Crops from "./pages/Crops";
import Analytics from "./pages/Analytics";
import WeatherPage from "./pages/WeatherPage";

import { getAnalytics } from "./api";

export default function App() {
  
console.log("Backend URL:", import.meta.env.VITE_BACKEND_URL);

  // 🔹 Backend API call
  useEffect(() => {
    getAnalytics()
      .then(data => {
        console.log("Analytics data from backend:", data);
      })
      .catch(err => {
        console.error("Backend API error:", err);
      });
  }, []);

  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
        <Slidebar />

        <main className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/crops" element={<Crops />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/weather" element={<WeatherPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

