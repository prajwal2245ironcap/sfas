import axios from "axios";

const API = import.meta.env.VITE_BACKEND_URL;

/* ---------- Analytics ---------- */
export const getAnalytics = async () => {
  const res = await fetch(`${API}/api/analytics`);
  return res.json();
};

/* ---------- Weather (FIXED) ---------- */
export const getWeather = async (location) => {
  if (!location) throw new Error("Location is required");

  const res = await fetch(`${API}/api/weather/${location}`);
  return res.json();
};

/* ---------- Advisory ---------- */
export const getAdvisory = async (payload) => {
  const res = await axios.post(
    `${API}/api/advisory`,
    payload,
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return res.data;
};
