# BangkokTOR docs

Start here. In about 15 minutes you'll know how the app fits together, how to
run it, and how the team ships a change.

BangkokTOR collects software-related Thai government procurement TORs,
structures them, matches them to dev teams by skill profile, and flags tenders
that look unfair, always in advisory wording (FR-19). The requirements are in
the SRS (`CSP project v2.pdf`, FR-01 to FR-24, NFR-01 to NFR-10).

## Read in this order (≈15 min)

| # | File | Time | You'll know |
|---|---|---|---|
| 1 | [architecture.md](architecture.md) | 4 min | The whole system, the pages, how a request and sign-in flow |
| 2 | [setup.md](setup.md) | 3 min | How to run the app locally against a backend |
| 3 | [team/workflow.md](team/workflow.md) | 3 min | Branches, `QA` → `main`, hotfixes |
| 4 | [team/process.md](team/process.md) | 2 min | Sprint loop, how to create and do a task |
| 5 | [team/pull-requests.md](team/pull-requests.md) | 3 min | Commit messages, PR template, Definition of Done |

## Reference

| File | What |
|---|---|
| [Backend API reference](https://github.com/01219346-65-CSP-2026/BangkokTOR-backend/blob/main/docs/api.md) | Every backend endpoint the BFF calls |
| [Backend data model](https://github.com/01219346-65-CSP-2026/BangkokTOR-backend/blob/main/docs/data-model.md) | Mongo collections and the TOR lifecycle |
| [deployment.md](deployment.md) | Environments, how a merge deploys, rollback |
| [team/glossary.md](team/glossary.md) | TOR, FR, UAT, BFF, BE year… |
| `CLAUDE.md` (repo root) | UI conventions: tokens, layout, components, writing |

## The two repos

| Repo | What | Port |
|---|---|---|
| [BangkokTOR-frontend](https://github.com/01219346-65-CSP-2026/BangkokTOR-frontend) (this one) | Next.js 16 web app and its server-side API proxy | 3003 |
| [BangkokTOR-backend](https://github.com/01219346-65-CSP-2026/BangkokTOR-backend) | Express 5 API, ingestion and AI workers, MongoDB | 8003 |

Files under `team/` and `deployment.md` are the same in both repos; if you
change one, change both.

> The repo-root `README.md` is partly out of date. Notifications come from the
> backend now, not `src/data/notifications.ts`; the skill profile is stored
> through `/api/profile`, not localStorage; and `/profile` is guarded too.
> Where it disagrees with these docs, the code and these docs win.
