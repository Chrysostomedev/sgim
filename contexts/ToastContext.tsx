"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import Toast from "@/components/ui/Toast";

interface ToastContextType {
  toast: (message: string, type?: "success" | "error") => void;
  success: (message: string) => void;
  error: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

interface ToastItem {
  id: number;
  message: string;
  type: "success" | "error";
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const value = {
    toast: showToast,
    success: (msg: string) => showToast(msg, "success"),
    error: (msg: string) => showToast(msg, "error"),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toasts.map((t) => (
        <Toast key={t.id} message={t.message} type={t.type} />
      ))}
    </ToastContext.Provider>
  );
}
