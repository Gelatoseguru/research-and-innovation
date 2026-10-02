export async function backendFetch(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(`/backend/${path.replace(/^\//, "")}`, {
    ...init,
    headers,
    credentials: "include",
  });
}
