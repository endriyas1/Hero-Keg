# 06 — Final Report (status: findings ranked, fixes awaiting approval)

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
| F-02 | Vite dev server serves the repo if `NODE_ENV` is unset | High (conditional) | Confirmed locally; production unknown | `package.json` start, `server.ts:236` | 03 §F-02 | Open, proposed | `serves the built SPA, not the Vite dev client`. Passes under the harness, which sets `NODE_ENV`; production needs the manual check. |
| F-01 | Server bundle + sourcemap publicly served | Medium | High (local) | build script, `server.ts:243` | 03 §F-01 | Open, proposed | 2 tests ❌ |
| F-04 | Vulnerable runtime dependencies (13 advisories; reachable: body-parser, qs, nodemailer) | Medium | High | `package-lock.json` | 04 | Open, proposed (`npm audit fix`); nodemailer major needs approval | `npm audit --omit=dev` |
| F-03 | No security headers; `X-Powered-By` exposed | Low–Medium | High (local) | `server.ts` | 03 §F-03 | Open, proposed | 5 tests ❌ |
| F-07 | Rate limit per-instance; depends on proxy topology | Low–Medium | Medium | `server.ts:13, 32-54` | 03 §F-07 | Open; needs hosting info | 2 tests ✅ (one-hop case) |
| F-05 | Submitter PII logged on every submission | Low | High | `server.ts:105` | 03 §F-05 | Open, proposed | 1 test ❌ |
| F-06 | Email field accepts address lists → multi-address Reply-To | Low | High | `server.ts:94` | 03 §F-06 | Open, proposed | 1 test ❌ |
| F-08 | Unknown `/api/*` and wrong methods return 200 HTML; parser errors return HTML | Low | High | `server.ts:245` | 03 §F-08 | Open, proposed | 3 tests ❌ |
| F-09 | Client reports non-JSON errors as network failure | Low | High | `ContactUs.tsx:177-212` | 01 §F-09 | Open, proposed | e2e ❌ (2 viewports) |
| F-10 | Form labels not associated with inputs (WCAG 1.3.1/4.1.2) | Low | High | `ContactUs.tsx:378-500` | 01 §F-10 | Open, proposed | e2e ❌ (2 viewports) |
| F-11 | No compression; hashed assets not cacheable | Low (perf) | High locally / CDN unknown | `server.ts:244` | 05 §F-11 | Open, proposed | — (manual header check) |
| F-13 | No SMTP timeouts; transporter per request | Low | Medium | `server.ts:129` | 03 §F-13 | Open, proposed | Not covered (needs fake-SMTP stall test) |
| F-15 | Canonical/sitemap domain (`herokegservice.com`) differs from production (`herokeg.com`) | Info (SEO/brand) | High | `index.html`, `useSEO.ts`, `public/*` | 04 | Open; needs your decision | — |
| F-12 | Unused `@google/genai`; build tools in runtime deps | Info | High | `package.json` | 04 | Open, proposed | — |
| F-14 | Facebook icon is a dead `<button>` | Info | High | `App.tsx:275` | 01 | Open | — |

**Reproduction:**

```
npm ci
npm test            # build + 46 integration tests
npm run test:e2e    # build + 40 Playwright tests (Chromium)
```

Each ❌ above is a failing test that names the finding in a comment.

## C. Security test results

| Suite | Executed | Passed | Failed (= open findings) | Skipped |
|---|---|---|---|---|
| Integration (Vitest, local server + mail stub) | 46 | 34 | 12 (F-01 ×2, F-03 ×5, F-05, F-06, F-08 ×3) | 0 |
| E2E (Playwright, Chromium desktop + mobile) | 40 | 33 | 4 (F-09 ×2, F-10 ×2)\* | 1 (mobile-menu test on desktop, by design) |
| Type check (`npm run lint`) | 1 | 1 | 0 | — |
| Production build | 1 | 1 | 0 | — |
| Load baseline (local) | 3 stages | 3 | 0 | higher stages not run |

\* The first e2e run also failed `/contact` on both viewports. The Google Maps iframe can't load in this sandbox; this was not a site defect, and the check now ignores third-party requests.

- **Vulnerabilities reproduced (locally):** F-01, F-02 (dev mode), F-03, F-05, F-06, F-08, F-09, F-10, F-11.
- **Vulnerabilities fixed:** none yet. Fixes need your approval (§F).
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

## F. Proposed fix set (awaiting approval; nothing applied yet)

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
