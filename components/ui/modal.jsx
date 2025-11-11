"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { X } from "lucide-react";

export default function Modal({
  title,
  open,
  onClose,
  children,
  className = "",
}) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity data-[closed]:opacity-0" />
      <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <DialogPanel
            className={`relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-[#1c1f24] text-gray-200 border border-gray-700 shadow-xl transition-all data-[closed]:opacity-0 ${className}`}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700">
              <DialogTitle
                as="h3"
                className="text-lg font-semibold text-gray-100"
              >
                {title}
              </DialogTitle>
              <button
                onClick={onClose}
                className="p-2 rounded-md hover:bg-gray-800 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[65vh] overflow-y-auto px-5 py-4 text-sm whitespace-pre-wrap font-mono leading-relaxed">
              {children}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
