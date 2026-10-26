# 05 — Reliability and Performance (Phases 7–9)

## Test environment (actual)

| Item | Value |
|---|---|
| Target | Local production build: `NODE_ENV=production node dist/server.cjs` on 127.0.0.1:3000 |
| Machine | Cloud sandbox container, 4 vCPU, Node 22.22.0 |
| Email | nodemailer replaced by capture stub; no mail sent |
| Production | **Not tested.** `herokeg.com` is blocked by this session's network policy, and no staging exists. |
| Browsers | Playwright 1.56.1, Chromium 141 only: desktop (1280×720) and mobile (Pixel 7 emulation, 412×915). Firefox and WebKit are not installed in this environment and were **skipped**. |

## Reliability results

Integration tests are in `tests/integration/contact-api-security.test.ts`; e2e tests are in `tests/e2e/contact-form.spec.ts` and `tests/e2e/navigation.spec.ts`.

| Scenario | Result |
|---|---|
| Failed network request, then retry | ✅ Error shown, input preserved, retry succeeds, exactly 2 requests |
| Server 500 JSON | ✅ Server message shown, input preserved, button re-enabled |
| SMTP outage (sendMail rejects) | ✅ 500 with phone/email fallback, no internal detail |
| SMTP not configured | ✅ 503, never reports success |
| Non-JSON error (proxy 502, Express 413/400) | ❌ Shown as "check your network connection" (**F-09**) |
| Duplicate / double click | ✅ One request per submission (button disabled during flight) |
| Duplicate API calls (scripted) | ⚠️ No idempotency: each call sends an email; capped at 5 per 15 min per IP by the rate limit |
| Invalid / incomplete submissions | ✅ Browser blocks empty required fields; server rejects missing, whitespace-only and non-string fields |
| Consent checkbox | ✅ Required client-side. Not enforced server-side; the server ignores `agreed`. Acceptable: consent is a UX gate, not a security control. Note it if consent is a compliance requirement. |
| Over-long input | ⚠️ Server silently truncates (message > 5,000 chars). The textarea has no `maxLength`, so a long message loses its tail without warning. |
| Browser refresh / direct navigation | ✅ All 6 routes render the correct page and title on direct load and reload; unknown paths fall back to Home |
| Back/forward | ✅ URL and page stay in sync |
| Console errors / failed same-origin requests | ✅ None on any route (desktop and mobile) |
| Stalled SMTP connection | Not tested dynamically; see **F-13** (no timeouts) |
| Concurrent updates, pagination, constraints, time zones | N/A: no database or stored data |

## Responsive and accessibility results

| Check | Desktop | Mobile |
|---|---|---|
| No horizontal overflow on all 6 routes | ✅ | ✅ |
| Mobile menu toggles with correct `aria-expanded`/label and closes on navigation | — | ✅ |
| `target="_blank"` links use `noopener` | ✅ | ✅ |
| Honeypot hidden and unfocusable | ✅ | ✅ |
| Form controls have accessible labels | ❌ **F-10** | ❌ **F-10** |

## Performance

### Passive analysis (production build)

| Item | Measurement |
|---|---|
| JavaScript total | 513 KB raw / **147 KB gzip** across 12 chunks; route-level code splitting is in place |
| Largest chunks | `vendor-react` 217 KB (65 KB gz), `vendor-motion` 127 KB (41 KB gz), `Services` 53 KB (9 KB gz) |
| CSS | 55 KB raw / 9 KB gzip |
| Images | about 1.8 MB of WebP/JPEG across the site; largest single image 179 KB. PR #3 already converted the multi-MB PNGs. |
| HTTP compression | **None.** Express serves JS/CSS uncompressed (`Content-Encoding` absent locally), so first visit transfers about 568 KB of JS+CSS instead of about 156 KB. **F-11** (whether a CDN in front compresses on `herokeg.com` is unverified). |
| Caching | Hashed `/assets/*` files are served with `Cache-Control: public, max-age=0`, so every repeat view revalidates every asset. They could be `max-age=31536000, immutable`. **F-11**. |
| Polling, N+1, repeated requests | None; the SPA makes no data requests apart from the contact POST |
| Third-party | Google Maps iframe on `/contact` loads eagerly; consider `loading="lazy"` |

### Controlled load baseline (local only; not representative of production)

Measured with `tests/performance/load-baseline.mjs` (no new dependency; refuses non-local targets unless `ALLOW_REMOTE=1`).

- Closed loop over `GET /`, `/contact` and `/robots.txt`, 10 s per stage.
- `POST /api/contact` excluded: every call would send an email.
- k6 is not installed here; the script reports the same metrics.

| VUs | Requests | Req/s | p50 | p95 | p99 | Error rate | Timeouts |
|---|---|---|---|---|---|---|---|
| 1 | 9,090 | 909 | 1.00 ms | 1.63 ms | 3.92 ms | 0 | 0 |
| 5 | 26,476 | 2,648 | 1.66 ms | 3.27 ms | 7.40 ms | 0 | 0 |
| 10 | 27,654 | 2,765 | 3.27 ms | 7.34 ms | 10.88 ms | 0 | 0 |

Server RSS after the run: about 172 MB.

Throughput saturates at about 2.7k req/s on one Node process, and latency rises linearly beyond 5 VUs. These numbers measure the Node process on loopback, not network, TLS, Cloud Run cold starts or the real client experience.

No production SLOs are documented, so no thresholds were applied. Higher stages were not run.

**Before any staging run:** point `BASE_URL` at staging, set `ALLOW_REMOTE=1`, and start at `STAGES=1` with a short `DURATION_S`.

## F-11 — No compression and no long-lived caching for hashed assets (Low, performance)

- **Fix:**
  - Add `compression` middleware, or confirm the CDN does it.
  - Serve `/assets` with `maxAge: '1y', immutable: true`.
  - Keep `index.html` at `no-cache`.
- **Expected effect:** about 72% fewer bytes on first load; zero revalidation requests for assets on repeat visits.
