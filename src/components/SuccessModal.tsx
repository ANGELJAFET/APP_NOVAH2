"use client";

import { Modal } from "./Modal";

interface SuccessModalProps {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export function SuccessModal({ open, title, message, onClose }: SuccessModalProps) {
  return (
    <Modal open={open} title="" onClose={onClose} maxWidthClassName="max-w-sm">
      <div className="flex flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
          <svg viewBox="0 0 20 20" fill="none" className="h-7 w-7 text-emerald-600">
            <path
              d="M5 10.3l3.2 3.2 6.8-6.8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <h2 className="mt-4 text-lg font-semibold text-gray-900">{title}</h2>
        <p className="mt-1 text-sm text-gray-600">{message}</p>
        <button
          type="button"
          onClick={onClose}
          autoFocus
          className="mt-6 w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          Aceptar
        </button>
      </div>
    </Modal>
  );
}
