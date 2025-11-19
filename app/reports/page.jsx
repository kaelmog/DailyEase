'use client';
import { useEffect, useState, useMemo } from 'react';
import { Calendar, Briefcase, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { fetcher } from '@/utils/fetcher';
import { getIndonesianFullDate } from '@/utils/dates';
import { formatIdNumber } from '@/utils/format';
import { Button } from '@headlessui/react';
import Loader from '@/components/ui/loader';

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await fetcher('/api/reports/list');
        if (mounted) setReports(data);
      } catch (e) {
        if (mounted) setErr(e.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  const weeklySummary = useMemo(() => {
    return reports.map((r) => ({
      ...r,
      formatted_date: getIndonesianFullDate(r.report_date),
    }));
  }, [reports]);

  return (
    <div className="min-h-screen px-4 py-6 max-w-md mx-auto bg-primary">
      <header className="flex mb-4 px-2">
        <h1 className="flex-1 text-3xl font-bold text-text-primary">Riwayat Laporan</h1>
        <Link href="/reports/new">
          <Button className="flex-none bg-accent-primary px-3 py-2 hover:bg-btn-primary-hover active:bg-btn-primary-hover rounded-lg">
            Buat Baru
          </Button>
        </Link>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-primary">
          <Loader />
          <span className="text-text-primary">Memuat Data Laporan ....</span>
        </div>
      ) : err ? (
        <p className="text-red-500">{err}</p>
      ) : reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-primary">
          <p>Belum ada laporan.</p>
        </div>
      ) : (
        weeklySummary.map((r) => (
          <div
            key={r.id}
            className="m-2 mb-3 py-2 px-4 rounded-lg bg-secondary text-text-primary active:bg-btn-secondary-hover hover:bg-btn-secondary-hover"
          >
            <Link href={`/reports/view/${r.id}`} className="block flex-1">
              <h1 className="text-3xl font-extrabold mb-1 text-text-secondary">Laporan Closing</h1>

              <div className="flex items-center text-text-secondary text-base mb-6 space-x-2">
                <Calendar className="w-4 h-4 text-accent-primary" />
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
                  <div className="text-3xl font-extrabold text-text-primary">
                    Rp{formatIdNumber(r.total_sales)}
                  </div>
                </div>

                <div className="p-4 bg-primary rounded-xl shadow-md border border-row-hover/50">
                  <div className="flex items-center space-x-3 mb-2">
                    <Briefcase className="w-5 h-5 text-text-primary" />
                    <span className="text-text-primary text-sm font-medium uppercase tracking-wider">
                      Transaksi
                    </span>
                  </div>
                  <div className="text-3xl font-extrabold text-text-primary">
                    {r.transactions ?? 0}
                  </div>
                </div>
              </div>

              {r.notes && (
                <div className="pt-6 border-t border-row-hover">
                  <p className="text-text-secondary text-sm font-semibold mb-2">Catatan:</p>
                  <div className="px-4 py-2 bg-input rounded-lg border border-row-hover max-h-14 overflow-y-auto">
                    <p className="text-text-secondary text-sm italic">{r.notes}</p>
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
