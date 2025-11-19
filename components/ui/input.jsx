"use client";
import React from "react";

export default function Input({ value, onChange, placeholder = "", type = "text", name, className = "" }) {
  return (
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border border-accent-primary/60 w-full px-3 py-2 rounded text-text-secondary ${className}`}
      autoComplete="off"
    />
  );
}
