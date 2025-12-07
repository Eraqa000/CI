// src/api/task1Ml.js
import { getAuthFromStorage } from "./auth";

const host = window.location.hostname; // localhost или 192.168.56.1 и т.п.
export const API_URL = `http://${host}:4000`;

export async function predictForward(payload) {
  const { token } = getAuthFromStorage();

  const res = await fetch(`${API_URL}/api/task1/predict-forward`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Ошибка расчёта модели");
  }

  return res.json();
}
