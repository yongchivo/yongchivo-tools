// Shared types and helpers for the yongchivo-tools Worker.

export interface RateLimiter {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

export interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  RATE_LIMITER: RateLimiter;
  HEADERS_RATE_LIMITER: RateLimiter;
  BREACH_RATE_LIMITER: RateLimiter;
  /** Set via `wrangler secret put BEEHIIV_API_KEY` — never in code. */
  BEEHIIV_API_KEY?: string;
  BEEHIIV_PUBLICATION_ID: string;
}

export const ALLOWED_ORIGINS = new Set([
  'https://tools.yongchivo.com',
  'http://localhost:8787', // wrangler dev
]);

export const VALID_LANGS = new Set(['en', 'es']);

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function json(status: number, body: unknown, origin: string | null): Response {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Vary'] = 'Origin';
  }
  return new Response(JSON.stringify(body), { status, headers });
}

/** Handles the shared preflight + method/origin gate for a POST-only JSON endpoint. */
export function preflightOrReject(request: Request): Response | null {
  const origin = request.headers.get('Origin');
  if (request.method === 'OPTIONS') {
    if (!origin || !ALLOWED_ORIGINS.has(origin)) return new Response(null, { status: 403 });
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
        Vary: 'Origin',
      },
    });
  }
  if (request.method !== 'POST') return json(405, { error: 'method_not_allowed' }, origin);
  // Browser cross-origin calls carry an Origin; same-origin browser calls don't.
  if (origin && !ALLOWED_ORIGINS.has(origin)) return json(403, { error: 'forbidden_origin' }, null);
  return null;
}
