"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import ReviewModal from "./ReviewModal";
import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import { formatIdNumber, pretty } from "@/utils/format";
import { cleanNumericString } from "@/utils/numbers";
import { getIndonesianFullDate } from "@/utils/dates";
import { Loader2, ArrowLeft } from "lucide-react";

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

export default function ReportForm({ existingReport, mode = "create" }) {
  const { products, categories, loading } = useSupabaseData();
  const [alertState, setAlertState] = useState(null);
  const router = useRouter();
  const [form, setForm] = useState(
    existingReport
      ? {
          ...existingReport,
          date: getIndonesianFullDate(),
          outlet_name: "The Wheat RS PURI CINERE",
          payments: existingReport.payments || { ...initialPayments },
          summary_sales: existingReport.summary_sales || { ...initialSummary },
          leftovers: existingReport.leftovers || [],
        }
      : {
          date: getIndonesianFullDate(),
          outlet_name: "The Wheat RS PURI CINERE",
          payments: { ...initialPayments },
          summary_sales: { ...initialSummary },
          leftovers: [],
          notes: "",
        }
  );

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewType, setReviewType] = useState(null);

  const openReviewModal = (type) => {
    setReviewType(type);
    setIsReviewOpen(true);
  };

  useEffect(() => {
    if (!loading && products?.length) {
      const leftovers = products.map((p) => ({
        product_id: p.id,
        name: p.name,
        quantity_left: 0,
        product_category: p.product_categories
          ? {
              id: p.product_categories.id,
              name: p.product_categories.name,
            }
          : { id: null, name: "Uncategorized" },
      }));

      queueMicrotask(() => {
        setForm((prev) => ({ ...prev, leftovers }));
      });
    }
  }, [loading, products]);

  const leftoversByCategory = useMemo(() => {
    const prodById = {};
    products.forEach((p) => (prodById[p.id] = p));
    const grouped = {};
    (form.leftovers || []).forEach((l) => {
      const p = prodById[l.product_id];
      const cat = p?.product_categories?.name || "Uncategorized";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push({ ...l, name: p?.name || "Unknown" });
    });
    return grouped;
  }, [form.leftovers, products]);

  const totalSales = useMemo(() => {
    const payments = form?.payments || {};
    return Object.values(payments).reduce(
      (acc, p) => acc + (Number(p.amount) || 0),
      0
    );
  }, [form.payments]);

  const totalTransactions = useMemo(() => {
    const payments = form?.payments || {};
    return Object.values(payments).reduce(
      (acc, p) => acc + (Number(p.transactions) || 0),
      0
    );
  }, [form.payments]);

  const handlePaymentAmountChange = useCallback((key, value) => {
    const num = cleanNumericString(value);
    setForm((prev) => ({
      ...prev,
      payments: {
        ...prev.payments,
        [key]: { ...prev.payments[key], amount: num },
      },
    }));
  }, []);

  const handlePaymentTransChange = useCallback((key, value) => {
    const num = cleanNumericString(value);
    setForm((prev) => ({
      ...prev,
      payments: {
        ...prev.payments,
        [key]: { ...prev.payments[key], transactions: num },
      },
    }));
  }, []);

  const handleSummaryChange = useCallback((key, value) => {
    const num = cleanNumericString(value);
    setForm((prev) => ({
      ...prev,
      summary_sales: { ...prev.summary_sales, [key]: num },
    }));
  }, []);

  function updateLeftover(productId, qty) {
    setForm((prev) => {
      const arr = (prev.leftovers || []).map((l) =>
        l.product_id === productId ? { ...l, quantity_left: Number(qty) } : l
      );
      return { ...prev, leftovers: arr };
    });
  }

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const endpoint =
      mode === "edit" ? "/api/reports/update" : "/api/reports/create";

    const payload = mode === "edit" ? { id: form.id, updates: form } : form;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setAlertState({
          type: "success",
          message: mode === "edit" ? "Report updated!" : "Report created!",
        });
      } else {
        setAlertState({
          type: "error",
          message: data.error || "Failed to save report",
        });
      }
    } catch (e) {
      console.error("Submit error:", e);
      setAlertState({
        type: "error",
        message: e.message || "Unexpected error occurred.",
      });
    }
  };

  return (
    <div
      className="min-h-screen px-4 py-6 max-w-md mx-auto bg-primary"
    >
      <header className="mb-4 animate-fade-in flex space-between">
        <div className="flex-none w-10%">
          <button
                    onClick={() => router.back()}
                    className="text-text-primary hover:text-accent-primary p-1 rounded transition-colors shrink-0"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>
        </div>
        <div className="flex-1 w-90% flex-nowrap">
          <h1 className="text-2xl font-bold animate-slide-in-left text-right">
          {pretty(form.outlet_name)}
        </h1>
        <p
          className="text-sm mt-1 text-right"
        >
          {form.date}
        </p>
        </div>
      </header>

      {alertState && (
        <div
          className={`mb-4 p-3 rounded font-medium` + (alertState.type === "success" ? "bg-status-success" : "bg-status-error")}
        >
          {alertState.message}
        </div>
      )}

      <section className="mb-6 animate-fade-in-up">
        <h2 className="font-semibold text-lg mb-3 animate-slide-in-left">
          Sales Report Closing
        </h2>
        <div className="space-y-3">
          {Object.keys(form.payments).map((key, idx) => (
            <div key={key} className="flex items-center gap-2 justify-between">
              <span className="flex-1 text-sm">
                {idx + 1}. {pretty(key)}
              </span>
              <div className="flex flex-wrap gap-1 w-[50%] max-w-[200px]">
                <div className="w-[200px] h-10 flex  bg-accent-primary rounded-lg pr-2 text-text-secondary items-center justify-center">
                  <span className="flex items-center justify-center text-sm mr-1 h-full w-16 bg-accent-secondary rounded-lg font-bold">Rp</span>
                  <input
                    inputMode="numeric"
                    value={formatIdNumber(
                      form.payments[key].amount ? form.payments[key].amount : ""
                    )}
                    onFocus={(e) => {
                      if (e.target.value === "0") e.target.value = "";
                    }}
                    onBlur={(e) => {
                      if (e.target.value === "")
                        handlePaymentAmountChange(key, 0);
                    }}
                    onChange={(e) =>
                      handlePaymentAmountChange(key, e.target.value)
                    }
                    className="w-full bg-transparent text-right text-sm outline-none text-text-primary font-semibold"
                  />
                </div>
                <div className="w-[200px] h-10 flex  bg-accent-primary rounded-lg pr-2 text-text-secondary items-center justify-center">
                  <span className="flex items-center justify-center text-sm mr-1 h-full w-16 bg-accent-secondary rounded-lg font-bold">Trx</span>
                  <input
                    inputMode="numeric"
                    value={formatIdNumber(
                      form.payments[key].transactions
                        ? form.payments[key].transactions
                        : ""
                    )}
                    onFocus={(e) => {
                      if (e.target.value === "0") e.target.value = "";
                    }}
                    onBlur={(e) => {
                      if (e.target.value === "")
                        handlePaymentAmountChange(key, 0);
                    }}
                    onChange={(e) =>
                      handlePaymentTransChange(key, e.target.value)
                    }
                    placeholder="0"
                    className="w-full bg-transparent text-right text-sm outline-none text-text-primary font-semibold"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-4 pr-3 rounded-lg flex items-center justify-between shadow-sm bg-accent-primary h-10"
        >
          <span className="flex items-center justify-center h-full w-24 bg-accent-secondary rounded-lg text-text-secondary font-bold">Total</span>
          <span className="font-bold">
            Rp {formatIdNumber(totalSales)} / {totalTransactions} transaksi
          </span>
        </div>
      </section>

      <section className="mb-6 animate-fade-in-up">
        <h2 className="font-semibold text-lg mb-3 animate-slide-in-left">
          Sales Report Produk
        </h2>
        <div className="space-y-3">
          {Object.keys(form.summary_sales).map((key) => (
            <div key={key} className="flex items-center justify-between gap-3">
              <label className="flex-1 text-sm">{pretty(key)}</label>
              <div className="w-[200px] h-10 flex  bg-accent-primary rounded-lg pr-2 text-text-secondary items-center justify-center">
                  <span className="flex items-center justify-center text-sm mr-1 h-full w-16 bg-accent-secondary rounded-lg font-bold">Rp</span>
                <input
                  inputMode="numeric"
                  value={formatIdNumber(form.summary_sales[key])}
                  onFocus={(e) => {
                    if (e.target.value === "0") e.target.value = "";
                  }}
                  onBlur={(e) => {
                    if (e.target.value === "")
                      handlePaymentAmountChange(key, 0);
                  }}
                  onChange={(e) => handleSummaryChange(key, e.target.value)}
                  className="w-full bg-transparent text-right text-sm outline-none"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6 animate-fade-in-up">
        <h2 className="font-semibold text-lg mb-3 animate-slide-in-left">
          Sisa Produk
        </h2>
        {loading ? (
          <div className="flex items-center justify-center gap-2 text-sm text-text-primary">
            <Loader2 className="w-8 h-8 animate-spin text-accent-primary mb-3" />
            <span className="text-text-primary">Memuat data produk ....</span>
          </div>
        ) : (
          categories
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((cat) => {
              const items = leftoversByCategory[cat.name];
              if (!items) return null;
              return (
                <Disclosure key={cat.name} as="div" className="mb-3">
                  {({ open }) => (
                    <>
                      <Disclosure.Button
                        className="flex justify-between items-center w-full px-2 py-1 rounded-md text-sm font-semibold animate-slide-in-left bg-accent-primary text-text-primary"
                      >
                        {cat.name}
                        <ChevronUpIcon
                          className={`w-5 h-5 transform transition-transform duration-200 ${
                            open ? "rotate-180" : ""
                          }`}
                        />
                      </Disclosure.Button>

                      <Disclosure.Panel className="mt-2 space-y-2">
                        {items.map((it) => (
                          <div
                            key={it.product_id}
                            className="flex items-center justify-between gap-3"
                          >
                            <span className="flex-1 truncate text-sm">
                              {it.name}
                            </span>

                            <div
                              className="flex items-center border rounded-lg overflow-hidden bg-input"
                            >
                              <button
                                className="px-3 py-2 text-lg font-semibold bg-accent-secondary text-text-secondary"
                                onClick={() =>
                                  updateLeftover(
                                    it.product_id,
                                    Math.max(0, it.quantity_left - 1)
                                  )
                                }
                              >
                                –
                              </button>

                              <input
                                type="number"
                                value={it.quantity_left}
                                onFocus={(e) => {
                                  if (e.target.value === "0")
                                    e.target.value = "";
                                }}
                                onBlur={(e) => {
                                  if (e.target.value === "")
                                    updateLeftover(it.product_id, 0);
                                }}
                                onChange={(e) =>
                                  updateLeftover(
                                    it.product_id,
                                    Number(e.target.value)
                                  )
                                }
                                className="w-16 h-10 text-center text-sm bg-transparent border-none outline-none leading-10 text-text-secondary font-semibold"
                              />

                              <button
                                className="px-3 py-2 text-lg font-semibold bg-accent-secondary text-text-secondary"
                                onClick={() =>
                                  updateLeftover(
                                    it.product_id,
                                    Number(it.quantity_left || 0) + 1
                                  )
                                }
                              >
                                +
                              </button>
                            </div>
                          </div>
                        ))}
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              );
            })
        )}
      </section>

      <section className="mb-4 animate-fade-in-up">
        <label className="block font-bold mb-2">Notes</label>
        <textarea
          value={form.notes}
          onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
          className="w-full min-h-[72px] rounded-md px-3 py-2 text-sm bg-input text-text-secondary"
          placeholder="Optional notes..."
        />
      </section>

      {form && (
        <section className="flex flex-col sm:flex-row gap-3 justify-center items-stretch animate-fade-in-up">
          <button
            onClick={() => openReviewModal("sales")}
            className="px-4 py-2 bg-accent-primary hover:bg-btn-primary-hover text-text-primary rounded-md"
          >
            Preview Sales Report
          </button>

          <button
            onClick={() => openReviewModal("leftovers")}
            className="px-4 py-2 bg-accent-primary hover:bg-btn-primary-hover text-text-primary rounded-md"
          >
            Preview Leftovers
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
          >
            Submit Report
          </button>

          <ReviewModal
            open={isReviewOpen}
            setOpen={setIsReviewOpen}
            reportType={reviewType}
            item={form}
            salesData={form.payments}
            productSummary={form.summary_sales}
            product_categories={categories}
            leftoversByCategory={leftoversByCategory}
          />
        </section>
      )}

      <footer
        className="mt-6 text-center text-xs"
      >
        Made with love for Ayuni 💖
      </footer>
    </div>
  );
}
