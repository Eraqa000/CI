import { getAuthFromStorage } from "./auth";

const API = `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/admin`;

function headers() {
  const { token } = getAuthFromStorage();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function fetchUsers() {
  const res = await fetch(`${API}/users`, { headers: headers() });
  return res.json();
}

export async function changeUserPassword(id, newPassword) {
  await fetch(`${API}/users/${id}/password`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify({ newPassword }),
  });
}

export async function changeUserRole(id, role) {
  await fetch(`${API}/users/${id}/role`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify({ role }),
  });
}

export async function changeUserStatus(id, status) {
  await fetch(`${API}/users/${id}/status`, {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify({ status }),
  });
}
