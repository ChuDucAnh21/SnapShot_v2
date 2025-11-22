/**
 * Telemetry batching và queue management
 * - Batch events mỗi 5-10s hoặc khi đủ N events
 * - Exponential backoff khi lỗi
 * - TTL rõ ràng cho events
 */

import type { TelemetryEvent } from './protocol';

const queue: TelemetryEvent[] = [];
let timer: NodeJS.Timeout | null = null;
let retryCount = 0;

const FLUSH_EVERY_MS = 8000; // 8 seconds
const MAX_BATCH = 50;
const MAX_RETRY = 3;
const BASE_RETRY_DELAY = 1000; // 1 second

/**
 * Push event vào queue
 */
export function pushTelemetry(evt: TelemetryEvent): void {
  queue.push({
    ...evt,
    ts: Date.now(),
  } as TelemetryEvent & { ts: number });

  // Flush ngay nếu đạt max batch
  if (queue.length >= MAX_BATCH) {
    void flushTelemetry();
    return;
  }

  // Set timer nếu chưa có
  if (!timer) {
    timer = setTimeout(() => {
      void flushTelemetry();
    }, FLUSH_EVERY_MS);
  }
}

/**
 * Flush queue lên server
 */
export async function flushTelemetry(): Promise<void> {
  if (queue.length === 0) {
    return;
  }

  const batch = queue.splice(0, MAX_BATCH);

  if (timer) {
    clearTimeout(timer);
    timer = null;
  }

  try {
    const response = await fetch('/api/game-hub/telemetry/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ events: batch }),
    });

    if (!response.ok) {
      throw new Error(`Telemetry failed: ${response.status}`);
    }

    // Reset retry count on success
    retryCount = 0;
  } catch (error) {
    console.error('Failed to flush telemetry:', error);

    // Retry với exponential backoff
    if (retryCount < MAX_RETRY) {
      retryCount++;
      const delay = BASE_RETRY_DELAY * 2 ** (retryCount - 1);

      // Push events back vào queue
      queue.unshift(...batch);

      // Retry sau delay
      setTimeout(() => {
        void flushTelemetry();
      }, delay);
    } else {
      // Drop events sau khi retry hết
      console.warn(`Dropped ${batch.length} telemetry events after ${MAX_RETRY} retries`);
      retryCount = 0;
    }
  }
}

/**
 * Clear queue và timer (dùng khi unmount)
 */
export function clearTelemetry(): void {
  queue.length = 0;
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
  retryCount = 0;
}

/**
 * Get queue size (cho debugging)
 */
export function getTelemetryQueueSize(): number {
  return queue.length;
}
