"use client";

import * as React from "react";
import { createContext, useState, useCallback, useContext } from "react";

export type ToastType = "default" | "success" | "error" | "warning";

export interface Toast {
  id: string;
  title?: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// 客戶端元件外部標記
const ClientToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast = { ...toast, id };
      
      setToasts((prev) => [...prev, newToast]);

      // 自動移除 toast
      if (toast.duration !== 0) {
        setTimeout(() => {
          removeToast(id);
        }, toast.duration || 5000);
      }
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);
  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

// 通過函數包裝元件來模擬導出的 ToastProvider
// 使用 dynamic import 來確保 ToastProvider 只在客戶端渲染
export function ToastProvider({ children }: { children: React.ReactNode }) {
  // 檢測是否在客戶端環境
  const isClient = typeof window !== 'undefined';
  const [isMounted, setIsMounted] = React.useState(isClient);
  
  React.useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // 在服務器端渲染時只返回 children，避免水合錯誤
  if (!isMounted) {
    // 使用一個空的上下文提供者，這樣在服務器端渲染時不會發生崩潰
    return (
      <ToastContext.Provider 
        value={{ 
          toasts: [], 
          addToast: () => {}, 
          removeToast: () => {} 
        }}
      >
        {children}
      </ToastContext.Provider>
    );
  }
  
  return <ClientToastProvider>{children}</ClientToastProvider>;
}

export function useToast() {
  // 在服務器端渲染時返回虛擬上下文，避免錯誤
  if (typeof window === 'undefined') {
    return {
      toasts: [],
      addToast: () => {},
      removeToast: () => {}
    };
  }
  
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
