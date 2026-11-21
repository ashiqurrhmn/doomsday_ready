export async function apiRequest(path, options = {}) {
  const requestPath = path.startsWith("/") ? path : `/${path}`;
  const headers = new Headers(options.headers);

  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`/api${requestPath}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(data?.error?.message || "Request failed");
    error.code = data?.error?.code;
    error.status = response.status;
    throw error;
  }

  return data;
}
