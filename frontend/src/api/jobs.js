import { API_URL, getAuthFromStorage } from "./auth";

function headers() {
  const { token } = getAuthFromStorage();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function createJob(task_type) {
  const res = await fetch(`${API_URL}/api/jobs/create`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ task_type }),
  });
  return res.json();
}

export async function saveJobInput(job_id, payload) {
  const res = await fetch(`${API_URL}/api/jobs/input`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ job_id, payload }),
  });
  return res.json();
}

export async function saveJobResult(job_id, result_type, payload) {
  const res = await fetch(`${API_URL}/api/jobs/result`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ job_id, result_type, payload }),
  });
  return res.json();
}

export async function loadJobResults() {
  const res = await fetch(`${API_URL}/api/jobs/results`, {
    headers: headers(),
  });
  return res.json();
}

export async function deleteJobResult(id) {
  const res = await fetch(`${API_URL}/api/jobs/result/${id}`, {
    method: "DELETE",
    headers: headers(),
  });

  if (!res.ok) throw new Error("Ошибка удаления результата");
  return res.json();
}

