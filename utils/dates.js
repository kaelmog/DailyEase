export function getIndonesianFullDate(date) {
  return new Date(date).toLocaleString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getIndonesianShortDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString("id-ID");
}
