"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetcher } from "@/lib/utils";
import { formatIdNumber } from "@/utils/format";

import {
  DollarSign,
  ShoppingBag,
  Truck,
  ScrollText,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  Receipt,
} from "lucide-react";

// Individual list item (payments / category sales)
const ReportItem = ({ label, value, transactions }) => (
  <li className="flex justify-between items-center py-2 border-b border-row-hover last:border-b-0">
    <span className="capitalize text-text-secondary">
      {label.replace(/_/g, " ")}
    </span>
    <span className="font-semibold text-text-primary text-right">
      Rp{formatIdNumber(value)}
      {transactions !== undefined && transactions > 0 && (
        <span className="block text-xs font-normal text-text-secondary opacity-80">
          ({transactions})
        </span>
      )}
    </span>
  </li>
);

// Generic wrapper for each section
const SectionWrapper = ({ title, icon: Icon, children }) => (
  <div className="bg-secondary p-4 rounded-lg shadow-inner transition-colors">
    <h2 className="flex items-center text-lg font-bold mb-3 text-accent-primary border-b border-row-hover pb-2">
      <Icon className="w-5 h-5 mr-2" />
      {title === "Metode" ? "Metode Pembayaran" : title === "Kategori" ? "Kategori Penjualan" : title === "Sisa" && "Sisa Produk"}
    </h2>
    {children}
  </div>
);

export default function ViewReportPage() {
  const { id } = useParams();
  const router = useRouter();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [activeTab, setActiveTab] = useState("payments");

  // Load report data
  useEffect(() => {
    if (!id) return;
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const data = await fetcher(`/api/reports/get?id=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (mounted) setReport(data);
      } catch (e) {
        if (mounted) setErr(e.message || "Failed to load report");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => (mounted = false);
  }, [id]);

  console.log("CL Data Report => ", report);  

  // Tabs list
  const tabs = useMemo(() => {
    if (!report) return [];

    return [
      {
        id: "payments",
        title: "Metode",
        icon: DollarSign,
        data: report.payments,
        render: (key, val) => (
          <ReportItem
            key={key}
            label={key}
            value={val}
            transactions={val.transactions}
          />
        ),
      },
      {
        id: "sales",
        title: "Kategori",
        icon: ShoppingBag,
        data: report.category_sales,
        render: (key, val) => <ReportItem key={key} label={key} value={val} />,
      },
      {
        id: "leftovers",
        title: "Sisa",
        icon: Truck,
        data: report.stock_remaining?.leftovers || [],
        render: (item) => (
          <li
            key={item.product_id}
            className="flex justify-between items-center py-2 border-b border-row-hover last:border-b-0"
          >
            <span className="capitalize text-text-primary">{item.name}</span>
            <span className="text-lg font-bold text-accent-primary">
              {item.quantity_left} pcs
            </span>
          </li>
        ),
      },
    ];
  }, [report]);

  // LOADING STATE
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-primary">
        <Loader2 className="w-8 h-8 animate-spin text-accent-primary mb-3" />
        <span className="text-text-primary font-medium">
          Loading report data...
        </span>
      </div>
    );

  // ERROR STATE
  if (err)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-primary p-4">
        <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          Error: {err}
        </div>
      </div>
    );

  if (!report)
    return (
      <div className="p-4 bg-primary text-text-primary">Report not found.</div>
    );

    console.log("CL Tabs Data => ", tabs);

  // MAIN UI
  return (
    <div className="min-h-screen text-text-primary">
      <div className="min-h-screen px-4 py-6 max-w-md mx-auto bg-primary">
        {/* Header */}
        <header className="flex items-center justify-between mb-6 pb-4 border-b border-row-hover">
          <button
            onClick={() => router.back()}
            className="text-text-secondary hover:text-accent-primary p-1 rounded transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div className="flex flex-col text-right">
            <h1 className="text-2xl font-extrabold">Sales Report</h1>
            <p className="text-sm text-text-secondary">{report.outlet_name}</p>
          </div>
        </header>

        {/* Summary Cards */}
        <div className="bg-secondary p-5 rounded-xl shadow-lg mb-6">
          <div className="flex items-center mb-3">
            <Receipt className="w-5 h-5 text-accent-secondary mr-2" />
            <h2 className="text-lg font-medium text-text-secondary">
              Summary for {report.report_date}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-row-hover pt-4">
            <div className="p-2 border-b border-row-hover md:border-b-0 md:border-r">
              <p className="text-sm text-text-secondary">Total Sales</p>
              <p className="text-3xl font-extrabold text-accent-primary">
                {formatIdNumber(report.total_sales || 0)}
              </p>
            </div>

            <div className="p-2">
              <p className="text-sm text-text-secondary">Transactions</p>
              <p className="text-3xl font-extrabold text-accent-secondary">
                {report.transactions || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-3 border-b border-row-hover mb-6 overflow-x-auto whitespace-nowrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center py-2 px-3 text-sm font-semibold transition-colors 
                ${
                  activeTab === tab.id
                    ? "border-b-2 border-accent-primary text-accent-primary"
                    : "text-text-secondary hover:text-text-primary"
                }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.title}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tabs.map(
          (tab) =>
            activeTab === tab.id && (
              <SectionWrapper key={tab.id} title={tab.title} icon={tab.icon}>
                <ul className="divide-y divide-row-hover">
                  {Array.isArray(tab.data)
                    ? tab.data.map(tab.render)
                    : Object.entries(tab.data || {}).map(([key, val]) =>
                        tab.render(key, val)
                      )}
                </ul>
              </SectionWrapper>
            )
        )}

        {/* Notes */}
        {report.notes && (
          <div className="mt-6">
            <SectionWrapper title="Internal Notes" icon={ScrollText}>
              <p className="text-sm text-text-primary p-3 bg-input rounded-lg italic">
                {report.notes}
              </p>
            </SectionWrapper>
          </div>
        )}
      </div>
    </div>
  );
}
