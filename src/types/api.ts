// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs

export type ProblemLikeError = {
  status?: 'error' | 'success';
  error_code?: string;
  message?: string;
  details?: unknown;
};

export class ApiError extends Error {
  status?: number;
  code?: string;
  details?: unknown;
  isNetwork?: boolean;
  isRetryable?: boolean;
  constructor(init: Partial<ApiError> & { message: string }) {
    super(init.message);
    Object.assign(this, init);
  }
}

// Generic success envelope returned by backend APIs
export type ApiSuccess<T> = { status: 'success' } & T;

// Common ID aliases for clarity across features
export type LearnerId = string;
export type SubjectId = string;
export type SessionId = string;
export type ActivityId = string;
