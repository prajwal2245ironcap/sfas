const API = import.meta.env.VITE_BACKEND_URL;

export const getAnalytics = async () => {
  const res = await fetch(`${API}/api/analytics`);
  return res.json();
};

export const getWeather = async () => {
  const res = await fetch(`${API}/api/weather`);
  return res.json();
};

export const sendAdvisory = async (payload) => {
  const res = await fetch(`${API}/api/advisory`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return res.json();
};
