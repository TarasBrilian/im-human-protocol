"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type = "success",
  onClose,
  duration = 5000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: "bg-gradient-to-br from-[#1a1a1a] to-black border-2 border-[#c41e3a]",
    error: "bg-gradient-to-br from-[#1a1a1a] to-black border-2 border-[#8b0000]",
    info: "bg-gradient-to-br from-[#1a1a1a] to-black border-2 border-[#d4af37]",
  }[type];

  const iconColor = {
    success: "text-[#c41e3a]",
    error: "text-[#8b0000]",
    info: "text-[#d4af37]",
  }[type];

  const icon = {
    success: (
      <svg
        className={`h-6 w-6 ${iconColor}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
    error: (
      <svg
        className={`h-6 w-6 ${iconColor}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
    info: (
      <svg
        className={`h-6 w-6 ${iconColor}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  }[type];

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div
        className={`${bgColor} rounded-lg shadow-2xl shadow-${iconColor.replace('text-', 'bg-')}/30 px-6 py-4 flex items-center gap-3 min-w-[300px] max-w-md backdrop-blur-sm`}
      >
        <div className="flex-shrink-0">{icon}</div>
        <p className="text-gray-100 font-medium flex-1">{message}</p>
        <button
          onClick={onClose}
          className={`flex-shrink-0 ${iconColor} hover:opacity-70 transition-opacity`}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}