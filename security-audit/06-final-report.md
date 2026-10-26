# 06 — Final Report (status: fixes applied on branch, not deployed)

- **Date:** 2026-10-26
- **Repository:** `endriyas1/Hero-Keg` at `586fc60` (main)
- **Production:** `https://herokeg.com/`

## A. Executive summary

**Posture.** Hero Keg's site is a public marketing SPA with one write endpoint: a contact form that emails the business through Gmail. There is no database, authentication or file storage (owner-confirmed), so the risk surface is small.

The contact endpoint is well defended against the classic attacks:

- HTML and header injection are blocked
- recipients cannot be changed by the client
- request size, field length and request rate are capped
- error messages are generic

**No critical vulnerability was found in the application code.**

**Major risks:**

1. **F-02** — If production doesn't set `NODE_ENV=production`, the live site runs Vite's dev server and serves its source files raw. This is unverified: the production host was unreachable from this session.
2. **F-01** — The production build publishes the server bundle and a sourcemap containing the full backend source (`/server.cjs`, `/server.cjs.map`).
3. **F-04** — Runtime dependencies have known advisories. Those reachable here: body-parser and qs DoS via Express; nodemailer address-parser issues on the Reply-To field.

**Most urgent actions:**

1. Open `https://herokeg.com/` → View Source.
   - If it contains `/@vite/client`, F-02 is live: set `NODE_ENV=production` on the service now.
   - Also try `https://herokeg.com/server.cjs.map`. If it downloads, F-01 is live.
2. Approve the small fix set in §F so it can be applied on this branch with regression tests.

**Scope and limitations:**

- Everything dynamic was run against a local production build.
- There is no staging environment.
- The approved read-only production requests were blocked by this session's network policy.
- Only Chromium was available (Firefox and WebKit skipped).
- The real SMTP path was not exercised; a stub replaced nodemailer.
- Cloud Run/AI Studio configuration is not in the repository and was not reviewed.

## B. Findings register

| ID | Title | Severity | Confidence | Component | Evidence | Fix status | Regression test |
|---|---|---|---|---|---|---|---|
| F-02 | Vite dev server serves the repo if `NODE_ENV` is unset | High (conditional) | Confirmed locally; production unknown | `package.json` start, `server.ts:236` | 03 §F-02 | **Fixed on branch:** the built server always runs in production mode; `start` sets `NODE_ENV`; Vite loads only in development | `built server with NODE_ENV unset` ✅ (fails on the old server) |
| F-01 | Server bundle + sourcemap publicly served | Medium | High (local) | build script, `server.ts:243` | 03 §F-01 | **Fixed on branch:** no server sourcemap; `/server.cjs*` returns 404 | 2 tests ✅ |
| F-04 | Vulnerable runtime dependencies (13 advisories; reachable: body-parser, qs, nodemailer) | Medium | High | `package-lock.json` | 04 | **Partly fixed:** `npm audit fix` and `@google/genai` removed, leaving 1 production advisory (nodemailer, needs major 10.x, **open**) | `npm audit --omit=dev` |
| F-03 | No security headers; `X-Powered-By` exposed | Low–Medium | High (local) | `server.ts` | 03 §F-03 | **Fixed on branch:** CSP, nosniff, X-Frame-Options, Referrer-Policy, HSTS; `X-Powered-By` off | 5 tests ✅ |
| F-07 | Rate limit per-instance; depends on proxy topology | Low–Medium | Medium | `server.ts:13, 32-54` | 03 §F-07 | Open; needs hosting info | 2 tests ✅ (one-hop case) |
| F-05 | Submitter PII logged on every submission | Low | High | `server.ts:105` | 03 §F-05 | **Fixed on branch:** per-submission PII log removed (SMTP-unconfigured fallback log kept) | 1 test ✅ |
| F-06 | Email field accepts address lists → multi-address Reply-To | Low | High | `server.ts:94` | 03 §F-06 | **Fixed on branch:** single-address pattern | 1 test ✅ |
| F-08 | Unknown `/api/*` and wrong methods return 200 HTML; parser errors return HTML | Low | High | `server.ts:245` | 03 §F-08 | **Fixed on branch:** `/api/*` 404 JSON, 405 on `/api/contact`, JSON parser errors | 3 tests + 405 test ✅ |
| F-09 | Client reports non-JSON errors as network failure | Low | High | `ContactUs.tsx:177-212` | 01 §F-09 | **Fixed on branch** | e2e ✅ (2 viewports) |
| F-10 | Form labels not associated with inputs (WCAG 1.3.1/4.1.2) | Low | High | `ContactUs.tsx:378-500` | 01 §F-10 | **Fixed on branch** | e2e ✅ (2 viewports) |
| F-11 | No compression; hashed assets not cacheable | Low (perf) | High locally / CDN unknown | `server.ts:244` | 05 §F-11 | **Fixed on branch:** gzip, plus `max-age=1y, immutable` on `/assets` | `serves hashed assets compressed…` ✅ |
| F-13 | No SMTP timeouts; transporter per request | Low | Medium | `server.ts:129` | 03 §F-13 | **Fixed on branch:** one transporter with 15 s timeouts | Not covered (needs a fake SMTP server that stalls) |
| F-15 | Canonical/sitemap domain (`herokegservice.com`) differs from production (`herokeg.com`) | Info (SEO/brand) | High | `index.html`, `useSEO.ts`, `public/*` | 04 | Open; needs your decision | — |
| F-12 | Unused `@google/genai`; build tools in runtime deps | Info | High | `package.json` | 04 | **Partly fixed:** `@google/genai` removed; build tools still in `dependencies` (see §G) | — |
| F-14 | Facebook icon is a dead `<button>` | Info | High | `App.tsx:275` | 01 | Open | — |

**Reproduction:**

```
npm ci
npm test            # build + 46 integration tests
npm run test:e2e    # build + 40 Playwright tests (Chromium)
```

Each ❌ above is a failing test that names the finding in a comment.

## C. Security test results (before fixes — see §G for after)

| Suite | Executed | Passed | Failed (= open findings) | Skipped |
|---|---|---|---|---|
| Integration (Vitest, local server + mail stub) | 46 | 34 | 12 (F-01 ×2, F-03 ×5, F-05, F-06, F-08 ×3) | 0 |
| E2E (Playwright, Chromium desktop + mobile) | 40 | 33 | 4 (F-09 ×2, F-10 ×2)\* | 1 (mobile-menu test on desktop, by design) |
| Type check (`npm run lint`) | 1 | 1 | 0 | — |
| Production build | 1 | 1 | 0 | — |
| Load baseline (local) | 3 stages | 3 | 0 | higher stages not run |

\* The first e2e run also failed `/contact` on both viewports. The Google Maps iframe can't load in this sandbox; this was not a site defect, and the check now ignores third-party requests.

- **Vulnerabilities reproduced (locally):** F-01, F-02 (dev mode), F-03, F-05, F-06, F-08, F-09, F-10, F-11.
- **Vulnerabilities fixed:** F-01, F-02, F-03, F-05, F-06, F-08, F-09, F-10, F-11, F-13; F-04 and F-12 partly (§G).
- **Remaining unverified risks:**
  - whether F-01/F-02/F-03/F-11 hold on `herokeg.com`
  - hosting proxy chain (F-07)
  - real Gmail SMTP behavior and nodemailer 10 compatibility
  - Firefox/WebKit rendering

## D. Reliability and performance

See `05-reliability-and-performance.md`.

- **Environment:** local only; 1/5/10 VUs × 10 s.
- **Latency:** p95 1.6 / 3.3 / 7.3 ms.
- **Errors:** 0%.
- **Throughput:** peak about 2.7k req/s.
- **Data integrity:** no stored data; double-submit is guarded in the UI and the API is rate-capped.
- **Coverage:** Chromium desktop and mobile; Firefox and WebKit not run.

## E. Production deployment checklist

- [ ] Code changes for approved fixes reviewed (PR)
- [x] Database migrations reviewed: N/A (no database)
- [x] RLS and storage policies: N/A
- [ ] Secret management confirmed: Gmail app password stored only in the Cloud Run/AI Studio secret store; no `.env` in the deployed image
- [ ] `NODE_ENV=production` confirmed on the service (F-02)
- [ ] Backup/recovery: no data to back up. Confirm the Gmail inbox is the system of record and that the 503 fallback is monitored.
- [ ] Monitoring/alerting on `[Gmail SMTP Error]` and `GMAIL_USER … not set` log lines
- [ ] Rollback plan: redeploy the previous Cloud Run revision
- [ ] `npm test` and `npm run test:e2e` green on the release commit
- [ ] Production deployment authorized by the owner

## F. Fix set (applied — see §G — except the nodemailer 10 upgrade)

These are small, local changes on this branch. Each turns its failing tests green. No deployment.

1. **F-01:** drop `--sourcemap` from the server build, and refuse `/server.cjs*` before `express.static`.
2. **F-02:**
   - `start` becomes `NODE_ENV=production node dist/server.cjs`.
   - Load Vite with a dynamic `import()` only in development.
   - Then move the build tools to `devDependencies` (F-12).
3. **F-03:** a header middleware (CSP as in 03 §F-03, nosniff, Referrer-Policy, `frame-ancestors 'none'`) and `app.disable('x-powered-by')`. Verified by e2e: no CSP violations, Maps embed still loads.
4. **F-04:** `npm audit fix` (non-major only) and remove `@google/genai`. **nodemailer 10 as a separate change**, after a staging/real-SMTP check.
5. **F-05:** remove the per-submission PII log line (keep the SMTP-unconfigured fallback log).
6. **F-06:** reject list/quote characters in `email`.
7. **F-08:** JSON 404 for `/api/*`, and JSON error responses for body-parser errors.
8. **F-09:** client checks `response.ok` / content-type before `json()`.
9. **F-10:** `id`/`htmlFor` pairs on the contact form.
10. **F-11:** `compression` middleware (one new dependency) and immutable caching for `/assets`.
11. **F-13:** a single transporter with 15 s timeouts.

**Needs your input rather than code:** F-07 (hosting chain), F-15 (which domain is canonical), F-14 (Facebook URL).


## G. Remediation results (Phases 10–11)

All changes are on branch `claude/gifted-dirac-wsuiix`. **Nothing was deployed** and no production setting was changed.

### Changes

| File | Change |
|---|---|
| `server.ts` | Security headers + CSP (production only), `x-powered-by` off, `compression`, `/server.cjs*` blocked, immutable `/assets` caching, production mode forced when running `dist/server.cjs`, dynamic `import('vite')`, stricter email pattern, PII log line removed, shared SMTP transporter with timeouts, `/api` 404/405 and JSON error handler |
| `package.json` | `start` sets `NODE_ENV=production`; server build has no `--sourcemap`; `test` and `test:e2e` scripts; `+compression`, `−@google/genai`; dev: `vitest@5.0.5`, `@playwright/test@1.56.1`, `@types/compression` |
| `package-lock.json` | `npm audit fix` (non-major). Now at express 4.22.3, body-parser 1.20.9, qs 6.16.1, proxy-addr 2.0.8, vite 6.4.5, nodemailer 8.0.11 |
| `src/pages/ContactUs.tsx` | Non-JSON responses handled with a phone/email fallback; `id`/`htmlFor` on all form controls |

### Validation

| Check | Result |
|---|---|
| `npm run lint` (tsc) | ✅ |
| `npm run build` | ✅ (`dist/server.cjs` only, no `.map`) |
| Integration: **old** server build | 15 failed / 35 passed: the tests detect the original issues |
| Integration: fixed build | **50 / 50 passed** |
| E2E Chromium desktop + mobile | **39 passed, 1 skipped** (mobile-only menu test on desktop). No CSP violations on any route. The CSP is evaluated before network access, so the Fonts and Maps sources are confirmed allowed even though this sandbox can't load them. |
| `npm run dev` | ✅ Vite dev server with HMR client still works |
| `npm start` | ✅ Production build; `/server.cjs` returns 404; CSP and X-Frame-Options present |
| `npm audit --omit=dev` | 1 high (nodemailer ≤ 10.1.3; fix is a major upgrade) |
| `npm audit` (incl. dev) | Same single advisory |

### Still open

- **nodemailer 8 → 10:** semver-major. Needs a real Gmail send from staging or a preview deploy before merging.
- **F-07:** rate-limit correctness depends on the proxy chain in front of `herokeg.com`. Waiting on your answer.
- **F-15:** canonical domain decision.
- **F-14:** Facebook URL.
- **F-12 (rest):** `vite`, `@vitejs/plugin-react` and `@tailwindcss/vite` remain in `dependencies`. The deploy pipeline may install with `--omit=dev` before `npm run build`, so moving them could break the build. Move them only once the AI Studio/Cloud Run build steps are known.
- **HSTS** is now sent with `max-age=31536000`, without `includeSubDomains` or `preload`. Confirm every page of `herokeg.com` is served over HTTPS before deploying; browsers will refuse plain HTTP for a year.
- **Production verification:** after deploying, re-check `view-source:https://herokeg.com/` (no `/@vite/client`), `/server.cjs.map` (404) and the response headers.
- **Firefox/WebKit** e2e runs.
