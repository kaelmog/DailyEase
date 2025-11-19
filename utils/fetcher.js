export async function fetcher(url, opts = {}) {
  const merged = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
    ...opts,
  };

  const res = await fetch(url, merged);
  if (!res.ok) {
    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error(`Request failed: ${res.status} ${res.statusText}`);
    }
    const err = new Error(data?.error || "Request failed");
    err.status = res.status;
    throw err;
  }
  return res.json();
}
