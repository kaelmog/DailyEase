"use client";

import { useEffect, useState } from "react";
import { Copy, MessageSquare } from "lucide-react";
import Modal from "@/components/ui/modal";
import Button from "@/components/ui/button";
import {
  generateSalesReportMessage,
  generateLeftoversReportMessage,
} from "@/utils/reports";

export default function ReviewModal({
  open,
  setOpen,
  reportType,
  item,
  salesData,
  productSummary,
  product_categories,
  leftoversByCategory,
}) {
  const [reportText, setReportText] = useState("Loading report...");

  useEffect(() => {
    if (!open) return;

    async function fetchReport() {
      try {
        let text = "";

        if (reportType === "sales") {
          text = generateSalesReportMessage(
            item.date,
            salesData,
            productSummary
          );
        }

        const categoryName = product_categories.map((item) => item.name);

        if (reportType === "leftovers") {
          text = generateLeftoversReportMessage(
            item.date,
            product_categories,
            categoryName,
            leftoversByCategory
          );
        }

        setReportText(text);
      } catch (err) {
        setReportText("⚠️ Failed to generate report: " + err.message);
      }
    }

    fetchReport();
  }, [
    open,
    reportType,
    salesData,
    item,
    productSummary,
    product_categories,
    leftoversByCategory,
  ]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(reportText);
    alert("Pesan berhasil disalin ke clipboard!");
  };

  const handleShare = () => {
    const text = encodeURIComponent(reportText);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  async function handleSave() {
    const user = JSON.parse(localStorage.getItem("user"));
    const res = await fetch("/api/reports/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ form: item, userId: user.id }),
    });
    if (res.ok) alert("Report saved successfully!");
  }

  return (
    <Modal
      title={
        reportType === "sales"
          ? "Review Sales Report"
          : "Review Leftovers Report"
      }
      open={open}
      onClose={() => setOpen(false)}
    >
      <pre className="text-sm text-left text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
        {reportText}
      </pre>

      <div className="mt-5 grid grid-cols-3 gap-4">
        <Button
          onClick={handleCopy}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg h-10"
        >
          <Copy size={16} /> Salin Pesan
        </Button>

        <Button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-medium rounded-lg"
        >
          <MessageSquare size={16} /> Bagikan ke WhatsApp
        </Button>

        <Button
          onClick={handleSave}
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-medium rounded-lg"
        >
          <MessageSquare size={16} /> Simpan
        </Button>
      </div>
    </Modal>
  );
}
