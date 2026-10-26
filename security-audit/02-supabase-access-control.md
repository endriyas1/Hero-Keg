# 02 — Supabase / Access Control (Phase 3)

## Status: not applicable

The owner confirmed (Phase 1, question 1) that **there is no Supabase project or other database** behind this site. The repository contains:

- no authentication: no registration, login, sessions, tokens or password recovery
- no user roles or permission checks
- no database tables, views, functions, triggers or migrations, so no RLS policies
- no OAuth redirects

None of the Phase 3 checks (authentication lifecycle, role escalation, IDOR, RLS `USING`/`WITH CHECK`, `search_path`, dynamic SQL) has an object to test.

## Access-control model that does exist

| Actor | Public pages | `POST /api/contact` | Business inbox / SMTP account |
|---|---|---|---|
| Anonymous visitor | Read | Allowed by design (rate-limited: 5 per IP per 15 min) | No access: the server sends with fixed `from`/`to`; the client cannot set recipients |
| Site owner | — | — | Via Gmail directly (outside this app) |

The one privileged operation is "send an email using the business Gmail account", which any visitor can trigger. The controls on it are tested in `tests/integration/contact-api-security.test.ts`:

- recipients are fixed server-side, so mass-assignment of `to`/`cc`/`bcc`/`from`/`attachments` is ignored (test passes)
- header values are CR/LF-stripped (test passes)
- the rate limit holds and can't be bypassed by prepending `X-Forwarded-For` entries (test passes)

## If authentication or a database is added later

Re-run this phase. At minimum:

- enable RLS on every table holding personal data
- derive policies from `auth.uid()`
- deny the `anon` role by default
- keep service-role keys server-side only
- add integration tests per actor, as in the matrix the audit brief describes
