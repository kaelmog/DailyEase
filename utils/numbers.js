export function cleanNumericString(s) {
  if (s === "" || s == null) return 0;
  const numeric = String(s).replace(/[^\d-]/g, "");
  const n = Number(numeric);
  return Number.isFinite(n) ? n : 0;
}
