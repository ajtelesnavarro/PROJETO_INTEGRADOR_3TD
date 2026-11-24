export function apiBase() {
  const raw = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1").replace(/\/+$/, "");
  return raw.endsWith("/api/v1") ? raw : raw.endsWith("/api") ? `${raw}/v1` : `${raw}/api/v1`;
}

export async function apiFetch(path, options = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("lumora_token") : null;
  const headers = { ...(options.body ? { "Content-Type": "application/json" } : {}), ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${apiBase()}${path.startsWith("/") ? path : `/${path}`}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.erro || data.mensagem || data.message || "Não foi possível concluir a operação.");
  return data;
}

export function unwrap(data) { return data?.dados ?? data; }
