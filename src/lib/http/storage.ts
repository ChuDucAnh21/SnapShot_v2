// Rules applied: ts/consistent-type-definitions:type, style/brace-style:1tbs

export type TokenLocation = 'local' | 'session' | 'memory';

let memToken: string | null = null;

export const tokenStorage = {
  get() {
    if (memToken) {
      return memToken;
    }
    if (typeof window !== 'undefined') {
      return localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    }
    return null;
  },
  set(token: string | null, where: TokenLocation = 'local') {
    memToken = token;
    if (typeof window === 'undefined') {
      return;
    }
    if (where === 'local') {
      if (token) {
        localStorage.setItem('access_token', token);
      } else {
        localStorage.removeItem('access_token');
      }
      sessionStorage.removeItem('access_token');
    } else if (where === 'session') {
      if (token) {
        sessionStorage.setItem('access_token', token);
      } else {
        sessionStorage.removeItem('access_token');
      }
      localStorage.removeItem('access_token');
    }
  },
  clear() {
    this.set(null);
  },
};
