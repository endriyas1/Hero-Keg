# 00 — Project Inventory (Phase 1)

- **Repository:** `endriyas1/Hero-Keg`, inspected at `origin/main` commit `586fc60` (after PR #3).
- **Method:** read-only source inspection only. No production endpoints were contacted, nothing was installed or built, and no data was written.
- **Secrets:** no secret values appear in this document.

## 1. Key finding: there is no Supabase in this codebase

The audit brief assumes a React + Supabase application. This repository has none of the following:

- Supabase client or `@supabase/*` dependency
- `supabase/` directory, migrations, SQL, RLS policies, storage buckets or Edge Functions
- Authentication: no login, registration, sessions, tokens or user roles
- Database of any kind; the server stores nothing

Searches for `supabase`, `localStorage`, `sessionStorage`, auth/session code and SQL returned nothing.

What is actually deployed is a **public marketing website** with **one write endpoint**: a contact form that sends an email through Gmail SMTP.

Consequences for the plan:

- Phase 3 (auth/RLS) and most of Phase 4 (storage, RPC, IDOR, data isolation) have nothing to audit **in this repository**.
- If a Supabase project exists for Hero Keg, it lives in another repository or is not wired into this site. That needs your confirmation (see §9).

## 2. Architecture

| Layer | Technology | Evidence |
|---|---|---|
| Frontend | React 19.2 SPA, TypeScript (TSX), Tailwind 4, `motion`, `lucide-react` | `src/`, `package.json` |
| Build | Vite 6.4.2 (client); esbuild bundles `server.ts` → `dist/server.cjs` with a sourcemap | `package.json` `build` script |
| Routing | Hand-rolled: `window.location.pathname`/hash → `Page` union; `history.pushState` | `src/App.tsx:30-62` |
| Server | Express 4.22 single file, port 3000 | `server.ts` |
| Email | nodemailer 8.0.8 → Gmail SMTP (app password) | `server.ts:128-204` |
| Hosting | Google AI Studio applet → Cloud Run (inferred) | `metadata.json`, `.env.example` comments |
| Package manager | npm, `package-lock.json` lockfileVersion 3 (219 resolved packages) | — |
| SEO | Per-page `useSEO` hook mutates meta tags and JSON-LD; static `sitemap.xml`, `robots.txt` | `src/hooks/useSEO.ts`, `public/` |

Pages: Home, About, Services, Contact, Why Choose Us (Home section), Site Index (`/sitemap`, now unlinked from the footer but still routable).

## 3. Scripts (`package.json`)

| Script | Command | Notes |
|---|---|---|
| `dev` | `tsx server.ts` | Express + Vite dev middleware |
| `build` | `vite build && esbuild server.ts … --sourcemap --outfile=dist/server.cjs` | Server bundle **and its sourcemap** are written into `dist/` |
| `start` | `node dist/server.cjs` | Does **not** set `NODE_ENV` |
| `clean` | `rm -rf dist server.js` | |
| `lint` | `tsc --noEmit` | Type check only; no ESLint |

There are no `test`, `typecheck`, `format` or e2e scripts.

## 4. Attack surface

| # | Surface | Auth | Input | Notes |
|---|---|---|---|---|
| A1 | `POST /api/contact` | None (by design) | JSON ≤ 20 kB: name, company, email, phone, service, kegs, subject, message, honeypot `website` | Only write path. Sends email to the business inbox with `replyTo` = submitter. |
| A2 | `GET /sitemap.xml`, `GET /robots.txt` | None | — | Static files |
| A3 | `GET *` (production branch) | None | — | `express.static('dist')` + SPA fallback |
| A4 | Vite dev middleware (non-production branch) | None | — | Active whenever `NODE_ENV !== 'production'` |
| A5 | Browser SPA | — | URL path/hash only | No query-string parsing, no `dangerouslySetInnerHTML`, no storage use |
| A6 | Outbound | — | — | Gmail SMTP only. External links use `rel="noopener noreferrer"`. |

### Security boundaries

- **Secrets** (`GMAIL_USER`, `GMAIL_APP_PASSWORD`, `CONTACT_RECIPIENT_EMAIL`, `GEMINI_API_KEY`) are read server-side through `process.env` only.
  - No `import.meta.env` / `VITE_*` usage, so nothing is injected into the client bundle.
- **Trust boundary:** the only untrusted input crossing into a privileged context is the contact form body. It flows into an outbound email that is sent with the business Gmail credentials.

## 5. Security-relevant observations (preliminary, to verify in later phases)

These are hypotheses from reading the code. None has been reproduced yet.

| ID | Observation | Location | Initial severity | Confidence |
|---|---|---|---|---|
| P-01 | **Server bundle and sourcemap would be publicly downloadable.** `build` writes `dist/server.cjs` and `dist/server.cjs.map`, and production serves all of `dist/` statically, so `GET /server.cjs` and `GET /server.cjs.map` should return the full backend source. No secrets are hardcoded, so the exposure is code and logic, not credentials. | `package.json` build, `server.ts:243-244` | Medium | High (code reading); confirm with a local build |
| P-02 | **Dev server may run in production.** `start` does not set `NODE_ENV`. Unless Cloud Run/AI Studio sets `NODE_ENV=production`, production serves through Vite's dev middleware. That exposes source and `/@fs/` paths, and Vite's dev server has a history of file-read CVEs. | `package.json` start, `server.ts:236-241` | High if true | Unknown — depends on the deployment env |
| P-03 | No security headers: no CSP, HSTS, `X-Content-Type-Options`, `frame-ancestors`/`X-Frame-Options`, `Referrer-Policy`. `X-Powered-By: Express` is left on. | `server.ts` | Low–Medium | High |
| P-04 | Rate limit is in-memory, per instance: 5 per IP per 15 min. It resets on restart and is not shared across Cloud Run instances. It depends on `trust proxy = 1` matching the real proxy chain; if wrong, all users share one IP bucket or the limit can be spoofed via `X-Forwarded-For`. | `server.ts:13, 32-54` | Low–Medium (email spam/abuse) | Medium |
| P-05 | PII written to logs: name, company and email are logged on every submission, and phone too when SMTP is unconfigured. Cloud Run logs are retained and visible to project members. | `server.ts:105, 109` | Low (privacy) | High |
| P-06 | Loose email validation: the regex accepts a local part with commas or quotes, e.g. `a,b@c.d`. The value only reaches `replyTo` (nodemailer parses it), so the impact is limited to an odd reply-to header, not injection into `to`. | `server.ts:94, 140` | Low | Medium |
| P-07 | Unused dependency `@google/genai` (2.6.0): no import anywhere. It adds supply-chain surface for no benefit. `GEMINI_API_KEY` in `.env.example` is likewise unused. | `package.json` | Informational | High |
| P-08 | Build/dev tooling in runtime `dependencies` (`vite`, `@vitejs/plugin-react`, `@tailwindcss/vite`), so `npm audit --omit=dev` will include them. Related to P-02. | `package.json` | Informational | High |
| P-09 | A new SMTP transporter is created per request, with no timeout configured, so a hung SMTP connection holds the request open. | `server.ts:129` | Low (reliability) | Medium |

Positive controls already present:

- HTML-escaping of every field in the email body
- CR/LF stripping in the subject and sender name
- Field length caps and a 20 kB body limit
- Honeypot field
- Generic error messages, so no stack traces reach the client
- Honest failure: returns 503 when SMTP is unconfigured
- `.gitignore` excludes `.env*`

Secret scan: a pattern search across all git history (Google API keys, `sk-`, private keys, `service_role`, Slack tokens) found nothing. Only `.env.example`, which has empty values, was ever committed.

## 6. Testing tools available

| Tool | Status |
|---|---|
| Node 22.22 / npm 10.9 | Available |
| `node_modules` | Not installed; `npm ci` needed for build/tests |
| Test framework | None. No Vitest, Jest, Playwright or RTL. No tests exist. |
| ESLint / Semgrep | Not configured |
| Playwright + Chromium | Chromium is preinstalled in this container; Playwright is not a project dependency |
| k6 / OWASP ZAP | Not installed |
| CI/CD | None (no `.github/workflows`) |
| Staging environment | None known |

## 7. Gaps

- **No automated tests of any kind**, and no CI to run them.
- **No staging environment**, so every dynamic test would hit production unless run locally.
- **Deployment config is not in the repo.** Cloud Run env vars, instance count, `NODE_ENV`, custom domain and TLS cannot be verified from source.
- **Domain inconsistency:** canonical/sitemap URLs use `www.herokegservice.com`; your earlier message referenced `herokeg.com`. This is an SEO issue, and a security one if one domain is unmaintained.

## 8. Production safety boundaries for the next phases

- **Never** submit the contact form against production. Each request sends a real email to the business inbox and consumes the shared rate limit.
- Dynamic testing (endpoint behavior, rate limit, header checks, Playwright, k6) runs against a **local server** started from this repo. Use `NODE_ENV=production`, and either no SMTP credentials or a mocked transport.
- The only production contact I'd propose, with your approval: one read-only `GET /` and `GET /server.cjs` (HEAD) to confirm P-01/P-02 and inspect response headers.
- No changes to Cloud Run, DNS or Gmail settings from this session.

## 9. Questions before Phase 2

1. **Is there a Supabase project** (or any database/auth) for Hero Keg in another repository? If so, add it to this session. Otherwise Phases 3–4 are reduced to the contact API.
2. **Production URL and host:** is it Cloud Run via AI Studio? Do you know whether `NODE_ENV=production` is set? This decides whether P-02 is real.
3. **Approve the two read-only production GETs** in §8?
4. **Approve adding dev tooling** (Vitest + Supertest for the API, Playwright for e2e) as `devDependencies`, plus a `test` script?
