export function formatIdNumber(n) {
  const num = Number(n);
  return num ? new Intl.NumberFormat("id-ID").format(num) : "0";
}

export function pretty(s = "") {
  return String(s || "")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
