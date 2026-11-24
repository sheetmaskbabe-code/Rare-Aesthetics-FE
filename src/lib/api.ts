/**
 * Centralized API configuration and URL builder for Rare Aesthetics Frontend
 */

const rawBase = (import.meta.env.VITE_API_URL as string | undefined) || '';
export const API_BASE_URL = rawBase.replace(/\/$/, '');

/**
 * Build the full API URL based on VITE_API_URL environment variable.
 * - In local dev with VITE_API_URL=http://localhost:5000: returns http://localhost:5000/api/...
 * - In production or with proxy: returns /api/... if VITE_API_URL is unset, or https://backend.domain.com/api/...
 */
export function apiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${cleanPath}` : cleanPath;
}

export function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(apiUrl(path), init);
}
