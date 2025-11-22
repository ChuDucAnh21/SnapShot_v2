// Rules applied: style/brace-style:1tbs
type AutoFetchOptions = RequestInit & { signal?: AbortSignal };

const API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN || '';

function buildHeaders(options?: AutoFetchOptions) {
  return {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  };
}

export async function autoFetch<T = unknown>(path: string, options: AutoFetchOptions = {}) {
  const response = await fetch(`${API_ORIGIN}${path}`, {
    credentials: "include",
    ...options,
    headers: buildHeaders(options),
  });

  const text = await response.text().catch(() => "");
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = payload?.message || response.statusText || "Request failed";
    const err: Error & { status?: number } = new Error(message);
    err.status = response.status;
    throw err;
  }

  return payload as T;
}
