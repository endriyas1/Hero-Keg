# 04 — Dependencies and Configuration (Phase 5)

**Package manager:** npm 10.9.4, `package-lock.json` v3. Commands were run on 2026-10-26 after `npm ci`. Nothing was auto-fixed: no `npm audit fix` and no upgrades.

## `npm audit --omit=dev`: 13 advisories (1 critical, 7 high, 4 moderate, 1 low)

Every advisory is in a runtime dependency. Build tools (`vite`, `@tailwindcss/vite`, `@vitejs/plugin-react`) are listed under `dependencies`, so they count as production packages.

| Package (installed) | Severity | Reachable in this app? | Fix |
|---|---|---|---|
| **nodemailer 8.0.8** (direct) | High | **Partly.** `replyTo` takes attacker input (≤ 200 chars, regex-filtered), so addressparser issues (GHSA-8c8m-p3m8-cjg8, -m943-m63m-w62w, -85x2-q946-cp5h, quadratic parsing -2x7j-588g-ccc2/-v53p-9fqp-m79j) touch user data. Their impact here is limited to the Reply-To header. `to` is fixed from env, and `raw`, `attachments`, DKIM, List-* and jsonTransport are unused. | **10.2.1: semver-major, needs approval** and a real-SMTP test in staging |
| **body-parser 1.20.5** (via express) | High | **Yes.** `express.json()` runs on every POST. GHSA-27r3-jxmh-p828 (compressed-body trailing bytes DoS) is reachable. | `npm audit fix` (non-major) |
| **qs 6.15.2** (via express) | Moderate | **Yes.** Express parses every query string with qs (GHSA-4mjr-xmp4-gh2g DoS). | `npm audit fix` |
| **proxy-addr** (via express) | **Critical** | **No.** GHSA-jqcg-44mw-7w3h needs a subnet trust list with IPv4-mapped IPv6; this app uses a hop count (`trust proxy = 1`). | `npm audit fix` |
| **vite 6.4.2** (direct) | High | **Only if F-02 is true** (dev server in production). The Windows-only items are not applicable on Cloud Run Linux. GHSA-9jrq-w75r-8gcw and GHSA-rq7h-c2jc-7f22 apply to the dev server. | 6.4.5 (in range) via `npm audit fix` |
| esbuild, postcss, source-map-js, browserslist, baseline-browser-mapping, nanoid | Low–High | Build-time only, no untrusted input | `npm audit fix` |
| protobufjs (via `@google/genai`) | Moderate | No. `@google/genai` is never imported (F-12). | Remove the dependency |

**Recommendation:**

1. Run `npm audit fix` (no `--force`) and re-run the test suites.
2. Remove `@google/genai`.
3. Upgrade nodemailer 8 → 10 as a separate, reviewed change, validated against a real Gmail account in staging.
4. Move `vite`, `@vitejs/plugin-react` and `@tailwindcss/vite` to `devDependencies` once F-02 is fixed. The production server must not import `vite`; it currently imports it statically at the top of `server.ts`, so that needs a dynamic import.

## Outdated (selected)

| Package | Current | Wanted | Latest |
|---|---|---|---|
| express | 4.22.2 | 4.22.3 | 5.3.0 |
| nodemailer | 8.0.8 | 8.0.11 | 10.2.1 |
| vite | 6.4.2 | 6.4.5 | 8.3.5 |
| react / react-dom | 19.2.6 | 19.3.1 | 19.3.1 |
| @google/genai | 2.6.0 | 2.31.0 | — (unused) |

## Secrets and configuration

| Check | Result |
|---|---|
| Secrets in git history (Google keys, `sk-`, private keys, `service_role`, Slack tokens) | None found across all commits; only `.env.example` (empty values) ever committed |
| `.gitignore` | Ignores `.env*` except `.env.example`, plus `node_modules`, `dist`, `build`. Test outputs (`test-results/`, `playwright-report/`) added in this audit. |
| Privileged credentials in client bundle | None (grep over `dist/assets/*.js`) |
| Env vars | `GMAIL_USER`, `GMAIL_APP_PASSWORD`, `CONTACT_RECIPIENT_EMAIL` (server only); `GEMINI_API_KEY`, `APP_URL` (documented but unused); `DISABLE_HMR` (dev only); `NODE_ENV` (**see F-02**) |
| `dotenv` | Loads `.env` from the CWD at startup. Fine, but the deployed image must not include a `.env`. |
| Source maps | Server sourcemap is publicly served (**F-01**). Client build has no sourcemaps (Vite default). |
| CORS | None configured (same-origin only); appropriate |
| CSP / security headers | None (**F-03**) |
| Cookies | None set |
| CI/CD | No workflows in the repo, so no pipeline secret exposure to review. Deployment config (AI Studio / Cloud Run) is outside the repo and was not reviewed. |
| Debug settings | Vite dev middleware is the default whenever `NODE_ENV` is unset (**F-02**) |
| Domains | Canonical, OG, JSON-LD, sitemap and robots URLs all use `https://www.herokegservice.com`, but the owner gives the production URL as `https://herokeg.com/` (**F-15**). If `herokegservice.com` isn't owned and redirected, search engines are sent to a domain you may not control. |

## F-12 — Unused and misplaced dependencies (Informational)

- `@google/genai` is never imported. It pulls in protobufjs and other transitive packages, all supply-chain surface for no use.
- Build tools sit in `dependencies`, which inflates the production install and the audit surface.
