// src/api/task1.js
import { getAuthFromStorage } from "./auth";

const host = window.location.hostname; // localhost или 192.168.56.1 и т.п.
export const API_URL = `http://${host}:4000`;

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
