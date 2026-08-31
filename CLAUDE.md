
@AGENTS.md

# BangkokTOR frontend — UI conventions

Read this before writing or changing any UI. It describes the "Ledger" design system
this app uses. The goal is that a screen built next month by a different person (or a
different AI) is indistinguishable from one built today.

**Product context:** BangkokTOR surfaces Thai government procurement terms-of-reference.
The audience is people who work with tender documents. The interface should feel like
well-kept records — precise, legible, unhurried. Not a consumer startup landing page.

---

## 1. Color: use the tokens, never raw Tailwind colors

All color lives in `@theme` in `src/app/globals.css`.

| Token | Hex | Use for |
|---|---|---|
| `moss-700` | `#2f4739` | Headings, body text, primary-button hover |
| `sage-600` | `#4a6b55` | Primary buttons, links, step eyebrow |
| `sage-400` | `#7d9c87` | Input and chip borders |
| `sage-100` | `#e4ede6` | Dividers, hairlines, ghost/secondary hover |
| `paper-50` | `#f7f5ef` | Page canvas (`body`) |
| `mist-50` | `#f4f8f4` | Light green form surface (auth right column) |
| `clay-500` | `#b4553c` | Errors only |
| `zinc-*` | Tailwind default | Secondary text (`600`), placeholders (`400`) |

**Rule: never write `green-600`, `red-500`, `emerald-*`, or any raw color utility in a
component.** Use the tokens above.

*Why this rule exists:* the original UI put its palette in scattered `green-*` utilities
across three files. There was no single place to change the brand, the code's bright
`green-600` clashed with the muted sage artwork, and a `green-300/50` input fill with
`emerald-800/60` placeholder text failed WCAG AA contrast. Tokens fix all three.

`--color-background` / `--color-foreground` still exist **only** for the untouched
create-next-app landing page (`src/app/page.tsx`). Delete both when that page is rebuilt.

## 2. Shape and spacing

- **One radius for interactive controls**: `rounded-field` (10px). Inputs, buttons, chips,
  dropdowns. Do not mix in `rounded-lg`, `rounded-xl`, etc.
- **No pills.** `rounded-full` on inputs and buttons was the loudest "toy-like" signal in
  the original UI. The only legitimate `rounded-full` is the button's loading spinner.
- Form field gap: `gap-4`. Section gap: `mt-7` to `mt-9`.
- Tokens are `--radius-*` so Tailwind generates the utility. **`rounded-[--radius-field]`
  silently produces no CSS** — it compiled to nothing and shipped square corners before
  this was caught. Use `rounded-field`, or `rounded-(--var)` for arbitrary values.

## 2b. Motion

Motion is one orchestrated page-load sequence, not scattered effects.

- `.rise` (fade + 10px lift) with `--rise-delay` set inline declares the entrance order in
  the markup. `.settle` is the brand panel's slow scale-in. Both are in `globals.css`.
- Stagger in ~60–80ms steps. Keep the whole sequence under ~450ms.
- Hover/press: `transition duration-200 ease-soft`, plus `active:scale-[0.985]` on buttons.
- `--ease-soft` is the only easing curve. Named `--ease-*` so Tailwind emits `ease-soft`.
- Both `.rise` and `.settle` are disabled under `prefers-reduced-motion`.

**Name theme tokens with Tailwind's expected prefix** (`--radius-*`, `--ease-*`,
`--color-*`) so the utility is generated. Custom names like `--ease-out-soft` produce no
utility, and `transition-[a,b,c]` with commas also silently fails. Prefer the plain
`transition` utility with a token-generated easing.

## 3. Layout: no cards inside same-colored panels

`AuthShell` is a two-column split — watercolor brand panel (42%, `lg+`) and a white form
column. The form sits **directly on the surface**, left-aligned to a fixed measure.

Do not wrap forms in a bordered/shadowed card. A card inside an already-white column
stacks card padding + column padding + centering slack, which reads as excessive empty
space, and a white card border on white is invisible anyway. This is how Linear, Stripe,
and Vercel structure split auth screens.

Measures: login `24rem`, signup `26rem`, skills `30rem`. Auth forms read best at 380–460px
regardless of viewport width — never let a form stretch to fill the column.

## 4. Components

Everything reusable lives in `src/app/components/ui/`. **Extend these rather than styling
inline in a page.** If you need a new variant, add it to the component.

- Variants are hand-rolled `Record<Variant, string>` lookups.
  **Do not add `cva`, `clsx`, or `tailwind-merge`** — this repo has exactly three runtime
  dependencies (`next`, `react`, `react-dom`) and keeps it that way.
- `Button`: `variant` (primary/secondary/ghost), `size` (sm/md), `fullWidth`, `isLoading`.
- `TextField`: `label` (required), `error`, `hint`. Passing `error` wires up
  `aria-invalid` and `aria-describedby` automatically — use it instead of rendering your
  own error paragraph.
- Every interactive element ships a `focus-visible:ring-2` ring. No exceptions.

## 5. Type

- `font-sans` (Geist) — body and UI. The default; you rarely write it.
- `font-display` (Fraunces) — headings only, `text-3xl tracking-tight`.
- `font-mono` (Geist Mono) — the step eyebrow and small structural labels, `text-xs
  tracking-widest uppercase`.

The mono eyebrow (`01 ACCOUNT`) is the system's signature element. Numbering is used
**because signup genuinely is an ordered two-step sequence.** Do not add numbered markers
to content that isn't a real sequence — that's decoration pretending to be structure.

## 6. Writing

- Sentence case everywhere — headings, labels, buttons. Not Title Case.
  (`First name`, not `First Name`. `Log in`, not `LOG IN`.)
- Buttons name their action and keep that name through the flow: `Save skills` →
  "Skills saved". Never `Submit`.
- Errors say what to do next: `"Those passwords don't match. Re-enter them to continue."`
  not `"Passwords don't match."`
- Empty states invite an action: `"Search below to add your first skill."` not
  `"No skills added yet."`
- Placeholders carry real information or are omitted. Never repeat the label as the
  placeholder, and never use a fake-looking example like `Username@gmail.com`.
- Prefer a labeled button over a bare icon (`Add`, not `+`) unless space genuinely forbids.

## 7. Quality floor — non-negotiable

Before considering any UI done:
- Responsive to 375px with no horizontal scroll.
- Visible keyboard focus on every interactive element.
- WCAG AA contrast on all text.
- `prefers-reduced-motion` respected (handled globally in `globals.css`).
- Errored fields carry `aria-invalid` + `aria-describedby`.
- `npx tsc --noEmit`, `npm run lint`, and `npm run build` all pass.

## 8. Defects this system was built to prevent

Real bugs found in the original UI. Check for these:
1. **`body { font-family: Arial }` in `globals.css`** silently overrode the Geist fonts
   loaded in `layout.tsx`. The entire auth flow rendered in Arial. *Verify fonts by
   computed style, not by the class being present.*
2. **`font-display` used on every heading but `--font-display` never defined.** The class
   was a no-op for weeks. *A utility that references an undefined token fails silently.*
3. **`rounded-[--radius-field]` generated no CSS** — every control shipped square.
   *Check the compiled CSS, not just the JSX.*
3b. **`ease-(--ease-out-soft)` and `transition-[a,b,c]` generated no CSS** — the same
   failure mode, caught the same way: `grep -o '\.ease-soft{[^}]*}'` on the built file in
   `.next/static/chunks/*.css`.
4. **`"space for the logo"` placeholder text shipped** in `AuthShell`.
5. **Green-on-green input fill failed contrast** (`emerald-800/60` on `green-300/50`).

The pattern: three of these are things that look right in the source but produce nothing
in the browser. **Confirm visual changes in the running app, not only in the markup.**

## 9. Next.js 16

This repo is on Next.js 16 with Turbopack and Tailwind v4 (CSS-first, **no
`tailwind.config.js`** — all config is `@theme` in `globals.css`).

APIs here differ from older training data: `LayoutProps<"/">` for typed layout props,
`SubmitEvent` imported from `react`. Consult `node_modules/next/dist/docs/` rather than
recalling. Dev server runs on **port 3003**.

## 10. Map

```
src/app/
├── globals.css                    ← all design tokens live here
├── layout.tsx                     ← font loading
├── page.tsx                       ← ⚠ still the create-next-app template
├── login/page.tsx
├── signup/page.tsx                ← step 01
├── signup/skills/page.tsx         ← step 02
└── components/
    ├── auth/AuthShell.tsx         ← two-column split, step indicator, entrance sequence
    ├── brand/Logo.tsx             ← seal mark + wordmark, size sm/md/lg
    ├── ui/Button.tsx
    ├── ui/TextField.tsx
    └── icons/GoogleIcon.tsx
```

**The logo** is a document stamp — Thai procurement TORs are sealed and endorsed, so the
mark borrows that vernacular instead of a generic app glyph. It inherits `currentColor`;
set the color on the parent. Never render the brand as letterspaced mono text.
**Pass `onDark` on the moss panel** — the "TOR" accent is `sage-600` on light surfaces and
must switch to `sage-400` on dark, or it disappears into the background.

**The mascot** ("Khun TOR", `brand/Mascot.tsx`) is a stamped terms-of-reference document —
the same rounded-square seal and endorsement rule as the logo, so mark and character are
one family. It is deliberately **flat geometric vector, not 3D**: a hand-coded imitation
of a rendered 3D character lands in uncanny valley and undercuts the authority this
product trades on. Keep it official by construction, friendly only in its proportions.
If it ever grows a hat, a wave, or a speech bubble, that line has been crossed.

**Mascot interaction**: the eyes track the pointer, and they close while a password field
is focused — reassurance rendered as behaviour rather than a tooltip. `Mascot` is the
presentational SVG (`shielded` prop); `MascotStage` is the client wrapper that listens for
`focusin`/`focusout` on password inputs, so `AuthShell` stays a server component. Both
behaviours are suppressed under `prefers-reduced-motion`. Any future interaction must be
functional like this one — never an idle wobble.

**Known gaps:** `src/app/page.tsx` is unmodified boilerplate (contains placeholder copy
and links to vercel.com). `/forgot-password` is linked from login but does not exist.
There are no auth API endpoints yet — signup and login `console.log` and route onward.
