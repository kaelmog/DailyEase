"use client";

export default function Input({ value, onChange, placeholder = "", type = "text", className = "", name }) {
  return (
    <input
      name={name}
      type={type}
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      placeholder={placeholder}
      className={`border border-accent-primary/60 w-full px-3 py-2 rounded ${className}`}
    />
  );
}
