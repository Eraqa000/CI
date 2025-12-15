// src/api/task1.js
import { getAuthFromStorage } from "./auth";


export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

function authHeader() {
  const { token } = getAuthFromStorage();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function computeTask1(oreIds) {
  const res = await fetch(`${API_URL}/api/task1/compute`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify({ ore_ids: oreIds }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Ошибка вычисления");
  }

  return res.json();
}
