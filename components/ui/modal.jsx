"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { X } from "lucide-react";

export default function Modal({ open = false, title, children, onClose }) {
  if (!open) return null;
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50  text-text-primary">
      <DialogBackdrop className="fixed inset-0 bg-secondary/60 backdrop-blur-sm transition-opacity data-closed:opacity-0" />
      <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <DialogPanel
            className={`relative w-full px-4 py-6 max-w-md mx-auto transform overflow-hidden rounded-2xl bg-primary border border-accent-primary shadow-xl transition-all data-closed:opacity-0 text-text-primary`}
          >
            <div className="flex items-center justify-between px-5 py-1 border-b border-accent-primary">
              <DialogTitle
                as="h3"
                className="text-lg font-semibold"
              >
                {title}
              </DialogTitle>
              <button
                onClick={onClose}
                className="p-2 rounded-md hover:bg-secondary-primary transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[65vh] overflow-y-auto px-5 py-4 text-sm whitespace-pre-wrap font-mono leading-relaxed text-text-primary">
              {children}
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
