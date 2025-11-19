"use client";

import { useEffect, useState } from "react";
import { fetcher } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { formatIdNumber } from "@/utils/format";
import { Loader } from "lucide-react";

export default function ReportHistoryPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const data = await fetcher("/api/reports/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReports(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading history:", err);
        setError(err.message || "Failed to load history");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);
  if (loading) return <div className="flex flex-col items-center justify-center min-h-screen bg-primary">
          <Loader />
          <span className="text-text-primary">Memuat Data Laporan ....</span>
        </div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-center">📜 Report History</h1>
      </header>

      {reports.length === 0 ? (
        <div className="text-center text-gray-500 mt-6">
          No reports have been created yet.
        </div>
      ) : (
        <ul className="space-y-3">
          {reports.map((r) => (
            <li
              key={r.id}
              className="border p-3 rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer"
              onClick={() => router.push(`/reports/edit/${r.id}`)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">{r.report_date}</div>
                  <div className="text-sm text-gray-500">
                    Rp {formatIdNumber(r.total_sales ?? 0)}
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  {new Date(r.created_at).toLocaleString("id-ID")}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
