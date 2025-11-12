"use client";
import { useEffect, useState, useMemo } from "react";
import ReportActions from "@/components/ReportActions";
import { formatIdNumber } from "@/utils/format";
import Link from "next/link";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/reports/list", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load reports");
        setReports(data);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  const weeklySummary = useMemo(() => {
    const grouped = {};
    reports.forEach((r) => {
      const week = new Date(r.report_date).toLocaleDateString("id-ID", {
        week: "numeric",
        year: "numeric",
      });
      if (!grouped[week]) grouped[week] = [];
      grouped[week].push(r);
    });
    return grouped;
  }, [reports]);

  return (
    <div className="min-h-screen px-4 py-6 max-w-3xl mx-auto">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Report History</h1>
      </header>

      {loading ? (
        <p>Loading...</p>
      ) : err ? (
        <p className="text-red-500">{err}</p>
      ) : reports.length === 0 ? (
        <p>No reports yet.</p>
      ) : (
        Object.entries(weeklySummary).map(([week, items]) => (
          <div key={week} className="mb-6">
            <h2 className="font-semibold text-lg mb-2">Week {week}</h2>
            {items.map((r) => (
              <Link
                key={r}
                href={`/reports/view/${r.id}`}
                className="block flex-1"
              >
                <div className="text-sm text-gray-400">{r.report_date}</div>
                <div className="text-lg font-medium">
                  Rp {r.total_sales ?? 0}
                </div>
                {r.notes && <div className="text-sm mt-1">Note example</div>}
              </Link>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
