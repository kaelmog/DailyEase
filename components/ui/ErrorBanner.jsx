"use client";
import React from "react";
import { AlertTriangle } from "lucide-react";

export default function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="bg-red-500 text-white p-3 rounded-lg shadow-sm flex items-start space-x-2">
      <AlertTriangle className="w-5 h-5 mt-0.5" />
      <div className="text-sm">{message}</div>
    </div>
  );
}
