"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ReportForm from "@/components/ReportForm";

export default function EditReportPage() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/reports/get?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setReport(data);
      else console.error("Failed to load report", data.error);
    }
    load();
  }, [id, token]);

  if (!report) return <div>Loading...</div>;

  return <ReportForm existingReport={report} mode="edit" />;
}
