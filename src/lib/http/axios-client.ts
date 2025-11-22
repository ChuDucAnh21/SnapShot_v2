// Rules applied: style/brace-style:1tbs, ts/consistent-type-definitions:type
'use client';

import type { AxiosInstance, AxiosRequestHeaders } from 'axios';
import axios from 'axios';
import { useAuthStore } from '@/lib/auth/auth-store';
import { ApiError } from '@/types/api';
import { attachRetry } from './retry';
import { tokenStorage } from './storage';

function toApiError(err: any): ApiError {
  const status = err.response?.status;
  const payload = err.response?.data;
  const hasAxiosNetworkCode = !!err.code && ['ECONNABORTED'].includes(err.code);
  const isNetwork = hasAxiosNetworkCode || !err.response;
  // Check for detail field (used in 401 responses) or message field
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

export function createAxiosClient(
  baseURL = (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'), // process.env.NEXT_PUBLIC_API_BASE_URL
  prefix = '/api/v1',
  timeout = Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS) || 20_000,
): AxiosInstance {
  const client = axios.create({ baseURL: `${baseURL}${prefix}`, timeout, withCredentials: false });
  attachRetry(client);

  client.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken || tokenStorage.get();
    if (token) {
      config.headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      } as AxiosRequestHeaders;
    }
    return config;
  });

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
      const status = err.response?.status;
      if (status === 401) {
        tokenStorage.clear();
        useAuthStore.getState().setAccessToken(null);
        useAuthStore.getState().setUser(null);
      }
      throw toApiError(err);
    },
  );

  return client;
}

export const api = createAxiosClient();
export const apiWithoutPrefix = createAxiosClient(process.env.NEXT_PUBLIC_API_BASE_URL, '', 20_000);
