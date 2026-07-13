"use client";

import { MouseEvent, ReactNode } from "react";

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  maxWidthClassName?: string;
}

export function Modal({ open, title, onClose, children, maxWidthClassName = "max-w-lg" }: ModalProps) {
  if (!open) {
    return null;
  }

  function stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className={`w-full ${maxWidthClassName} rounded-lg bg-white p-6 shadow-lg`}
        onClick={stopPropagation}
      >
        <h2 className="mb-4 text-lg font-semibold">{title}</h2>
        {children}
      </div>
    </div>
  );
}
