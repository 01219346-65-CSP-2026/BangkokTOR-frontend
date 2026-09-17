# BangkokTOR — frontend

The reading surface for BangkokTOR: a searchable record of Thai government
procurement announcements (terms of reference, "TOR").

The source portal publishes a Thai title and a stack of PDFs. This app reads
that record back — what kind of contract it is, who is buying, what it is
worth, and whether the documents can be read at all — in Thai or English.

---

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, NextAuth v5 (beta).

The dependency list is short on purpose: `AGENTS.md` asks you to add none. No
SWR or TanStack Query — `src/api/useEndpoint.ts` is the one fetch hook. No i18n
library — `src/i18n/` is a context and an object literal.

## Running it locally

```sh
bun install
cp .env.example .env.local   # then fill it in, see below
bun run dev                  # :3003, NOT the Next default 3000
```

The port matters: `AUTH_URL` and the Google redirect URI are both built against
`:3003`, so running on 3000 breaks sign-in.

You need a backend for anything but the landing page. Point `BACKEND_URL` at a
local `bun run dev` in the backend repo (`http://localhost:8003`), or at the
compose one.

Set `NEXT_PUBLIC_AUTH_BYPASS=true` to get a "Skip Google sign-in" button on the
login page, which signs you in as a fake local user with no OAuth round trip.
The build throws if this is true with `NODE_ENV=production`.

Checks: `bunx tsc --noEmit`, `bunx eslint src`.

**The production build needs the bypass off.** `src/lib/auth.ts` throws at module
scope if `NEXT_PUBLIC_AUTH_BYPASS=true` in a production build — a deliberate
guard against shipping the dev auth hole. So from a dev checkout, where
`.env.local` has it on, build like this:

```sh
NEXT_PUBLIC_AUTH_BYPASS=false bunx next build
```

A bare `bun run build` failing with "NEXT_PUBLIC_AUTH_BYPASS=true is set in a
production build" is the guard working, not a broken build.

## How data flows

**The browser never talks to the backend.** Two hops, always:

```
browser  →  fetch('/api/tors')          same origin, via useEndpoint
         →  app/api/tors/route.ts       a Next route handler
         →  src/api/client.ts           server-only, reads BACKEND_URL
         →  backend :8003
```

This is why `BACKEND_URL` has no `NEXT_PUBLIC_` prefix — it is server-only, and
the backend port never has to face the browser. The route handlers also
allowlist which query parameters get forwarded and clamp `limit`, so a crafted
URL cannot widen the query.

`src/api/tors.ts` is the mapping seam: backend shape → `toTor()` → app shape.
Renames live there, not in components. One rule worth knowing: the backend's
`status` field is the *pipeline* stage and must never be shown to a reader —
`statusId` is the procurement status.

## Layout

```
src/app/(public)/        pages inside the NavBar shell
src/app/login,signup     auth flow — AuthShell, not the NavBar
src/app/admin/           admin panel — same NavBar, extra links
src/app/api/             route handlers that reach the backend
src/proxy.ts             the auth guard (see below)
src/api/                 client.ts (server-only), useEndpoint, tors.ts
src/i18n/                Translations.tsx, LanguageProvider, format
src/components/          nav, tor, skills, notifications, tour, ui
src/lib/                 torFilters, torMatching, torSignals, skillProfile
src/data/                ⚠ mock data — see Placeholders
```

### `src/proxy.ts` is the middleware

Next 16 renamed `middleware.ts` to `proxy.ts`; both names still work. This
trips people up — the file *is* live, and it gates `/dashboard`, `/skills` and
`/admin`, redirecting to `/login?callbackUrl=…`. Verify with
`curl -I localhost:3003/dashboard`, which should be a 307.

## Design system

`CLAUDE.md` has the full version. The rule that catches people:

**Never use a raw Tailwind colour utility.** No `green-600`, no `emerald-*`, no
`zinc-*` for text. Every colour is a token defined in `src/app/globals.css`:

| Token | Use |
|---|---|
| `moss-700` | headings, the nav band |
| `sage-600` | primary buttons, links |
| `sage-400` / `sage-100` | borders, hairlines |
| `paper-50` / `mist-50` | page and panel grounds |
| `ink-600` / `ink-500` | body copy, labels |
| `clay-500` | errors, advisory observations |

Also: `rounded-field` not `rounded-xl`, `ease-soft` for transitions, and no
gradients — a hardcoded hex ramp cannot follow a palette change.

## Internationalisation

Hand-rolled, Thai by default.

- `src/i18n/Translations.tsx` — one object per locale, grouped into namespaces
  (`nav`, `tor`, `skills`, `notifications`, `tour`, …).
- `useTranslations("namespace")` in a component; `useLanguage()` for the locale
  itself.
- Interpolation is manual: `t.pageStatus.replace("{page}", …)`.

To add a string, add the key to **both** `en` and `th`. They are one object
type, so a missing key is a type error rather than a runtime blank.

Thai text gets `lang="th"` on its element — that is what selects Noto Sans Thai
and gets the line breaking right.

## Placeholders

Several surfaces run on mock data. They are marked in-file, but so you know
before you trust a number:

- `src/lib/torMatching.ts` — **the entire fit/deadline/skills layer.** Fit
  scores are derived from a hash of the TOR id against a hardcoded fictional
  profile. Deadlines are invented; the portal publishes no closing date. Delete
  this module once real matching exists.
- `src/data/notifications.ts` — the notification feed. Held in
  `NotificationsProvider`, which is the seam where a real feed plugs in.
- `src/lib/skillProfile.ts` — persists to localStorage, not a server.

## Deployment

```
router NAT → caddy:80 → frontend:3003 → backend:8003 (docker network only)
```

Neither app publishes a host port; Caddy is the single entry point and carries
the security headers. First-time setup needs the shared network, which compose
will not create: `docker network create bangkoktor-net`.

A push to `main` triggers a self-hosted runner that pulls into
`~/Prod/csp/<repo>` and runs `docker compose up -d --build`. Because the deploy
is a `git pull --ff-only`, **never edit files directly in the prod checkout** —
an uncommitted change there aborts every subsequent deploy.

Production is currently plain HTTP. NextAuth v5 expects `__Secure-` cookie
prefixes when it believes it is on HTTPS, so sign-in wants TLS on Caddy before
it is reliable — see `~/Prod/csp/caddy/README.md`.
