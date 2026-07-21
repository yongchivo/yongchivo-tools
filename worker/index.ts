// Worker entry: serves the static site from assets and handles
// POST /api/subscribe as a secure proxy to Beehiiv (API key stays server-side).

interface RateLimiter {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  RATE_LIMITER: RateLimiter;
  /** Set via `wrangler secret put BEEHIIV_API_KEY` — never in code. */
  BEEHIIV_API_KEY?: string;
  BEEHIIV_PUBLICATION_ID: string;
}

const ALLOWED_ORIGINS = new Set([
  'https://tools.yongchivo.com',
  'http://localhost:8787', // wrangler dev
]);

// Mirrors RoleId in src/data/quiz.ts.
const VALID_ROLES = new Set(['pt', 'soc', 'df', 'se', 'grc']);
const VALID_LANGS = new Set(['en', 'es']);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function json(status: number, body: unknown, origin: string | null): Response {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Vary'] = 'Origin';
  }
  return new Response(JSON.stringify(body), { status, headers });
}

async function handleSubscribe(request: Request, env: Env): Promise<Response> {
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

  // Browser requests are same-origin (no CORS needed); this rejects any
  // browser-issued cross-origin call outright.
  if (origin && !ALLOWED_ORIGINS.has(origin)) return json(403, { error: 'forbidden_origin' }, null);

  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  const { success: withinLimit } = await env.RATE_LIMITER.limit({ key: ip });
  if (!withinLimit) return json(429, { error: 'rate_limited' }, origin);

  let body: { email?: unknown; matchedRole?: unknown; language?: unknown };
  try {
    body = await request.json();
  } catch {
    return json(400, { error: 'invalid_json' }, origin);
  }

  const email = typeof body.email === 'string' ? body.email.trim() : '';
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return json(400, { error: 'invalid_email' }, origin);
  }
  const role =
    typeof body.matchedRole === 'string' && VALID_ROLES.has(body.matchedRole)
      ? body.matchedRole
      : 'unknown';
  const language =
    typeof body.language === 'string' && VALID_LANGS.has(body.language) ? body.language : 'en';

  if (!env.BEEHIIV_API_KEY) {
    console.error('BEEHIIV_API_KEY secret is not set');
    return json(500, { error: 'not_configured' }, origin);
  }

  const upstream = await fetch(
    `https://api.beehiiv.com/v2/publications/${env.BEEHIIV_PUBLICATION_ID}/subscriptions`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.BEEHIIV_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        reactivate_existing: true,
        send_welcome_email: true,
        utm_source: 'yongchivo-tools',
        utm_medium: 'quiz',
        utm_campaign: 'which-cyber-role',
        custom_fields: [
          { name: 'cyber_role', value: role },
          { name: 'language', value: language },
        ],
      }),
    }
  );

  if (!upstream.ok) {
    console.error(`Beehiiv error ${upstream.status}: ${await upstream.text()}`);
    // Beehiiv rejected the address itself vs. everything else.
    if (upstream.status === 400) return json(400, { error: 'invalid_email' }, origin);
    return json(502, { error: 'upstream_error' }, origin);
  }

  return json(200, { ok: true }, origin);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/api/subscribe') return handleSubscribe(request, env);
    return env.ASSETS.fetch(request);
  },
};
