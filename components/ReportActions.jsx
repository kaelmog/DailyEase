"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "./ui/Loader";

export default function ReportActions({ reportId, onDeleted }) {
  const [loading] = useState(false);
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/reports/edit/${reportId}`);
  };

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this report?")) return;
    const token = localStorage.getItem("token");

    const res = await fetch("/api/reports/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: reportId }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(`Failed: ${data.error || res.statusText}`);
      return;
    }

    onDeleted(reportId);
  }

  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={handleEdit}
        className="px-2 py-1 text-xs rounded bg-yellow-600 text-white hover:bg-yellow-500"
      >
        Edit
      </button>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-500 disabled:opacity-60"
      >
        {loading ? (<Loader label="Deleting..." />) : "Delete"}
      </button>
    </div>
  );
}
