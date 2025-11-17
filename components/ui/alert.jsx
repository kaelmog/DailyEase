"use client";

export default function Alert({ type = "error", children }) {
  const base = "px-3 py-2 rounded-md text-sm";
  const variants = {
    error: base + " bg-red-50 text-red-800 border border-red-100",
    success: base + " bg-green-50 text-green-800 border border-green-100",
    info: base + " bg-blue-50 text-blue-800 border border-blue-100",
  };
  return <div className={variants[type] || variants.info}>{children}</div>;
}
