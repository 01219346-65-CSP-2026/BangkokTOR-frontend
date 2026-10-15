# feat/116: graph dashboard (frontend: the four graphs)

> **You write the code on this branch.** This file tells you what to build, in which order, and how you know you're done. The tests are the spec. When they're all green, the branch is finished.
>
> Jira: **SCRUM-116 Implement Graph Dashboard**. This is the frontend half. The backend half (`GET /api/tors/insights`) is `feat/SCRUM-116/graph-dashboard` in the backend repo, and its `LEARNING.md` explains **why these four graphs**. Read its first section before starting here.
>
> You don't need the backend running for any test here. Only the last step (seeing it in the browser) does.

---

## What you're building

`/dashboard` today: one real-ish panel (the match list, which is mock data) and four dashed boxes saying "Not built yet". Afterwards:

```
┌───────────────────────────────────────────────────────────────────┐
│ YOUR WORKSPACE                               [ All Thailand | Bangkok ] │
│ Dashboard · Fiscal year 2570 and the year before                  │
├────────────────┬────────────────┬────────────────┬────────────────┤
│ SOFTWARE TORS  │ BIDDABLE BUDGET│ FROM BANGKOK   │ OPEN FOR BIDS  │  ← InsightsKpiRow
│ 4,557          │ ฿15.8B         │ 54.5%          │ 18             │    (step 8)
├────────────────┴───────────────┬┴────────────────┴────────────────┤
│ Your latest matches (mock)     │ What kind of tender is it?       │
│  ⚠ scores are placeholders     │ By number  ███████████████▒▒▒░   │  ← MethodMixChart
│  [TorCard] [TorCard] …         │ By budget  ████▒▒▒▒▒▒▒▒▒▒▒▒░░░░   │    (step 4)
│                                │ ■ Direct award ■ e-bidding ■ Sel.│
├──────────────────────┬─────────┴───────────┬──────────────────────┤
│ How big are the      │ Who is buying?      │ When do tenders      │
│ contracts?           │ สำนักการระบายน้ำ ฿900M │ come out?            │
│  ▇                   │ ██████████████████  │       ▇              │
│  ▇  ▅  ▃  ▁          │ สำนักการโยธา  ฿450M  │ ▂▃▂▃▅▃▂▃▇▄▃▂         │
│ <500K … 50M+         │ █████████           │ N D J F M A M J J A S O│
│ BudgetBandsChart (5) │ TopAgenciesChart (6)│ MonthlyTrendChart (7)│
└──────────────────────┴─────────────────────┴──────────────────────┘
```

Every panel has three non-chart states: **loading** (a pulsing well), **error** (the message, in clay), **empty** (an invitation to switch scope). `ChartPanel` (step 3) handles all three once, so no chart deals with them.

### Three house rules that shape the code (read `CLAUDE.md`)

1. **Hand-rolled charts, no chart library** (§4). recharts was tried for the admin pages and removed: a bar is a `<span>` with a `width: N%`. See `src/components/admin/charts/FunnelBar.tsx`, the model for everything here.
2. **Token colours only** (§1): `bg-moss-700`, `bg-sage-400`, …, never `bg-green-600` or a hex. A test checks this.
3. **Every chart is also a table.** The drawn bars are `aria-hidden="true"`, and a `<table className="sr-only">` gives screen readers the same numbers. The tests read those tables, which is how a chart gets tested without a browser.

### Why the chart components take labels as props

`useTranslations()` needs a `LanguageProvider`. If each chart called it, every test would need to set one up. Instead the **page** translates and the charts receive plain strings (`labels={{ byNumber: i.byNumber, … }}`), the same way `FunnelBar` takes `emptyLabel`. The charts stay presentational, so a test can render them to a string with `renderToStaticMarkup`.

---

## Passing criteria (ALL must be true)

| # | Check | Command |
|---|---|---|
| 1 | Pure helpers green | `bun test src/lib/insights.test.ts` |
| 2 | Proxy route green | `bun test src/app/api/tors/insights` |
| 3 | Chart UI green | `bun test src/components/dashboard` |
| 4 | Wiring checklist green | `bun test checklist/116` |
| 5 | **Every** test green | `bun test` (or `npm test`) |
| 6 | Types, lint, build | `npx tsc --noEmit` · `npm run lint` (0 errors) · `npm run build` |
| 7 | It looks right | the browser checklist in step 10 |

Right now 41 tests are red. The 4 that pass are guard rails (no raw colours, no recharts, FR-19, keep the mock notice), and they must **stay** green.

> `npm run build` refuses to run with `NEXT_PUBLIC_AUTH_BYPASS=true` in `.env` (a deliberate guard in `src/lib/auth.ts`). Build with `NEXT_PUBLIC_AUTH_BYPASS=false npm run build`.

**Given, don't rewrite:** the response type `TorInsightsResponse` in `src/api/tors.ts` (it mirrors the backend), the `dashboard.insights` translations (EN + TH, please proofread the Thai), and the test setup (tests are excluded from `tsconfig.json`, because Next's type check doesn't know `bun:test`).

---

## Steps

### Step 1: the proxy route

**File:** `src/app/api/tors/insights/route.ts` (a stub that answers 501).
**Copy the pattern from:** `src/app/api/tors/stats/route.ts`.

The browser never calls the backend directly (its port isn't public). This route does it on the server. The difference from `stats` is the query: **rebuild it, don't forward it.** Read `province` from the incoming URL, trim it, and if it's non-empty send `?province=…` (use `URLSearchParams`, which encodes Thai for you). Every other parameter is dropped.

✅ `bun test src/app/api/tors/insights` (5 tests). The test swaps `publicFetch` for a fake with `mock.module`. Read how; it's a useful trick. Also `checklist/116` → "step 1".

### Step 2: the pure helpers

**File:** `src/lib/insights.ts`. Five functions; each has hints in its comment.

Suggested order: `insightsPath` → `scaleToMax` → `monthLabel` → `formatBahtCompact` → `stackSegments` (the trickiest).

`stackSegments` turns shares into positions on a 100% bar:

```
shares   75        17.5   7.5
offsets  0         75     92.5
         |█████████|▒▒▒▒▒|░░|
         0        75   92.5  100
```

The shares come rounded (33.3 + 33.3 + 33.3 = 99.9), so the last non-zero segment absorbs the difference and the bar always ends exactly at 100. Watch out for floating point: in JavaScript `0.1 + 0.2` is `0.30000000000000004`.

✅ `bun test src/lib/insights.test.ts` (12 tests).

### Step 3: `ChartPanel`, the frame and its states

**File:** `src/components/dashboard/ChartPanel.tsx`. Props are typed; the body returns `null`.

`<section aria-busy={isLoading}>` → `<h2>` title → caption → then **one** of: skeleton / `<p role="alert">{error}</p>` / `{emptyLabel}` / `children`. Take the frame's classes from `ChartPlaceholder` in the current dashboard page. The dashed-well comment there explains the empty state.

✅ `bun test src/components/dashboard` → "step 3" (4 tests).

### Step 4: `MethodMixChart` (graph 1)

The customer's favourite slide. Two bars, **By number** (`torShare`) and **By budget** (`budgetShare`), each built from `stackSegments`. Each non-zero segment is:

```tsx
<span data-segment={key} className={`absolute inset-y-0 ${METHOD_FILL[key]}`}
      style={{ left: `${offset}%`, width: `${share}%` }} />
```

inside a `relative` track. Then a legend, then the `sr-only` table (method, % by number, % by budget). The bars and the legend get `aria-hidden="true"`.

✅ "step 4" (5 tests).

### Step 5: `BudgetBandsChart` (graph 2)

Four columns. Each column's height is `scaleToMax(tors)[i]%`, and inside it a dark `bg-moss-700` part of height `biddable / tors` shows what's biddable. Show the count above and the band label below. Then the table.

A column with `height: N%` needs a parent with a real height. If your columns are all 0px tall in the browser, that's why (`h-full` plus `min-h-[9rem]` on the grid).

✅ "step 5" (3 tests).

### Step 6: `TopAgenciesChart` (graph 3)

Read `FunnelBar.tsx` first; this is the same idea. Use an `<ol>` (the order is the ranking), with one `<li>` per agency: name, `formatBudget(budget)`, and a bar `<span data-bar style={{ width }}>` scaled to the biggest budget. Put `torsLabel(tors)` in the row's `title` for hover.

Long Thai agency names: `truncate` plus `min-w-0`/`minmax(0,1fr)`, or they'll push the amount off the card at 375px.

✅ "step 6" (3 tests).

### Step 7: `MonthlyTrendChart` (graph 4)

The same column construction as step 5, with twelve columns (`grid-cols-12`), labelled with the `monthLabel` prop. If you copy-pasted step 5, decide whether a shared component is worth extracting, and say why either way in the PR.

✅ "step 7" (3 tests).

### Step 8: `InsightsKpiRow`, the headline numbers

A `<dl>` of four `<Stat>`s (`src/components/admin/Stat.tsx`; its comment shows the wrapper classes). Tiles: TORs, biddable budget, Bangkok share, open now. When the page is scoped to Bangkok, the Bangkok share would always read 100%, so `showBangkokShare={false}` swaps in the biddable TOR count.

✅ "step 8" (2 tests). The whole of `src/components/dashboard` is green.

### Step 9: wire the page

**File:** `src/app/(public)/dashboard/page.tsx`.

1. `const [scope, setScope] = useState<InsightScope>("all")`, plus a `<Tabs>` for All Thailand / Bangkok (the shared `ui/Tabs`, already accessible).
2. `const { data, error, isLoading } = useEndpoint<TorInsightsResponse>(insightsPath(scope))`. When `scope` changes, the path changes and `useEndpoint` refetches by itself (read its comments on stale responses).
3. `const { locale } = useLanguage()` for `formatBahtCompact` and `monthLabel`.
4. Replace the four `ChartPlaceholder`s with `ChartPanel` + chart. Pass every panel the same `isLoading` / `error` / `isEmpty` (`data?.totals.tors === 0`) / `emptyLabel`. Graph 3 is also empty when `topAgencies` is `[]`.
5. **Keep the mock notice** for the match list; the matches are still fake. Move it into the matches panel so it's clear which panel it's about.
6. Delete `ChartPlaceholder`, then delete `placeholderTitle` / `placeholderBody` from **both** `en` and `th` in `src/i18n/Translations.tsx` (there's a TODO there).
7. Interpolation: `i.agencyTors.replace("{count}", …)` and `i.fiscalYear.replace("{year}", …)`, the same way the rest of the app does it.

✅ `bun test checklist/116` is fully green. `bun test` is fully green. tsc, lint and build pass.

### Step 10: see it in the browser

Backend on `:8003` (its branch done, or at least step 10 there), then `npm run dev` → <http://localhost:3003/dashboard>.

- [ ] All four graphs and the KPI row show real numbers; the slide's shape is visible in graph 1 (direct award wide on top, narrow underneath)
- [ ] **Bangkok** tab: numbers change, and the third KPI becomes "Biddable TORs"
- [ ] Language toggle → Thai labels everywhere, ฿ amounts still compact
- [ ] Stop the backend and reload → every panel shows the error message, nothing crashes
- [ ] DevTools at **375px**: no sideways scroll, long agency names truncate
- [ ] **Tab** key: the scope toggle shows a focus ring
- [ ] VoiceOver (Cmd+F5) on a chart reads the table, not the bars

---

## Stretch (not covered by tests)

- **Click through.** Clicking a method segment or an agency bar opens `/tor?method=…` or `/tor?agency=…`. The listing filters already exist.
- **Highlight Bangkok.** In "All Thailand", a small 77-province bar list with Bangkok in `moss-700` and the rest in `sage-400`.
- **Animate the numbers** with `src/lib/useAnimatedNumber.ts` (it already respects reduced motion).

---

## Using AI to help (without having it write the code for you)

Write your attempt first. When you're stuck, paste your code and **the failing test output** and ask for a *hint*:

- *"Here's my `stackSegments` and the failing test. Don't fix it. Which case am I missing?"*
- *"My column has `height: 50%` but renders 0px tall. What CSS rule am I missing? Explain, don't rewrite."*
- *"What does `renderToStaticMarkup` output for `style={{ width: '50%' }}`? Tiny example."*
- *"Review my dashboard page for anything that breaks at 375px. Point to lines."*

When all seven passing criteria hold, commit, push, and open a PR into `main`.
