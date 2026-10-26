# 01 — Frontend Security (Phase 2)

- **Scope:** `src/**` (React 19 SPA, 11 TS/TSX files, about 4,300 lines including `server.ts`) and `index.html`.
- **Method:** manual review plus the Playwright suite in `tests/e2e/`, run against a local production build.

## Summary

The frontend has a small attack surface. It has no authentication, no stored state and no rendering of user- or server-supplied HTML. The only data the SPA sends is the contact form. **No exploitable frontend vulnerability was found.**

Three low-severity issues are recorded below; two of them are reliability and accessibility rather than security.

## Checks performed

| Check | Result | Evidence |
|---|---|---|
| XSS / unsafe HTML (`dangerouslySetInnerHTML`, `innerHTML`, `eval`, `new Function`) | None present | `grep` over `src/`, `index.html` |
| JSON-LD injection | Not exploitable: `useSEO` writes `JSON.stringify(schema)` via `textContent` into a `type="application/ld+json"` script, and all schema data is static | `src/hooks/useSEO.ts:94-103` |
| URL/query/hash injection | Path and hash are only compared against fixed strings to pick a page. Query strings are never read. | `src/App.tsx:32-41` |
| Open redirect | None. All navigation is `history.pushState` to fixed internal paths. No redirect parameters exist. | `src/App.tsx:55-73` |
| Reverse tabnabbing | All `target="_blank"` links carry `rel="noopener noreferrer"` | e2e `external links open safely` (pass) |
| Client-only authorization | N/A: no protected pages, roles or auth | — |
| localStorage / sessionStorage | Not used | `grep` |
| Tokens/secrets in bundle | None. No `import.meta.env`/`VITE_*` usage; built JS has no `GMAIL`, `process.env` or key patterns. | `grep` over `dist/assets/*.js` |
| Error handling exposure | Client shows only server-provided `message` strings or a fixed fallback. `console.error` logs the fetch error object locally only. | `src/pages/ContactUs.tsx:206-212` |
| Input validation | HTML `required`/`type=email` and a JS check exist, and the server re-validates everything (see 03). Frontend validation is not the control. | `ContactUs.tsx:148-164`, `server.ts:77-99` |
| File upload/download | None | — |
| CSP compatibility | Needs `style-src 'unsafe-inline'` (`motion` writes inline styles) and `frame-src https://www.google.com` (Maps embed on `/contact`). No inline executable scripts; the JSON-LD blocks are non-executable data. | — |
| Double submit | Button is disabled while submitting; a double-click sent exactly 1 request | e2e `double-clicking submit…` (pass) |
| Honeypot | Off-screen, `tabindex=-1`, inside `aria-hidden` | e2e (pass) |

## Findings

### F-09 — Non-JSON error responses are reported as "check your network connection" (Low, reliability)

- **Where:** `src/pages/ContactUs.tsx:177, 206-212`.
- **Cause:** `response.json()` throws on HTML bodies, and the `catch` branch tells the user their network failed. Express returns HTML for 400/413, and Cloud Run or a proxy returns HTML for 502/503/504.
- **Impact:** misleading message. The user may retry repeatedly instead of using the phone/email fallback.
- **Evidence:** e2e `a non-JSON error response is not reported as a network problem` **fails** on desktop and mobile Chromium.
- **Fix:** check `response.ok` and `content-type` before parsing. On a non-JSON error, show the server-unavailable message with the phone/email fallback.

### F-10 — Form labels are not associated with their inputs (Low, accessibility)

- **Where:** `src/pages/ContactUs.tsx:378-500`. The `<label>` elements have no `htmlFor`, and the inputs have no `id`.
- **Impact:** screen readers announce the placeholder or nothing. Clicking a label doesn't focus its field. This fails WCAG 2.1 SC 1.3.1 / 4.1.2.
- **Evidence:** e2e `every visible form control has an accessible label` **fails** (`getByLabel('Full Name')` finds no element).
- **Fix:** add `id` plus `htmlFor` pairs, a markup-only change.

### F-14 — Facebook icon is a `<button>` with no action (Informational)

- **Where:** `src/App.tsx:275`.
- **Impact:** it is a dead control for keyboard and screen-reader users.
- **Fix:** make it a link to the real page, or remove it.

## Not applicable to this codebase

Client-side authorization, role-based routes, session handling and token storage don't apply: the app has no authentication.
