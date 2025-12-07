// frontend/src/api/auth.js
const host = window.location.hostname; // localhost или 192.168.56.1 и т.п.
export const API_URL = `http://${host}:4000`;

export async function registerUser({ full_name, email, password }) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ full_name, email, password }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Ошибка регистрации");
  }

  return res.json();
}

export async function loginUser({ email, password }) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Ошибка входа");
  }

  return res.json();
}

export function saveAuthToStorage({ token, user }) {
  localStorage.setItem("imio_token", token);
  localStorage.setItem("imio_user", JSON.stringify(user));
}

export function getAuthFromStorage() {
  const token = localStorage.getItem("imio_token");
  const userRaw = localStorage.getItem("imio_user");
  let user = null;
  try {
    user = userRaw ? JSON.parse(userRaw) : null;
  } catch {
    user = null;
  }
  return { token, user };
}

export function clearAuth() {
  localStorage.removeItem("imio_token");
  localStorage.removeItem("imio_user");
}
