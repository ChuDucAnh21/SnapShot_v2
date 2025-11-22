'use client';
import type { JSX } from 'react';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

// =============================
// 🔹 Hook: useProgress
// =============================
type UseProgressOptions = {
  maxBeforeSettle?: number;
  autoHideDelay?: number;
};

type UseProgressReturn = {
  percent: number;
  visible: boolean;
  start: () => void;
  finish: () => void;
  fail: () => void;
  setExternalProgress: (p: number) => void;
};

export function useProgress({
  maxBeforeSettle = 90,
  autoHideDelay = 350,
}: UseProgressOptions = {}): UseProgressReturn {
  const [percent, setPercent] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);

  // intervalRef cho setInterval, timeoutRef cho setTimeout
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const settlingRef = useRef<boolean>(false); // tránh finish() lặp

  const clearTimer = (): void => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const start = useCallback((): void => {
    settlingRef.current = false;
    setVisible(true);
    setPercent(0);
    clearTimer();

    intervalRef.current = setInterval(() => {
      setPercent((p) => {
        const next = p + (maxBeforeSettle - p) * 0.1;
        return Math.min(next, maxBeforeSettle - 0.1);
      });
    }, 120);
  }, [maxBeforeSettle]);

  const finish = useCallback((): void => {
    if (settlingRef.current) {
      return;
    }
    settlingRef.current = true;
    // clear interval nếu đang chạy
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setPercent(100);

    // Đặt timeout để ẩn sau autoHideDelay — LƯU vào timeoutRef để có thể clear từ clearTimer
    timeoutRef.current = setTimeout(() => {
      setVisible(false);
      setPercent(0);
      timeoutRef.current = null;
    }, autoHideDelay);
    // *** Không return cleanup function ở đây (tránh trả về () => clearTimeout(...))
  }, [autoHideDelay]);

  const fail = useCallback((): void => {
    clearTimer();
    settlingRef.current = true;
    setVisible(false);
    setPercent(100);
  }, []);

  const setExternalProgress = useCallback(
    (p: number): void => {
      const clamped = Math.max(0, Math.min(100, p));
      setPercent(clamped);
      if (!visible) {
        setVisible(true);
      }
      if (clamped >= 100) {
        finish();
      }
    },
    [finish, visible],
  );

  // cleanup khi unmount: clear cả interval và timeout
  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, []);

  return { percent, visible, start, finish, fail, setExternalProgress };
}

// =============================
// 🔹 Component: Progress
// =============================
type ProgressProps = {
  percent?: number;
  visible?: boolean;
  colorClass?: string;
};

export function Progress({
  percent = 0,
  visible = false,
  colorClass = 'bg-blue-500',
}: ProgressProps): JSX.Element | null {
  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/90 backdrop-blur-[2px]">
      <Image
        src="/Logo.webp"
        alt="Logo"
        width={90}
        height={20}
        className="w-[90px] mb-[20px]"
      />
      <div className="w-[66%] max-w-[560px] min-w-[240px]">
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className={`h-full ${colorClass} transition-[width] duration-150 ease-in-out`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-3 text-sm text-gray-700 text-center font-medium">
          {Math.round(percent)}
          %
        </p>
      </div>
    </div>
  );
}

// =============================
// 🔹 Tiện ích: fetchWithProgress (giữ nguyên, bạn có thể import từ file khác)
// =============================
export async function fetchWithProgress(
  input: RequestInfo | URL,
  init: RequestInit = {},
  onProgress: (percent: number) => void = () => {},
): Promise<Response> {
  const res = await fetch(input, init);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const contentLength = res.headers.get('Content-Length');
  if (!res.body) {
    onProgress(100);
    return res;
  }

  const total = contentLength ? Number.parseInt(contentLength, 10) : Number.NaN;
  const reader = res.body.getReader();
  let loaded = 0;
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    if (value) {
      chunks.push(value);
      loaded += value.byteLength;

      if (Number.isFinite(total)) {
        const percent = Math.min((loaded / total) * 100, 100);
        onProgress(percent);
      } else {
        onProgress(Math.min(90, 10 + Math.log10(1 + loaded / 1024) * 20));
      }
    }
  }

  onProgress(100);

  const combined = new Uint8Array(loaded);
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.byteLength;
  }

  const body = new Blob([combined]);
  const finalRes = new Response(body, {
    status: res.status,
    statusText: res.statusText,
    headers: res.headers,
  });

  return finalRes;
}
