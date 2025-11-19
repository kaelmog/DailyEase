"use client";
import React from "react";
import { Loader2 } from "lucide-react";

export default function Loader({ className = "w-8 h-8 animate-spin text-accent-primary", label }) {
  return (
    <div className="flex flex-col items-center justify-center">
      <Loader2 className={className} />
      {label && <span className="mt-2 text-sm text-text-secondary">{label}</span>}
    </div>
  );
}
