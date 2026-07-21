// Worker entry: serves the static site from assets and handles the API routes
// (POST /api/subscribe → Beehiiv proxy, POST /api/check-headers → header grader).

import { type Env, EMAIL_RE, json, preflightOrReject, VALID_LANGS } from './shared';
import { handleCheckHeaders } from './headers';
import { handleBreachCheck } from './breach';

// Mirrors RoleId in src/data/quiz.ts.
const VALID_ROLES = new Set(['pt', 'soc', 'df', 'se', 'grc']);

async function handleSubscribe(request: Request, env: Env): Promise<Response> {
  const gate = preflightOrReject(request);
  if (gate) return gate;
  const origin = request.headers.get('Origin');

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
    if (url.pathname === '/api/check-headers') return handleCheckHeaders(request, env);
    if (url.pathname === '/api/breach-check') return handleBreachCheck(request, env);
    // Static assets are served by the assets runtime (which also applies the
    // security headers from public/_headers); the Worker only fronts /api/*.
    return env.ASSETS.fetch(request);
  },
};
