"use client";

export default function Loader({ size = "md", label = "Loading..." }) {
  const sizeClass = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-8 w-8" : "h-6 w-6";
  return (
    <div className="flex items-center gap-2">
      <svg className={`${sizeClass} animate-spin`} viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.15"></circle>
        <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round"></path>
      </svg>
      <span className="text-sm">{label}</span>
    </div>
  );
}
