"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetcher } from "@/lib/utils";

const initialPayments = {
  cash: { amount: 0, transactions: 0 },
  qris: { amount: 0, transactions: 0 },
  grabfood: { amount: 0, transactions: 0 },
  gofood: { amount: 0, transactions: 0 },
  debit: { amount: 0, transactions: 0 },
  credit_card: { amount: 0, transactions: 0 },
  transfer: { amount: 0, transactions: 0 },
  voucher: { amount: 0, transactions: 0 },
  transfer_outstanding: { amount: 0, transactions: 0 },
};

const initialSummary = {
  pastry: 0,
  bread: 0,
  daily: 0,
  drink: 0,
  susu_kurma: 0,
  mineral_water: 0,
  fresh_juice: 0,
  susu_uht: 0,
  coffee_spoke: 0,
  pb1: 0,
};

export default function ViewReportPage() {
  const { id } = useParams();
  const router = useRouter();
  const [report, setReport] = useState({
    outlet_name: "The Wheat RS PURI CINERE",
    payments: { ...initialPayments },
    summary_sales: { ...initialSummary },
    leftovers: [],
    notes: "",
  });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const data = await fetcher(`/api/reports/get?id=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (mounted) setReport(data);
      } catch (e) {
        console.error(e);
        if (mounted) setErr(e.message || "Failed to load report");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, [id]);

  if (loading) return <div className="p-4">Loading report...</div>;
  if (err) return <div className="p-4 text-red-500">{err}</div>;
  if (!report) return <div className="p-4">Report not found</div>;

  return (
    <div className="min-h-screen max-w-2xl mx-auto p-4">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sales Report</h1>
        <button
          onClick={() => router.back()}
          className="text-sm text-blue-600 underline"
        >
          Back
        </button>
      </header>

      <section className="space-y-1">
        <div className="text-gray-600 text-sm">{report.report_date}</div>
        <div className="text-lg font-semibold">Rp {report.total_sales}</div>
        <div className="text-sm text-gray-700">
          Transactions: {report.transactions}
        </div>
      </section>

      <hr className="my-4" />

      <section>
        <h2 className="font-semibold mb-2">Category Sales</h2>
        <ul className="space-y-1">
          {Object.entries(report.category_sales || {}).map(([key, val]) => (
            <li key={key} className="flex justify-between">
              <span>{key}</span>
              <span>Rp {val}</span>
            </li>
          ))}
        </ul>
      </section>

      <hr className="my-4" />

      <section>
        <h2 className="font-semibold mb-2">Payments</h2>
        <ul className="space-y-1">
          {Object.entries(report.payments || {}).map(([key, val]) => (
            <li key={key} className="flex justify-between text-sm">
              <span>{key}</span>
              <span>
                Rp {val.amount} ({val.transactions} trx)
              </span>
            </li>
          ))}
        </ul>
      </section>

      <hr className="my-4" />

      <section>
        <h2 className="font-semibold mb-2">Leftovers</h2>
        <ul className="space-y-1 text-sm">
          {report.stock_remaining.leftovers?.map((l) => (
            <li key={l.product_id} className="flex justify-between">
              <span>{l.name}</span>
              <span>{l.quantity_left}</span>
            </li>
          ))}
        </ul>
      </section>

      {report.notes && (
        <>
          <hr className="my-4" />
          <section>
            <h2 className="font-semibold mb-2">Notes</h2>
            <p className="text-sm">{report.notes}</p>
          </section>
        </>
      )}
    </div>
  );
}
