import { API_URL, getAuthFromStorage } from "./auth";

function getAuthHeaders() {
  const { token } = getAuthFromStorage();
  if (!token) return {};
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchOreSamples() {
  const res = await fetch(`${API_URL}/api/task1/samples`, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Ошибка загрузки руд: ${res.status} ${res.statusText} — ${text}`
    );
  }

  return res.json();
}

export async function createOreSample(payload) {
  const res = await fetch(`${API_URL}/api/task1/samples`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Ошибка сохранения руды: ${res.status} ${res.statusText} — ${text}`
    );
  }

  return res.json();
}

export async function deleteOreSample(id) {
  const res = await fetch(`${API_URL}/api/task1/samples/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });

  if (!res.ok && res.status !== 204) {
    const text = await res.text();
    throw new Error(
      `Ошибка удаления руды: ${res.status} ${res.statusText} — ${text}`
    );
  }

  return true;
}
