import { useState } from "react";
import { useFarmerMode } from "../context/useFarmerMode";

import AdvisoryForm from "../components/AdvisoryForm";
import AdvisoryCard from "../components/AdvisoryCard";
import Charts from "../components/Charts";
import Weather from "../components/Weather";
import PdfDownload from "../components/PdfDownload";
import ThemeToggle from "../components/ThemeToggle";
import FarmerModeToggle from "../components/FarmerModeToggle";

import {
  TrendingUp,
  DollarSign,
  CloudRain,
  Tractor,
} from "lucide-react";

export default function Dashboard() {
  const [result, setResult] = useState(null);
  const [location, setLocation] = useState("");   // ✅ ADDED
  const { mode } = useFarmerMode();

  return (
    <main className="bg-gray-100 dark:bg-gray-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-6 space-y-8">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Dashboard
          </h1>

          <div className="flex gap-3 items-center">
            <FarmerModeToggle />
            <ThemeToggle />
          </div>
        </div>

        {/* ================= KPI CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
            <TrendingUp className="text-green-600 mb-3" />
            <p className="text-xs uppercase tracking-wide text-gray-400">
              Yield Growth
            </p>
            <p className="mt-2 text-3xl font-semibold text-green-600">
              45%
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
            <DollarSign className="text-green-600 mb-3" />
            <p className="text-xs uppercase tracking-wide text-gray-400">
              Cost Reduction
            </p>
            <p className="mt-2 text-3xl font-semibold text-green-600">
              30%
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
            <CloudRain className="text-green-600 mb-3" />
            <p className="text-xs uppercase tracking-wide text-gray-400">
              Weather Accuracy
            </p>
            <p className="mt-2 text-3xl font-semibold text-green-600">
              92%
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm">
            <Tractor className="text-green-600 mb-3" />
            <p className="text-xs uppercase tracking-wide text-gray-400">
              Crop Health
            </p>
            <p className="mt-2 text-3xl font-semibold text-green-600">
              Good
            </p>
          </div>

        </div>

        {/* ================= MAIN GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ANALYTICS — ADVANCED FARMER ONLY */}
          {mode === "advanced" && (
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-7 rounded-2xl shadow-sm">
              <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-4">
                Analytics Overview
              </h2>

              <Charts />

              <div className="mt-6">
                <Weather location={location} />   {/* ✅ FIXED */}
              </div>
            </div>
          )}

          {/* ADVISORY — ALL FARMERS */}
          <div className="bg-white dark:bg-gray-800 p-7 rounded-2xl shadow-sm space-y-6">
            <AdvisoryForm
              setResult={setResult}
              setLocation={setLocation}   {/* ✅ FIXED */}
            />

            {result && <AdvisoryCard result={result} />}

            <PdfDownload />
          </div>

        </div>

      </div>
    </main>
  );
}
