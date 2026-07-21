// POST /api/check-headers — fetches a user-supplied URL server-side and grades
// its security headers. Because it fetches arbitrary URLs, the URL validation
// below is the security boundary: it must block SSRF vectors (non-web schemes,
// private/internal IP ranges, non-web ports, embedded credentials) BEFORE any
// outbound request, and re-validate every redirect hop.

import { type Env, json, preflightOrReject } from './shared';

const FETCH_TIMEOUT_MS = 6000;
const MAX_REDIRECTS = 3;
const USER_AGENT =
  'Mozilla/5.0 (compatible; YongchivoToolsHeaderChecker/1.0; +https://tools.yongchivo.com)';

type HeaderId = 'hsts' | 'csp' | 'xfo' | 'xcto' | 'rp' | 'pp';
type Status = 'pass' | 'warn' | 'fail';

interface HeaderResult {
  id: HeaderId;
  status: Status;
  value?: string;
}

// ---- SSRF-safe URL validation --------------------------------------------

function ipv4Private(host: string): boolean | null {
  const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host);
  if (!m) return null; // not an IPv4 literal
  const [a, b, c, d] = m.slice(1).map(Number) as [number, number, number, number];
  if ([a, b, c, d].some((o) => o > 255)) return true; // malformed → reject
  if (a === 0 || a === 127) return true; // this-host / loopback
  if (a === 10) return true; // private
  if (a === 172 && b >= 16 && b <= 31) return true; // private
  if (a === 192 && b === 168) return true; // private
  if (a === 169 && b === 254) return true; // link-local (incl. cloud metadata)
  if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
  if (a >= 224) return true; // multicast / reserved
  return false;
}

function ipv6Private(host: string): boolean | null {
  if (!host.includes(':')) return null; // not an IPv6 literal
  const h = host.toLowerCase();
  if (h === '::1' || h === '::') return true; // loopback / unspecified
  if (h.startsWith('fc') || h.startsWith('fd')) return true; // unique-local fc00::/7
  if (h.startsWith('fe8') || h.startsWith('fe9') || h.startsWith('fea') || h.startsWith('feb'))
    return true; // link-local fe80::/10
  const mapped = /::ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/.exec(h); // IPv4-mapped
  if (mapped) return ipv4Private(mapped[1]!) === true;
  return false;
}

/** Returns a normalized safe URL string, or null if the URL must be blocked. */
export function validateTargetUrl(raw: string): string | null {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
  if (url.username || url.password) return null; // no embedded credentials
  // Only default/web ports — blocks probing arbitrary internal service ports.
  if (url.port && !['80', '443', '8080', '8443'].includes(url.port)) return null;

  let host = url.hostname.toLowerCase();
  if (host.startsWith('[') && host.endsWith(']')) host = host.slice(1, -1); // IPv6 brackets
  if (!host) return null;
  if (host === 'localhost' || host.endsWith('.localhost')) return null;
  if (host.endsWith('.internal') || host.endsWith('.local')) return null;

  const v4 = ipv4Private(host);
  if (v4 === true) return null;
  const v6 = ipv6Private(host);
  if (v6 === true) return null;
  // Single-label hostnames (no dot, not an IP literal) are almost always
  // internal names — reject anything that isn't a public FQDN or IP.
  if (v4 === null && v6 === null && !host.includes('.')) return null;

  return url.toString();
}

// ---- Fetch (HEAD, GET fallback) with re-validated manual redirects --------

async function fetchOnce(target: string, method: 'HEAD' | 'GET'): Promise<Response> {
  return fetch(target, {
    method,
    redirect: 'manual',
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    headers: { 'User-Agent': USER_AGENT, Accept: '*/*' },
  });
}

type FetchOutcome =
  | { ok: true; headers: Headers; finalUrl: string }
  | { ok: false; error: 'blocked' | 'fetch_failed' | 'too_many_redirects' };

async function fetchHeaders(startUrl: string): Promise<FetchOutcome> {
  let current = startUrl;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const safe = validateTargetUrl(current);
    if (!safe) return { ok: false, error: 'blocked' };

    let res: Response;
    try {
      res = await fetchOnce(safe, 'HEAD');
      if (res.status === 403 || res.status === 405 || res.status === 501) {
        res.body?.cancel();
        res = await fetchOnce(safe, 'GET');
      }
    } catch {
      return { ok: false, error: 'fetch_failed' };
    }

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get('location');
      res.body?.cancel();
      if (!location) return { ok: true, headers: res.headers, finalUrl: safe };
      try {
        current = new URL(location, safe).toString();
      } catch {
        return { ok: false, error: 'fetch_failed' };
      }
      continue;
    }

    const headers = res.headers;
    res.body?.cancel();
    return { ok: true, headers, finalUrl: safe };
  }
  return { ok: false, error: 'too_many_redirects' };
}

// ---- Header analysis & grading (securityheaders.com-style) -----------------

const WEIGHTS: Record<HeaderId, number> = { csp: 25, hsts: 20, xfo: 15, xcto: 15, rp: 15, pp: 10 };

function analyze(headers: Headers): {
  results: HeaderResult[];
  infoLeak: { id: 'server' | 'xpb'; value: string }[];
  grade: string;
  score: number;
} {
  const get = (name: string) => headers.get(name)?.trim() ?? '';
  const results: HeaderResult[] = [];

  const hsts = get('strict-transport-security');
  results.push({
    id: 'hsts',
    status: hsts ? (/max-age=\s*\d+/i.test(hsts) ? 'pass' : 'warn') : 'fail',
    value: hsts || undefined,
  });

  const csp = get('content-security-policy');
  results.push({ id: 'csp', status: csp ? 'pass' : 'fail', value: csp || undefined });

  const xfo = get('x-frame-options');
  results.push({
    id: 'xfo',
    status: xfo ? (/^(deny|sameorigin)$/i.test(xfo) ? 'pass' : 'warn') : 'fail',
    value: xfo || undefined,
  });

  const xcto = get('x-content-type-options');
  results.push({
    id: 'xcto',
    status: xcto ? (/^nosniff$/i.test(xcto) ? 'pass' : 'warn') : 'fail',
    value: xcto || undefined,
  });

  const rp = get('referrer-policy');
  results.push({ id: 'rp', status: rp ? 'pass' : 'fail', value: rp || undefined });

  const pp = get('permissions-policy');
  results.push({ id: 'pp', status: pp ? 'pass' : 'fail', value: pp || undefined });

  let score = 0;
  for (const r of results) {
    const w = WEIGHTS[r.id];
    score += r.status === 'pass' ? w : r.status === 'warn' ? w / 2 : 0;
  }

  const infoLeak: { id: 'server' | 'xpb'; value: string }[] = [];
  const server = get('server');
  if (server && /\d/.test(server)) infoLeak.push({ id: 'server', value: server });
  const xpb = get('x-powered-by');
  if (xpb) infoLeak.push({ id: 'xpb', value: xpb });
  if (infoLeak.length) score = Math.max(0, score - 5); // version disclosure penalty

  const grade =
    score >= 90 ? 'A' : score >= 75 ? 'B' : score >= 60 ? 'C' : score >= 45 ? 'D' : score >= 25 ? 'E' : 'F';

  return { results, infoLeak, grade, score: Math.round(score) };
}

// ---- Handler ---------------------------------------------------------------

export async function handleCheckHeaders(request: Request, env: Env): Promise<Response> {
  const gate = preflightOrReject(request);
  if (gate) return gate;
  const origin = request.headers.get('Origin');

  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  const { success } = await env.HEADERS_RATE_LIMITER.limit({ key: ip });
  if (!success) return json(429, { error: 'rate_limited' }, origin);

  let body: { url?: unknown };
  try {
    body = await request.json();
  } catch {
    return json(400, { error: 'invalid_json' }, origin);
  }

  const raw = typeof body.url === 'string' ? body.url.trim() : '';
  if (!raw || raw.length > 2048) return json(400, { error: 'invalid_url' }, origin);
  const safe = validateTargetUrl(raw);
  if (!safe) return json(400, { error: 'invalid_url' }, origin);

  const outcome = await fetchHeaders(safe);
  if (!outcome.ok) {
    const status = outcome.error === 'blocked' ? 400 : 502;
    return json(status, { error: outcome.error }, origin);
  }

  const { results, infoLeak, grade, score } = analyze(outcome.headers);
  return json(200, { url: safe, finalUrl: outcome.finalUrl, grade, score, results, infoLeak }, origin);
}
