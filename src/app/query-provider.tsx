// Rules applied: style/brace-style:1tbs
'use client';

import type { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000, // 1m default; tune per feature
            gcTime: 5 * 60_000, // 5m cache
            retry: 1, // light retry at RQ layer; axios-retry already handles network/5xx
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 0, // avoid double retry on non-idempotent ops
          },
        },
      }),
  );
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
