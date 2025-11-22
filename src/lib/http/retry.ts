// Rules applied: style/brace-style:1tbs

import type { AxiosInstance } from 'axios';
import axiosRetry, { isNetworkError } from 'axios-retry';

export function attachRetry(client: AxiosInstance) {
  axiosRetry(client, {
    retries: 3,
    retryDelay: (retryCount, error) => {
      const ra = error.response?.headers?.['retry-after'];
      if (ra) {
        const sec = Number(ra);
        if (!Number.isNaN(sec)) {
          return sec * 1000;
        }
      }
      const base = 2 ** retryCount * 100; // 100, 200, 400
      const jitter = Math.random() * 100;
      return base + jitter;
    },
    retryCondition: (error) => {
      const s = error.response?.status;
      return isNetworkError(error) || (s !== undefined && [408, 429, 500, 502, 503, 504].includes(s));
    },
  });
}
