// Rules applied: style/brace-style:1tbs, ts/consistent-type-definitions:type
'use client';

import type { AxiosInstance } from 'axios';
import axios from 'axios';
import { ApiError } from '@/types/api';
import { attachRetry } from './retry';

const CATALOG_API_BASE_URL = 'https://iruka-learning-api-1037337851453.asia-southeast1.run.app';

function toApiError(err: any): ApiError {
  const status = err.response?.status;
  const payload = err.response?.data;
  const hasAxiosNetworkCode = !!err.code && ['ECONNABORTED'].includes(err.code);
  const isNetwork = hasAxiosNetworkCode || !err.response;
  const errorMessage = payload?.detail || payload?.message || err.message || 'Request failed';
  return new ApiError({
    message: errorMessage,
    status,
    code: payload?.error_code,
    details: payload?.details,
    isNetwork,
    isRetryable: isNetwork || (status ? [408, 429, 500, 502, 503, 504].includes(status) : false),
  });
}

export function createCatalogApiClient(baseURL = CATALOG_API_BASE_URL, timeout = 20_000): AxiosInstance {
  const client = axios.create({ baseURL, timeout, withCredentials: false });
  attachRetry(client);

  client.interceptors.response.use(
    (res) => {
      const d = res.data;
      if (d && typeof d === 'object' && d.status === 'error') {
        throw new ApiError({
          message: d.message || 'Request error',
          status: res.status,
          code: d.error_code,
          details: d.details,
        });
      }
      return res;
    },
    (err) => {
      throw toApiError(err);
    },
  );

  return client;
}

export const catalogApi = createCatalogApiClient();
