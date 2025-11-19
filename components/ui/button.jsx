"use client";
import React from "react";

export default function Button({ children, className = "", type = "button", ...props }) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center px-4 py-2 rounded font-semibold transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
