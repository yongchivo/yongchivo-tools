// POST /api/breach-check — checks an email against XposedOrNot's breach database
// (free, no key). Privacy-sensitive: the email is held only in memory for the
// request, never logged or persisted. Error logging records status codes only.

import { type Env, EMAIL_RE, json, preflightOrReject } from './shared';

const FETCH_TIMEOUT_MS = 8000;
const MAX_BREACHES = 60; // cap the payload for heavily-exposed addresses

interface XonBreach {
  breach?: string;
  xposed_date?: string;
  xposed_data?: string;
  xposed_records?: number;
}

export async function handleBreachCheck(request: Request, env: Env): Promise<Response> {
  const gate = preflightOrReject(request);
  if (gate) return gate;
  const origin = request.headers.get('Origin');

  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  const { success } = await env.BREACH_RATE_LIMITER.limit({ key: ip });
  if (!success) return json(429, { error: 'rate_limited' }, origin);

  let body: { email?: unknown };
  try {
    body = await request.json();
  } catch {
    return json(400, { error: 'invalid_json' }, origin);
  }

  const email = typeof body.email === 'string' ? body.email.trim() : '';
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return json(400, { error: 'invalid_email' }, origin);
  }

  // Email goes only into this outbound URL; nothing about it is logged.
  const endpoint = new URL('https://api.xposedornot.com/v1/breach-analytics');
  endpoint.searchParams.set('email', email);

  let upstream: Response;
  try {
    upstream = await fetch(endpoint, {
      headers: { Accept: 'application/json', 'User-Agent': 'YongchivoTools/1.0' },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch {
    return json(502, { error: 'upstream_error' }, origin);
  }

  if (!upstream.ok) {
    console.error(`XposedOrNot error ${upstream.status}`); // status only, no email
    return json(502, { error: 'upstream_error' }, origin);
  }

  let data: { ExposedBreaches?: { breaches_details?: XonBreach[] } | null };
  try {
    data = await upstream.json();
  } catch {
    return json(502, { error: 'upstream_error' }, origin);
  }

  const details = data.ExposedBreaches?.breaches_details ?? [];
  const breaches = details
    .map((b) => ({
      name: typeof b.breach === 'string' ? b.breach : 'Unknown',
      year: typeof b.xposed_date === 'string' ? b.xposed_date : '',
      dataTypes:
        typeof b.xposed_data === 'string'
          ? b.xposed_data.split(';').map((s) => s.trim()).filter(Boolean)
          : [],
      records: typeof b.xposed_records === 'number' ? b.xposed_records : 0,
    }))
    .sort((a, b) => (b.year > a.year ? 1 : b.year < a.year ? -1 : 0));

  return json(
    200,
    {
      found: breaches.length > 0,
      count: breaches.length,
      breaches: breaches.slice(0, MAX_BREACHES),
    },
    origin
  );
}
