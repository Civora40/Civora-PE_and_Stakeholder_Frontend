/**
 * Civora Unified Backend API Client Bridge (`lib/api/backend-client.ts`).
 * Connects Next.js Route Handlers and Server Components to the Django REST Framework
 * backend at `CIVORA_BACKEND_URL` (default `http://127.0.0.1:8000/api/v1`),
 * with automatic correlation headers and graceful offline fallback.
 */

export const CIVORA_BACKEND_URL =
  process.env.CIVORA_BACKEND_URL ||
  process.env.NEXT_PUBLIC_BACKEND_API_URL ||
  'https://civora-backend-api.onrender.com/api/v1';

export interface BackendResponse<T = unknown> {
  ok: boolean;
  status: number;
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
  unreachable?: boolean;
}

export async function fetchBackend<T = unknown>(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
    body?: unknown;
    accessToken?: string;
    organizationId?: string;
    timeoutMs?: number;
  } = {}
): Promise<BackendResponse<T>> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${CIVORA_BACKEND_URL.replace(/\/$/, '')}${cleanEndpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (options.accessToken) {
    headers['Authorization'] = `Bearer ${options.accessToken}`;
  }
  if (options.organizationId) {
    headers['X-Organization-ID'] = options.organizationId;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? 15000);

  try {
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(timer);
    const json = await response.json().catch(() => ({}));

    return {
      ok: response.ok && Boolean(json.success ?? response.ok),
      status: response.status,
      success: Boolean(json.success ?? response.ok),
      data: json.data as T,
      message: json.message,
      error: json.error,
    };
  } catch {
    clearTimeout(timer);
    return {
      ok: false,
      status: 503,
      success: false,
      unreachable: true,
    };
  }
}

