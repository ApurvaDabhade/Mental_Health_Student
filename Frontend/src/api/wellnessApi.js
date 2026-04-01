/** Same-origin `/api` works with Vite dev proxy and typical production reverse-proxy. Override with VITE_API_BASE_URL if needed. */
function getApiBase() {
  const raw = import.meta.env.VITE_API_BASE_URL;
  if (raw != null && String(raw).trim() !== "") {
    return String(raw).replace(/\/$/, "");
  }
  return "/api";
}

const BASE = getApiBase();

async function parseJson(res) {
  const text = await res.text();
  if (!res.ok) throw new Error(text || res.statusText);
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

export async function saveWellnessProfile(payload) {
  const res = await fetch(`${BASE}/wellness/profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseJson(res);
}

export async function fetchWellnessProfile(userId) {
  const res = await fetch(`${BASE}/wellness/profile/${encodeURIComponent(userId)}`);
  return parseJson(res);
}

export async function fetchStressReport(userId) {
  const res = await fetch(`${BASE}/wellness/report/${encodeURIComponent(userId)}`);
  return parseJson(res);
}

export async function postAssessmentRecord(body) {
  const res = await fetch(`${BASE}/wellness/assessment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return parseJson(res);
}
