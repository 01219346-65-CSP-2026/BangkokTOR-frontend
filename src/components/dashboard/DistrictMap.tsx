import { useMemo, useState } from "react";
import type { DistrictSummary } from "@/api/tors";
import type { TorWorkTypeId } from "@/types/tor";
import khetData from "@/data/bangkokKhet.json";
import { featureCentroid, featureToPath, fitProjection, type KhetFeature } from "@/lib/geo";

/**
 * Graph 5 — what kind of software work each part of Bangkok buys, and who
 * wins it there.
 *
 * One SVG <path> per เขต from src/data/bangkokKhet.json, filled by the
 * district's dominant work type. Where the PROJECT is (the national feeds'
 * เขต), not where the winning company sits — the backend has no company
 * addresses.
 *
 * Color carries identity only. TOR count would be a second job for the same
 * fill (dataviz: one color, one job), so it lives in the tooltip and the
 * table instead — except that a district with too few TORs for "dominant" to
 * mean anything gets no category color at all.
 *
 * Seven work types is more hues than a reader tells apart, so the four big
 * ones (by TOR count in the data, 2026-10) get the data-1…4 tokens and the
 * rest fold into one neutral "other kinds" — the tooltip still lists all.
 */

/** Below this many TORs a district is drawn as "few TORs", not by type. */
export const MIN_DISTRICT_TORS = 5;

export type MapGroup = "development" | "maintenance" | "aiData" | "cloudInfra" | "otherKinds";
export const MAP_GROUPS: readonly MapGroup[] = ["development", "maintenance", "aiData", "cloudInfra", "otherKinds"];

export function mapGroup(workType: TorWorkTypeId): MapGroup {
  return workType === "development" ||
    workType === "maintenance" ||
    workType === "aiData" ||
    workType === "cloudInfra"
    ? workType
    : "otherKinds";
}

/** SVG `fill` can't take a Tailwind class, so these read the @theme tokens. */
const GROUP_COLOR: Record<MapGroup, string> = {
  development: "var(--color-data-1)",
  maintenance: "var(--color-data-2)",
  aiData: "var(--color-data-3)",
  cloudInfra: "var(--color-data-4)",
  otherKinds: "var(--color-ink-500)",
};
const GROUP_SWATCH: Record<MapGroup, string> = {
  development: "bg-data-1",
  maintenance: "bg-data-2",
  aiData: "bg-data-3",
  cloudInfra: "bg-data-4",
  otherKinds: "bg-ink-500",
};
const FEW_FILL = "var(--color-sage-100)";
const NONE_FILL = "var(--color-paper-100)";

export type DistrictMapLabels = {
  district: string;
  tors: string;
  budget: string;
  dominant: string;
  topWinners: string;
  /** e.g. (n) => `${n} wins` */
  wins: (count: number) => string;
  /** e.g. (n) => `${n} TORs` */
  torsCount: (count: number) => string;
  fewTors: string;
  noTors: string;
  otherKinds: string;
  workTypes: Record<TorWorkTypeId, string>;
};

const WIDTH = 600;
const FEATURES = (khetData as unknown as { features: KhetFeature[] }).features;

type Shape = { code: string; d: string; cx: number; cy: number };

export function DistrictMap({
  districts,
  labels,
  khetName,
  formatBudget,
}: {
  districts: DistrictSummary[];
  labels: DistrictMapLabels;
  khetName: (code: string) => string;
  formatBudget: (amount: number) => string;
}) {
  const [active, setActive] = useState<string | null>(null);

  const { shapes, height } = useMemo(() => {
    const projection = fitProjection(FEATURES, WIDTH);
    const shapes: Shape[] = FEATURES.map((f) => {
      const [cx, cy] = featureCentroid(f, projection.project);
      return { code: f.properties.code, d: featureToPath(f, projection.project), cx, cy };
    });
    return { shapes, height: projection.height };
  }, []);

  const byCode = useMemo(() => new Map(districts.map((d) => [d.code, d])), [districts]);

  const fillFor = (code: string) => {
    const d = byCode.get(code);
    if (!d || d.tors === 0) return NONE_FILL;
    if (d.tors < MIN_DISTRICT_TORS) return FEW_FILL;
    return GROUP_COLOR[mapGroup(d.dominantWorkType)];
  };

  // Only the groups some district actually shows — no dead legend entries.
  const shownGroups = MAP_GROUPS.filter((g) =>
    districts.some((d) => d.tors >= MIN_DISTRICT_TORS && mapGroup(d.dominantWorkType) === g),
  );
  const hasFew = districts.some((d) => d.tors > 0 && d.tors < MIN_DISTRICT_TORS);

  const activeShape = shapes.find((s) => s.code === active) ?? null;
  // The hovered district is drawn last so its outline isn't hidden under a
  // neighbour's fill.
  const ordered = activeShape ? [...shapes.filter((s) => s.code !== active), activeShape] : shapes;
  const groupLabel = (g: MapGroup) => (g === "otherKinds" ? labels.otherKinds : labels.workTypes[g]);

  return (
    <div>
      <div className="relative mx-auto w-full max-w-[44rem]">
        <svg
          viewBox={`0 0 ${WIDTH} ${Math.ceil(height)}`}
          className="h-auto w-full"
          role="img"
          aria-label={labels.district}
          onPointerLeave={() => setActive(null)}
        >
          {ordered.map((s) => (
            <path
              key={s.code}
              data-district={s.code}
              d={s.d}
              fillRule="evenodd"
              fill={fillFor(s.code)}
              stroke={s.code === active ? "var(--color-moss-700)" : "white"}
              strokeWidth={s.code === active ? 2 : 1}
              strokeLinejoin="round"
              tabIndex={0}
              aria-label={khetName(s.code)}
              className={`cursor-pointer transition-opacity duration-150 ease-soft outline-none ${
                active && s.code !== active ? "opacity-70" : "opacity-100"
              }`}
              onPointerEnter={() => setActive(s.code)}
              onFocus={() => setActive(s.code)}
              onBlur={() => setActive((a) => (a === s.code ? null : a))}
              onClick={() => setActive(s.code)}
            />
          ))}
        </svg>

        {activeShape && (
          <div
            className="pointer-events-none absolute z-10"
            style={{
              left: `${(activeShape.cx / WIDTH) * 100}%`,
              top: `${(activeShape.cy / height) * 100}%`,
              // Open toward the middle of the map so it never runs off an edge.
              transform: `translate(${activeShape.cx > WIDTH / 2 ? "calc(-100% - 12px)" : "12px"}, ${
                activeShape.cy > height / 2 ? "calc(-100% + 8px)" : "-8px"
              })`,
            }}
          >
            <DistrictTooltip
              name={khetName(activeShape.code)}
              district={byCode.get(activeShape.code) ?? null}
              labels={labels}
              formatBudget={formatBudget}
            />
          </div>
        )}
      </div>

      <ul aria-hidden="true" className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        {shownGroups.map((g) => (
          <li key={g} className="flex items-center gap-1.5 text-sm text-ink-600">
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${GROUP_SWATCH[g]}`} />
            {groupLabel(g)}
          </li>
        ))}
        {hasFew && (
          <li className="flex items-center gap-1.5 text-sm text-ink-600">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full border border-sage-400 bg-sage-100" />
            {labels.fewTors}
          </li>
        )}
        <li className="flex items-center gap-1.5 text-sm text-ink-600">
          <span className="h-2.5 w-2.5 shrink-0 rounded-full border border-sage-400 bg-paper-100" />
          {labels.noTors}
        </li>
      </ul>

      <table className="sr-only">
        <thead>
          <tr>
            <th scope="col">{labels.district}</th>
            <th scope="col">{labels.tors}</th>
            <th scope="col">{labels.budget}</th>
            <th scope="col">{labels.dominant}</th>
            <th scope="col">{labels.topWinners}</th>
          </tr>
        </thead>
        <tbody>
          {districts.map((d) => (
            <tr key={d.code}>
              <th scope="row">{khetName(d.code)}</th>
              <td>{d.tors}</td>
              <td>{formatBudget(d.budget)}</td>
              <td>{labels.workTypes[d.dominantWorkType]}</td>
              <td>{d.topWinners.map((w) => `${w.name} (${labels.wins(w.wins)})`).join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** The hover card: what this district buys and who wins it. Exported so the
 *  tests can render it without a pointer. */
export function DistrictTooltip({
  name,
  district,
  labels,
  formatBudget,
}: {
  name: string;
  district: DistrictSummary | null;
  labels: DistrictMapLabels;
  formatBudget: (amount: number) => string;
}) {
  return (
    <div className="w-64 rounded-field bg-moss-700 px-3 py-2.5 text-xs text-white shadow-lg">
      <p className="text-sm font-semibold">{name}</p>
      {!district || district.tors === 0 ? (
        <p className="mt-1 text-white/80">{labels.noTors}</p>
      ) : (
        <>
          <p className="mt-0.5 text-white/80">
            <span className="font-mono tabular-nums">{labels.torsCount(district.tors)}</span> ·{" "}
            <span className="font-mono tabular-nums">{formatBudget(district.budget)}</span>
          </p>

          <ul className="mt-2 space-y-1">
            {district.workTypes.slice(0, 4).map((t) => (
              <li key={t.id} className="grid grid-cols-[minmax(0,1fr)_4rem_2.5rem] items-center gap-2">
                <span className="truncate">{labels.workTypes[t.id]}</span>
                <span className="h-1.5 rounded-full bg-white/20">
                  <span
                    className="block h-full rounded-full bg-white"
                    style={{ width: `${Math.min(100, t.share)}%` }}
                  />
                </span>
                <span className="text-right font-mono tabular-nums">{Math.round(t.share)}%</span>
              </li>
            ))}
          </ul>

          {district.topWinners.length > 0 && (
            <>
              <p className="mt-2.5 text-[0.6875rem] tracking-wide text-white/70 uppercase">
                {labels.topWinners}
              </p>
              <ol className="mt-1 space-y-0.5">
                {district.topWinners.map((w) => (
                  <li key={w.name} className="flex justify-between gap-2">
                    <span className="truncate">{w.name}</span>
                    <span className="shrink-0 font-mono tabular-nums text-white/80">{labels.wins(w.wins)}</span>
                  </li>
                ))}
              </ol>
            </>
          )}
        </>
      )}
    </div>
  );
}
