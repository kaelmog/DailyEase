"use client";
import React from "react";

export default function SectionWrapper({ title, icon: Icon, children }) {
  return (
    <div className="bg-secondary p-4 rounded-lg shadow-inner transition-colors">
      <h2 className="flex items-center text-lg font-bold mb-3 text-accent-primary border-b border-row-hover pb-2">
        {Icon && <Icon className="w-5 h-5 mr-2" />}
        {title === "Metode" ? "Metode Pembayaran" : title === "Kategori" ? "Kategori Penjualan" :
        title === "Summary" ? "Ringkasan" : 
        title === "Internal Notes" ? "Catatan Internal" :
        title === "Sisa" && "Sisa Produk"}
      </h2>
      {children}
    </div>
  );
}
