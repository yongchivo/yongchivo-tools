# Yongchivo Tools

> A hub of free, bilingual (EN/ES) cybersecurity micro-tools at `tools.yongchivo.com`. Each tool is both a genuinely useful utility and a self-ranking SEO landing page that cross-links to the others, feeds traffic to the main brand (yongchivo.com) and to paid apps (PHV Prep UK), and captures owned audience via a shared newsletter funnel. Built on Cloudflare, near-zero running cost.

## Project status

**Live — all six tools shipped** — _last updated 23 Jul 2026_

This project is built solo, end to end, using **Claude Code**, and tracked as a **Claude Project** for ongoing context.

| Item | Status |
|---|---|
| Domain / subdomain | `tools.yongchivo.com` (Cloudflare-managed) — **live** |
| Hosting | Cloudflare **Workers static assets** (not classic Pages) — **live**, git-connected auto-deploys from `main` |
| Backend (for tools that need it) | Cloudflare Workers — **live**, handling `/api/subscribe`, `/api/check-headers`, `/api/breach-check` |
| Portfolio integration | **Done** — card added and updated in `projects.astro` under **Cyber Security & Forensics** |

**Roadmap (by wave)**

- [x] **Wave 1 — quick start (client-only, high SEO):** Password Generator → Subnet Calculator → Password Strength Analyzer
- [x] **Wave 2 — viral hook:** "Which cyber role are you?" quiz (email capture + links into the serious tools)
- [x] **Wave 3 — Worker-backed (higher value, more effort):** Security Headers Checker → Breach Checker
- [x] Bilingual routing live (EN at root, ES under `/es/`)
- [x] Shared header/footer with links back to yongchivo.com and PHV Prep UK
- [x] Newsletter capture wired to the quiz
- [x] Cloudflare Web Analytics enabled

### Shipped beyond the original checklist

Two things landed during the build that weren't on the initial list:

- **Bilingual SEO infrastructure** — auto-generated sitemap with `hreflang` alternates pairing every EN page with its `/es/` mirror, plus in-page `hreflang` and Open Graph / Twitter-card tags for social sharing.
- **Site-wide security-headers hardening** — HSTS, Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Referrer-Policy and Permissions-Policy served on every response (via `public/_headers`). The site now grades **A** on its own Security Headers Checker — dogfooding the tool.

## Overview

**Yongchivo Tools** is a collection of small, independent cybersecurity utilities, each living on its own page under `tools.yongchivo.com`. The strategy mirrors the SEO guide pages built for PHV Prep UK — but instead of static marketing content, each page is an interactive product that ranks on its own for a specific query.

### Why this approach

- **Amortizes fixed costs already being paid**: Cloudflare domain, Apple Developer account, Google Play Console. Winning web tools graduate to apps using the existing accounts, no new stack.
- **Compounding SEO**: each tool targets a distinct high-intent query (e.g. "password generator", "subnet calculator"). A coherent internal-link cluster signals topical authority to Google rather than orphan pages.
- **Content engine**: every tool is also a social post (LinkedIn/TikTok, EN + ES), feeding the Spain + UK audience goal.
- **Low risk, modular**: each piece is small and independent. If one underperforms, the next does not depend on it.
- **Privacy as a selling point**: client-only tools never send data off-device — a real differentiator in cybersecurity.

## The tools

Tools are split by whether they need a backend, because that defines effort.

### Client-only (JavaScript in the browser, no backend)
Fastest to ship, most private (nothing leaves the device).
- **Password Generator** — large, constant search volume; the "hello world" of the hub.
- **Password Strength Analyzer** — complements the generator; they cross-link and reinforce the "passwords" topic cluster.
- **Subnet Calculator** — loyal niche (networking students), low-quality competition, reuses exercise logic.
- **"Which cyber role are you?" quiz** — viral personality test (pentester / SOC analyst / forensics…); primary email-capture point.
- **Password Game (cyber edition)** — optional later viral piece.

### Worker-backed (Cloudflare Worker as lightweight backend / proxy)
- **Security Headers Checker** — paste a URL, analyze its security headers; used by devs → quality backlinks.
- **Breach Checker** — highest "wow"; calls an external breach API via a Worker (which hides keys and rate-limits).
- **URL/QR safety scanner** — optional; flags suspicious URLs (new domain, no HTTPS, etc.).

## Architecture

```
tools.yongchivo.com/
├── /                          → hub index (all tools as cards)
├── /password-generator/       → client-only
├── /password-strength/        → client-only
├── /subnet-calculator/        → client-only
├── /security-headers/         → Worker
├── /breach-check/             → Worker
├── /which-cyber-role/         → client-only (viral quiz)
└── /es/...                    → each page mirrored in Spanish
```

- **Frontend**: Astro (already used for the portfolio via the Astrofy template) or plain HTML+JS for the simplest tools. Astro provides bilingual routing and SEO nearly for free.
- **Backend (only where needed)**: Cloudflare Workers.
- **Storage (only if needed)**: Cloudflare KV for counters / rate-limiting; D1 for anything structured.
- **Analytics**: Cloudflare Web Analytics (free, cookieless — consistent with the privacy message).

## The interlinking system (what makes it a hub, not scattered pages)

- **Portfolio → Hub**: a `HorizontalCard` in `projects.astro` (see below).
- **Hub → Portfolio**: shared header/footer linking to yongchivo.com and PHV Prep UK, so anyone landing on a single tool from Google discovers the rest of the work.
- **Tool → Tool**: each page links to 2–3 related tools by topic (e.g. Password Generator → "Related tools" block → Password Strength Analyzer + Breach Checker). This multiplies time-on-site and gives Google a coherent topic cluster.
- **All → email capture**: one shared conversion point (the role quiz is the best magnet) feeding the "2 minutos de cyber" newsletter, converting passing traffic into owned audience.

**Traffic flow**: Google / social → individual tool → other tools in the cluster → newsletter + portfolio → paid apps. Each layer pushes to the next.

## Portfolio integration

Add to `projects.astro`, inside the **Cyber Security & Forensics** section:

```astro
<HorizontalCard
  title="Yongchivo Tools"
  img="/tools-cover.webp"
  desc="Hub of free cybersecurity micro-tools: password generator & strength analyzer, subnet calculator, security-headers checker, and more. Bilingual (EN/ES), built on Cloudflare."
  url="https://tools.yongchivo.com"
  target="_blank"
  badge="Live"
  tags={['Cloudflare', 'Astro', 'Workers', 'SEO']}
/>
```

- Cover image goes in `public/tools-cover.webp`, referenced as `/tools-cover.webp`. Use the Yongchivo purple/cyan brand style.
- `badge` reflects status — start with `WIP`/`Beta` if launching in phases, switch to `Live` when public.

## Building with Claude Code

Suggested working order for Claude Code sessions, one tool per session to keep scope tight:

1. **Scaffold** the Astro project + Cloudflare Pages config + bilingual routing structure and the shared header/footer/layout.
2. **Wave 1 tools** (client-only), each self-contained: page + logic + on-page SEO (title, meta, structured heading) + EN/ES versions + "related tools" block.
3. **Quiz** (Wave 2) with email capture wired to the newsletter.
4. **Workers** (Wave 3): Security Headers Checker, then Breach Checker (Worker as API proxy, keys in Cloudflare secrets, KV rate-limiting).
5. **Cross-linking pass**: ensure every tool links to 2–3 siblings and back to the portfolio.
6. **Analytics + sitemap + robots.txt**, then deploy.

Per-tool definition of done: works in EN and ES, has on-page SEO, links to related tools and back to the brand, and is mobile-friendly.

## Brand

- **Name**: Yongchivo Tools (under the Yongchivo umbrella brand).
- **Visual identity**: dark background, purple/cyan (magenta + cyan) accent, modern flat design — consistent with the Yongchivo goat logo and business cards.
- **Tone**: practical, no-nonsense, bilingual — written for students and working professionals.

## Future expansion paths

- Graduate the best-performing web tools into a single "umbrella" utilities app (one Apple/Play publication, amortizing both accounts).
- "Build in public" tracker on yongchivo.com showing live metrics for the tools and apps.
- Add networking-focused tools (ports & protocols trainer, CIDR practice) as a sub-cluster.
- Expand the newsletter into the central owned-audience asset across all projects.
