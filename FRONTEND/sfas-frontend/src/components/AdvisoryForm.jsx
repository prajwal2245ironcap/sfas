import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getAdvisory } from "../services/api";
import { Wheat, Mountain, Calendar, MapPin } from "lucide-react";

export default function AdvisoryForm({ setResult, setLocation }) {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    crop: "",
    soil: "",
    season: "Kharif",
    location: ""
  });

  const submitHandler = async (e) => {
    e.preventDefault();

    const data = await getAdvisory(form);

    setResult(data);
    setLocation(form.location);   // ✅ UPDATED
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
      <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200 mb-5">
        🌱 Crop Advisory Input
      </h2>

      <form onSubmit={submitHandler} className="space-y-4">

        <input
          placeholder={t("crop")}
          value={form.crop}
          onChange={(e) => setForm({ ...form, crop: e.target.value })}
          required
        />

        <input
          placeholder={t("soil")}
          value={form.soil}
          onChange={(e) => setForm({ ...form, soil: e.target.value })}
          required
        />

        <select
          value={form.season}
          onChange={(e) => setForm({ ...form, season: e.target.value })}
        >
          <option>Kharif</option>
          <option>Rabi</option>
          <option>Zaid</option>
        </select>

        <select
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          required
        >
          <option value="">Select Location</option>
          <option value="Karnataka">Karnataka</option>
          <option value="Punjab">Punjab</option>
        </select>

        <button type="submit">Get Advisory</button>
      </form>
    </div>
  );
}
