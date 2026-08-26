<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# UI work

Before writing or changing any UI, read [`CLAUDE.md`](./CLAUDE.md) in this directory. It
defines the design tokens, component conventions, and quality floor for this app. The
short version: all color comes from `@theme` tokens in `src/app/globals.css` — never use
raw Tailwind color utilities like `green-600`; use `rounded-field` for interactive
controls; extend `src/app/components/ui/` instead of styling inline; and add no new
dependencies.
