# 03 — API, Server and Storage Security (Phase 4)

**Scope:** `server.ts` (Express 4.22). Storage and Edge Functions: none exist.

**Environment:** every dynamic result below comes from a **local production build** (`npm run build`, `NODE_ENV=production node dist/server.cjs`). nodemailer was replaced by a capture stub (`tests/helpers/mock-nodemailer.cjs`), so no email was sent.

**Production not tested:** the approved read-only requests to `https://herokeg.com/` could not be made, because this session's network policy refuses that host (`CONNECT tunnel failed, 403`). Every finding below is **confirmed locally and unverified in production**.

## Endpoint inventory

| Method | Path | Handler | Auth |
|---|---|---|---|
| POST | `/api/contact` | `server.ts:57` | none (public by design) |
| GET | `/sitemap.xml`, `/robots.txt` | `server.ts:222, 228` | none |
| GET | `*` | `express.static('dist')` + SPA fallback (`NODE_ENV=production`) or Vite dev middleware (otherwise) | none |

## Checks on `POST /api/contact`

| Check | Result | Test |
|---|---|---|
| HTML injection into the email | Escaped (`& < > " '`), including inside `href="tel:"`/`"mailto:"` | `HTML-escapes every submitted field` ✅ |
| SMTP header injection (CR/LF in name/company/subject) | Stripped | `strips CR/LF…` ✅ |
| Mass assignment (`to`, `cc`, `bcc`, `from`, `attachments`, `recipient`) | Ignored; recipients fixed server-side | `ignores attacker-supplied routing fields` ✅ |
| SSRF / file read via nodemailer `attachments`/`raw`/`path` | Not reachable: the client cannot add these keys | same ✅ |
| Required-field and type validation | Missing, whitespace-only and non-string values give 400 with no mail sent | 8 tests ✅ |
| Email format | Rejects obvious garbage; **accepts comma lists** (F-06) | 5 ✅ / 1 ❌ |
| Request-size limit | 20 kB gives 413, no mail | ✅ |
| Field caps | Enforced (subject 200, message 5000, …) | ✅ |
| Honeypot | Fake 200, no mail | ✅ |
| Rate limit | 6th request in 15 min gives 429; prepended `X-Forwarded-For` entries don't reset it | 2 tests ✅ |
| Error leakage on SMTP failure | Generic 500; no SMTP text, credentials or stack | ✅ |
| SMTP unconfigured | 503 with phone/email fallback; never reports success | ✅ |
| Duplicate submissions | No idempotency key, but the UI disables the button (e2e ✅). The API itself will send duplicates if called twice; the rate limit caps that at 5. | — |
| SQL injection / IDOR / transactions | N/A: no database | — |
| CORS | No CORS headers. Cross-origin JS can't read responses. A cross-site `fetch` with `Content-Type: application/json` is preflighted and blocked. A simple `text/plain` POST is not parsed by `express.json()`, so it reaches the handler with an empty body and is rejected with 400. Not exploitable. | manual reasoning |

## Findings

### F-01 — Backend bundle and full-source sourcemap are publicly downloadable (Medium)

- **Cause:**
  - `package.json` `build` runs `esbuild server.ts … --sourcemap --outfile=dist/server.cjs`.
  - Production serves everything in `dist/` via `express.static(distPath)` (`server.ts:243-244`).
- **Evidence (local production build):**
  ```
  GET /server.cjs      → 200 application/octet-stream 9,896 bytes
  GET /server.cjs.map  → 200 application/json 14,297 bytes (sourcesContent = full server.ts)
  ```
  Tests: `does not serve the backend bundle at /server.cjs` ❌, `…/server.cjs.map` ❌.
- **Impact:**
  - Discloses all server logic: validation rules, honeypot field name, rate-limit thresholds, env-var names and the email template.
  - No secret values are exposed; they come from the environment at runtime.
  - Lets an attacker tune spam to stay under the limits.
  - CVSS 3.1 about 5.3 (AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N).
- **Fix:**
  - Stop emitting `--sourcemap` for the server.
  - Either write the bundle outside the static root, or refuse to serve `server.cjs*`.
  - The smallest change that doesn't alter the deploy layout is a guard before `express.static`.

### F-02 — Production may be running the Vite dev server (High if true; unverified)

- **Cause:**
  - `npm start` runs `node dist/server.cjs` without setting `NODE_ENV`.
  - The server only uses the static build when `NODE_ENV === 'production'` (`server.ts:236`).
  - Otherwise it boots Vite in middleware mode. `vite` is a runtime dependency, so this succeeds silently.
- **Evidence (local, `NODE_ENV` unset):**
  ```
  GET /                      → 200, HTML loads /@vite/client and /src/main.tsx
  GET /server.ts?raw         → 200, raw server source
  GET /package.json          → 200
  GET /security-audit/…md    → 200   (any file in the repo root)
  GET /.env, /.git/config, /@fs/etc/passwd → 403 (Vite's deny list holds)
  ```
- **Impact if production runs this way:**
  - All source and docs in the deployed directory are readable.
  - The dev server runs unoptimized (slow, high memory).
  - It is exposed to the Vite dev-server advisories in F-04, e.g. GHSA-9jrq-w75r-8gcw and GHSA-rq7h-c2jc-7f22.
- **Verify:** load `https://herokeg.com/` and view source. If it references `/@vite/client` or `/src/main.tsx`, F-02 is live. If it references `/assets/index-*.js`, it isn't.
- **Fix:** set `NODE_ENV=production` in the `start` script, and/or treat "running from `dist/`" as production.

### F-03 — No security headers; `X-Powered-By: Express` (Low–Medium)

- **Evidence:** response to `GET /contact` has no CSP, no `X-Content-Type-Options`, no `X-Frame-Options`/`frame-ancestors`, no `Referrer-Policy`, and does have `X-Powered-By: Express`.
- **Tests:** 5 header tests ❌.
- **Impact:**
  - Clickjacking of the contact form is possible (low value: there's no authenticated action).
  - There is no defense-in-depth layer if an XSS is introduced later.
  - The framework is fingerprinted.
- **HSTS:** must be confirmed on the live domain; it can't be tested locally over http.
- **Fix:** a small middleware setting:
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - a CSP with:
    - `default-src 'self'`
    - `script-src 'self'`
    - `style-src 'self' 'unsafe-inline'`
    - `img-src 'self' data:`
    - `frame-src https://www.google.com`
    - `frame-ancestors 'none'`
    - `base-uri 'self'`
    - `form-action 'self'`
  - `app.disable('x-powered-by')`

  Validate with the e2e suite (no CSP violations).

### F-05 — Submitter PII written to server logs on every submission (Low, privacy)

- **Where:** `server.ts:105` logs `{ name, company, email, subject }` for every request.
  - `server.ts:109` additionally logs the phone number when SMTP is unconfigured. That one is a deliberate lead-recovery fallback.
- **Test:** `does not write submitter email or phone to the logs when delivery succeeds` ❌.
- **Impact:**
  - Personal data is retained in Cloud Run logs, readable by anyone with Logging access.
  - The data is duplicated outside the inbox, which raises data-protection obligations.
- **Fix:**
  - Drop line 105, or log only a non-identifying marker.
  - Keep the line 109 fallback; without it, leads would be lost when SMTP is down.

### F-06 — Email field accepts address lists, so Reply-To can name extra recipients (Low)

- **Where:** `server.ts:94`. The regex `^[^\s@]+@[^\s@]+\.[^\s@]+$` allows `,` in the local part.
- **Evidence:** `email = "a,attacker@example.test"` returns 200 with `replyTo: "a,attacker@example.test"`. Test ❌.
- **Impact:**
  - If staff hit Reply, the reply may also go to an address the submitter chose.
  - Any address could already be typed directly, so this mainly enables confusing or deceptive Reply-To lists.
- **Fix:** reject `,` `;` `"` `<` `>` `(` `)` in the email field (or use a stricter pattern), and pass `replyTo` as `{ address }` so nodemailer doesn't re-parse it.

### F-07 — Rate limit is per-instance and proxy-topology dependent (Low–Medium; partially verified)

- **Where:** `server.ts:13, 32-54`.
- **Verified locally:** with one trusted hop the limiter keys on the right address, and prepended `X-Forwarded-For` entries don't bypass it.
- **Unverified:**
  1. Counts live in memory per instance, so they reset on each deploy or cold start, and N instances allow N×5 submissions per window.
  2. `trust proxy = 1` is correct only if exactly one proxy sits in front, as with Cloud Run's front end directly.
     - If `herokeg.com` is behind a second layer (Cloudflare, Firebase Hosting, a load balancer), every visitor shares that proxy's IP, so 5 submissions per 15 min **site-wide**: a denial of service on the contact form.
     - If there are zero trusted proxies, `X-Forwarded-For` is spoofable and the limit is bypassable.
- **Fix:** confirm the hosting chain, then set `trust proxy` to match. For stronger abuse resistance, add Cloud Armor or a CAPTCHA (Turnstile or reCAPTCHA) rather than a shared store.

### F-08 — Unknown API routes and wrong methods return the SPA with 200; parser errors return HTML (Low)

- **Evidence:**
  - `GET /api/does-not-exist` returns 200 `text/html`.
  - `GET /api/contact` returns 200 `text/html`.
  - Malformed JSON returns 400 with Express's HTML error page.
- **Tests:** 3 ❌.
- **Impact:** API clients and monitors see false successes; it also feeds F-09 on the client. No stack trace leaks (`NODE_ENV=production`).
- **Fix:** add an `/api` 404 JSON handler before the SPA fallback, plus a JSON error handler for body-parser errors.

### F-13 — SMTP transporter created per request, no timeouts (Low, reliability; not dynamically tested)

- **Where:** `server.ts:129`. nodemailer's defaults give connection/greeting/socket timeouts of up to 2 min/30 s/10 min.
- **Impact:** a stalled SMTP connection holds the HTTP request open for minutes. Cloud Run's request timeout eventually cuts it, and the user sees a proxy error page (feeds F-09).
- **Fix:** create one transporter at startup with `connectionTimeout`, `greetingTimeout` and `socketTimeout` set (around 10–15 s).

## Storage

There are no storage buckets, uploads or signed URLs. Static assets are public by design.
