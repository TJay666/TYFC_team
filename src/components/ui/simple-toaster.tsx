"use client";

import * as React from "react";
import { useToast, type Toast } from "@/hooks/use-simple-toast";
import { XCircle, CheckCircle, AlertCircle, AlertTriangle } from "lucide-react";

export function SimpleToaster() {
  const { toasts, removeToast } = useToast();

  if (!toasts.length) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-screen-sm">
      {toasts.map((toast) => (
        <SimpleToast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function SimpleToast({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const bgColor = {
    default: "bg-white",
    success: "bg-green-100",
    error: "bg-red-100",
    warning: "bg-yellow-100",
  }[toast.type];

  const textColor = {
    default: "text-gray-800",
    success: "text-green-800",
    error: "text-red-800",
    warning: "text-yellow-800",
  }[toast.type];
  
  const borderColor = {
    default: "border-gray-200",
    success: "border-green-400",
    error: "border-red-400",
    warning: "border-yellow-400",
  }[toast.type];
  
  const Icon = {
    default: AlertCircle,
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
  }[toast.type];

  return (
    <div
      className={`${bgColor} ${textColor} shadow-lg rounded-lg p-4 min-w-[300px] max-w-md 
      animate-in fade-in slide-in-from-right-5 relative flex items-start border-l-4 ${borderColor}`}
      role="alert"
    >
      <div className="mr-3 flex-shrink-0">
        <Icon className={textColor} size={20} />
      </div>
      <div className="flex-1">
        {toast.title && <h3 className="font-medium text-sm">{toast.title}</h3>}
        <p className="text-sm mt-1">{toast.message}</p>
      </div>
      <button
        onClick={onClose}
        className="ml-1 flex-shrink-0 text-gray-500 hover:text-gray-700"
        aria-label="關閉"
      >
        <XCircle size={16} />
      </button>
    </div>
  );
}
