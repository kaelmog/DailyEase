"use client";
import React from "react";

export default function Card({ children, className = "" }) {
  return <div className={`bg-secondary p-4 rounded-xl shadow-md ${className}`}>{children}</div>;
}
