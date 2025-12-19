import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getAdvisory } from "../services/api";
import { Wheat, Mountain, Calendar } from "lucide-react";

export default function AdvisoryForm({ setResult }) {
  const { t } = useTranslation();

  const [form, setForm] = useState({
  crop: "",
  soil: "",
  season: "Kharif",
  location: ""   // 👈 ADD THIS
});


 const submitHandler = async (e) => {
  e.preventDefault();
  console.log("Submitting form:", form);

  const data = await getAdvisory(form);
  console.log("API response:", data);

  setResult(data);
};


  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
      <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-5">
        🌱 Crop Advisory Input
      </h2>

      <form onSubmit={submitHandler} className="space-y-4">

        {/* Crop */}
        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700
                        border border-gray-200 dark:border-gray-600
                        rounded-xl px-4 py-3
                        focus-within:ring-1 focus-within:ring-green-500">
          <Wheat size={18} className="text-green-600 dark:text-green-400" />
          <input
            type="text"
            className="flex-1 bg-transparent outline-none
                       text-gray-800 dark:text-gray-100
                       placeholder-gray-400"
            placeholder={t("crop")}
            onChange={(e) =>
              setForm({ ...form, crop: e.target.value })
            }
            required
          />
        </div>

        {/* Soil */}
        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700
                        border border-gray-200 dark:border-gray-600
                        rounded-xl px-4 py-3
                        focus-within:ring-1 focus-within:ring-green-500">
          <Mountain size={18} className="text-orange-600 dark:text-orange-400" />
          <input
            type="text"
            className="flex-1 bg-transparent outline-none
                       text-gray-800 dark:text-gray-100
                       placeholder-gray-400"
            placeholder={t("soil")}
            onChange={(e) =>
              setForm({ ...form, soil: e.target.value })
            }
            required
          />
        </div>

        {/* Season */}
        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700
                        border border-gray-200 dark:border-gray-600
                        rounded-xl px-4 py-3
                        focus-within:ring-1 focus-within:ring-green-500">
          <Calendar size={18} className="text-green-600 dark:text-green-400" />
          <select
            className="flex-1 bg-transparent outline-none
                       text-gray-800 dark:text-gray-100"
            value={form.season}
            onChange={(e) =>
              setForm({ ...form, season: e.target.value })
            }
          >
            <option>Kharif</option>
            <option>Rabi</option>
            <option>Zaid</option>
          </select>
        </div>

{/* Location */}
<select
  value={location}
  onChange={(e) => setLocation(e.target.value)}
  className="w-full p-2 border rounded"
>
  <option value="">Select Location</option>
  <option value="Karnataka">Karnataka</option>
  <option value="Punjab">Punjab</option>
</select>


        {/* Submit */}
       <button
  type="submit"
  className="w-full bg-green-600 hover:bg-green-700
             text-white py-3 rounded-xl
             font-semibold tracking-wide transition"
>
  Get Advisory




</button>

      </form>
    </div>
  );
}
