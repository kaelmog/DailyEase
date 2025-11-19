"use client";
import React from "react";
import { formatIdNumber } from "@/utils/format";

export default function ReportItem({ label, value, transactions }) {
  return (
    <li className="flex justify-between items-center py-2 border-b border-row-hover last:border-b-0">
      <span className="capitalize text-text-secondary">{label.replace(/_/g, " ")}</span>
      <span className="font-semibold text-text-secondary text-right">
        Rp{formatIdNumber(value)}
        {transactions !== undefined && transactions > 0 && (
          <span className="block text-xs font-normal text-text-secondary opacity-80">({transactions} trx)</span>
        )}
      </span>
    </li>
  );
}
