"use client";
import { useEffect, useState, useMemo } from "react";
import { Briefcase, CreditCard, Loader2 } from "lucide-react";
import Button from "@/components/ui/button";
import Link from "next/link";
import { formatIdNumber } from "@/utils/format";
import { getIndonesianFullDate } from "@/utils/dates";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const token = null;

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
    return reports.map((r) => ({
      ...r,
      formatted_date: getIndonesianFullDate(r.report_date),
    }));
  }, [reports]);

  return (
    <div className="min-h-screen px-4 py-6 max-w-md mx-auto bg-primary">
      <header className="flex mb-4 justify-between items-center">
        <h1 className="text-3xl font-bold text-text-primary text-center">
          Riwayat Laporan
        </h1>
        <Link href="/reports/new">
        <Button
                  className="flex items-center justify-center gap-2 bg-accent-primary hover:bg-btn-primary-hover text-white font-medium rounded-lg"
                >
          Buat Baru
                </Button>
          </Link>
      </header>

      {loading ? (
        
                
                      <div className="flex flex-col items-center justify-center min-h-screen bg-primary">
                        <Loader2 className="w-8 h-8 animate-spin text-accent-primary mb-3" />
                        <span className="text-text-primary font-medium">
                          Memuat data laporan ....
                        </span>
                      </div>
      ) : err ? (
        <p className="text-red-500">{err}</p>
      ) : reports.length === 0 ? (
        <p>No reports yet.</p>
      ) : (
        weeklySummary.map((r) => (
          <div
            key={r.id}
            className="m-2 py-4 px-4 rounded-lg bg-secondary text-text-primary"
          >
            <Link href={`/reports/view/${r.id}`} className="block flex-1">
              <h1 className="text-3xl font-extrabold mb-1 text-text-secondary text-center">
                Laporan Closing
              </h1>

              <div className="flex items-center text-text-secondary mb-6 space-x-2 w-full justify-center">
                <span>{r.formatted_date}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-primary rounded-xl shadow-md border border-row-hover/50">
                  <div className="flex items-center space-x-3 mb-2">
                    <CreditCard className="w-5 h-5 text-text-primary" />
                    <span className="text-text-primary text-sm font-medium uppercase tracking-wider">
                      Penjualan
                    </span>
                  </div>
                  <div className="text-md font-extrabold text-text-primary">
                    Rp{formatIdNumber(r.total_sales ?? 0)}
                  </div>
                </div>

                <div className="p-4 bg-primary rounded-xl shadow-md border border-row-hover/50">
                  <div className="flex items-center space-x-3 mb-2">
                    <Briefcase className="w-5 h-5 text-text-primary" />
                    <span className="text-text-primary text-sm font-medium uppercase tracking-wider">
                      Transaksi
                    </span>
                  </div>
                  <div className="text-md font-extrabold text-text-primary">
                    {r.transactions ?? 0}
                  </div>
                </div>
              </div>

              {r.notes && (
                <div className="pt-6 border-t border-row-hover">
                  <p className="text-text-secondary text-sm font-semibold mb-2">
                    Catatan Internal:
                  </p>
                  <div className="px-4 py-2 bg-input rounded-lg border border-row-hover max-h-20 overflow-y-auto">
                    <p className="text-text-secondary text-sm italic">
                      {r.notes}
                    </p>
                  </div>
                </div>
              )}
            </Link>
          </div>
        ))
      )}
    </div>
  );
}
