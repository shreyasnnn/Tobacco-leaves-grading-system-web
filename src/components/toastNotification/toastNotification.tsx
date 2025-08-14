// src/components/Toast.tsx
import React, { useEffect } from "react";

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export const ToastNotification: React.FC<ToastProps> = ({ message, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-3 animate-fadeIn">
      <span>{message}</span>
      <button
        onClick={onClose}
        className="bg-green-800 px-2 py-1 rounded hover:bg-green-900 transition"
      >
        ✕
      </button>
    </div>
  );
};
