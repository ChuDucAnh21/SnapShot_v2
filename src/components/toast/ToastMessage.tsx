'use client';
import type { JSX, ReactNode } from 'react';
import { createContext, use, useCallback, useEffect, useMemo, useState } from 'react';

// ===================== Types =====================
type ToastType = 'success' | 'error' | 'info' | 'warning';

type ToastOptions = {
  type?: ToastType;
  duration?: number;
};

type Toast = {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
};

type ToastContextValue = {
  showToast: (message: string, opts?: ToastOptions | ToastType) => string;
  remove: (id: string) => void;
};

type ToastProviderProps = {
  children: ReactNode;
};

type ToastItemProps = {
  toast: Toast;
  onClose: () => void;
};

// ===================== Toast Context =====================
const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const context = use(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

/**
 * API:
 * showToast("Thành công!"); // mặc định success, 3s
 * showToast("Có lỗi xảy ra", { type: "error", duration: 4000 });
 * showToast("Đã lưu", "success"); // tương thích kiểu cũ
 * types: "success" | "error" | "info" | "warning"
 */
export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, opts: ToastOptions | ToastType = {}) => {
    // Back-compat: showToast(message, "success")
    const options: ToastOptions = typeof opts === 'string' ? { type: opts } : opts;

    const id = Date.now().toString(36) + Math.random().toString(36).slice(2);
    const toast: Toast = {
      id,
      message,
      type: options.type ?? 'success',
      duration: Math.max(1500, options.duration ?? 3000),
    };
    setToasts(prev => [...prev, toast]);
    return id;
  }, []);

  const value = useMemo(() => ({ showToast, remove }), [showToast, remove]);

  return (
    <ToastContext value={value}>
      {children}

      {/* ===== Toast Stack (Top Right) ===== */}
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-[min(92vw,420px)] flex-col gap-2 md:right-6 md:top-6">
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onClose={() => remove(t.id)} />
        ))}
      </div>

      {/* Keyframes riêng (không cần cấu hình Tailwind) */}
      <style jsx global>
        {`
        @keyframes slideIn {
          0% { transform: translate3d(12px, -8px, 0) scale(0.98); opacity: 0 }
          60% { transform: translate3d(0, 0, 0) scale(1.02); opacity: 1 }
          100% { transform: translate3d(0, 0, 0) scale(1); opacity: 1 }
        }
        @keyframes fadeOut {
          to { transform: translateY(-6px); opacity: 0 }
        }
        @keyframes bar {
          from { transform: scaleX(1) }
          to { transform: scaleX(0) }
        }
      `}
      </style>
    </ToastContext>
  );
};

// ===================== Toast Item =====================
const COLOR: Record<ToastType, string> = {
  success:
    'from-green-500 to-green-600 ring-green-400/40 shadow-green-900/10',
  error:
    'from-rose-500 to-rose-600 ring-rose-400/40 shadow-rose-900/10',
  info:
    'from-sky-500 to-sky-600 ring-sky-400/40 shadow-sky-900/10',
  warning:
    'from-amber-500 to-amber-600 ring-amber-400/40 shadow-amber-900/10',
};

const ICON: Record<ToastType, JSX.Element> = {
  success: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M13 16h-1v-4h-1m1-4h.01" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 9v4m0 4h.01" />
      <path d="m10.29 3.86-8.47 14.14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
    </svg>
  ),
};

function ToastItem({ toast, onClose }: ToastItemProps) {
  const { type, duration, message } = toast;
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setClosing(true);
      const t = setTimeout(onClose, 180); // chờ animation out
      return () => clearTimeout(t);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-auto relative select-none overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b p-3 text-white shadow-lg backdrop-blur-sm ring-1 ${COLOR[type]}`}
      style={{
        animation: `${closing ? 'fadeOut 180ms ease forwards' : 'slideIn 220ms cubic-bezier(.2,.8,.2,1)'}`,
      }}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 opacity-90">{ICON[type]}</div>
        <div className="flex-1 text-sm leading-5">
          {message}
        </div>

        <button
          type="button"
          aria-label="Đóng"
          onClick={() => {
            setClosing(true);
            setTimeout(onClose, 180);
          }}
          className="ml-2 rounded-md/2 p-1 text-white/80 transition hover:scale-105 hover:text-white focus:outline-none"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* progress bar */}
      <div className="absolute inset-x-0 bottom-0 h-1 origin-left bg-white/25">
        <div
          className="h-full origin-left bg-white/80"
          style={{ animation: `bar ${duration}ms linear forwards` }}
        />
      </div>
    </div>
  );
}
