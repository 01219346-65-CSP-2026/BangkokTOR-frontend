# Local setup

The app runs on **:3003**. That port is fixed: `AUTH_URL` and the Google OAuth
redirect URI are both built against it, so sign-in breaks on 3000. Everything
past the landing page needs the backend on **:8003**; see the
[backend setup](https://github.com/01219346-65-CSP-2026/BangkokTOR-backend/blob/main/docs/setup.md).

## Prerequisites

- [Bun](https://bun.sh) 1.x
- A running backend (local or shared)
- From the team: a Google OAuth client, plus the shared `ADMIN_TOKEN` and
  `INTERNAL_JWT_SECRET`. Never commit them.

## Run it

```bash
bun install
cp .env.example .env.local     # fill in the values (table below)
bun run dev                    # http://localhost:3003
```

No Google client yet? Set `NEXT_PUBLIC_AUTH_BYPASS=true` for a dev "bypass"
sign-in. A production build refuses to start with it on.

Quick check that the guard works: `curl -I localhost:3003/dashboard` returns
a 307 to `/login`.

## Environment variables

| Variable | What it is |
|---|---|
| `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` | Google OAuth client |
| `AUTH_SECRET` | Encrypts the session cookie (`bunx auth secret` generates one) |
| `AUTH_URL` | `http://localhost:3003` locally |
| `BACKEND_URL` | `http://localhost:8003` locally; docker compose forces `http://backend:8003` |
| `INTERNAL_JWT_SECRET` | **Must match the backend.** Signs the 60-second user token |
| `ADMIN_TOKEN` | **Must match the backend.** Sent as `X-Admin-Token`; server-side only |
| `NEXT_PUBLIC_AUTH_BYPASS`, `AUTH_BYPASS_USER_ID`, `AUTH_BYPASS_USER_EMAIL`, `AUTH_BYPASS_USER_NAME` | Dev-only sign-in bypass |

Only variables prefixed `NEXT_PUBLIC_` reach the browser. Never give a secret
that prefix.

## Before you push

```bash
bunx tsc --noEmit
bun test
bunx eslint src
NEXT_PUBLIC_AUTH_BYPASS=false bunx next build   # only if you changed config or auth
```

CI runs none of these (see [deployment.md](deployment.md)), so run them yourself.

Next: [team/workflow.md](team/workflow.md)
