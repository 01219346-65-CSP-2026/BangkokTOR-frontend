"use client";

import { useTranslations } from "@/i18n/LanguageProvider";
import { Badge } from "@/components/ui/Badge";
import { InfoTip } from "./InfoTip";
import { TONE_TEXT, type Tone } from "./tone";
import { REFRESH_CHOICES, type RefreshChoice } from "./useAutoRefresh";

// The high-contrast top banner: three KPI cards, a health badge, and the
// auto-refresh control. Every number is computed in page.tsx and passed in, so
// this component is pure layout.

export type KpiBannerProps = {
  liveWorkers: number;
  quietWorkers: number;
  backlog: { pending: number; working: number };
  failed: { rows: number; unreadable: number };
  health: "ok" | "degraded" | "down";
  /** Why it is degraded, one line each. Empty unless health is "degraded". */
  healthReasons: string[];
  refreshChoice: RefreshChoice;
  onRefreshChoice: (choice: RefreshChoice) => void;
};

export function KpiBanner({
  liveWorkers,
  quietWorkers,
  backlog,
  failed,
  health,
  healthReasons,
  refreshChoice,
  onRefreshChoice,
}: KpiBannerProps) {
  const t = useTranslations("admin");

  const queued = backlog.pending + backlog.working;
  const failedTotal = failed.rows + failed.unreadable;

  const healthLabel = {
    ok: t.pipeline.healthOk,
    degraded: t.pipeline.healthDegraded,
    down: t.pipeline.healthDown,
  }[health];

  const healthExplain = {
    ok: t.pipeline.healthExplainOk,
    degraded: t.pipeline.healthExplainDegraded,
    down: t.pipeline.healthExplainDown,
  }[health];

  return (
    <dl className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-field border border-sage-100 bg-sage-100 sm:grid-cols-2 lg:grid-cols-4">
      <Kpi
        label={t.pipeline.statWorkers}
        tip={t.pipeline.tipWorkersLive}
        value={liveWorkers}
        tone={liveWorkers === 0 ? "muted" : "ok"}
        note={
          quietWorkers > 0
            ? t.pipeline.statWorkersQuiet.replace("{count}", String(quietWorkers))
            : t.pipeline.statWorkersAllLive
        }
        noteTone={quietWorkers > 0 ? "warn" : "muted"}
      />
      <Kpi
        label={t.pipeline.statBacklog}
        tip={t.pipeline.tipBacklog}
        value={queued}
        tone={queued === 0 ? "muted" : "strong"}
        note={t.pipeline.statBacklogNote
          .replace("{pending}", backlog.pending.toLocaleString())
          .replace("{working}", backlog.working.toLocaleString())}
      />
      <Kpi
        label={t.pipeline.statFailed}
        tip={t.pipeline.tipFailed}
        value={failedTotal}
        tone={failedTotal > 0 ? "alarm" : "muted"}
        note={t.pipeline.statFailedNote
          .replace("{unreadable}", failed.unreadable.toLocaleString())
          .replace("{threw}", failed.rows.toLocaleString())}
      />

      <div className="flex flex-col justify-between gap-3 bg-white px-5 py-4">
        <div>
          <dt className="font-mono text-[0.625rem] tracking-[0.18em] text-ink-500 uppercase">
            {t.pipeline.healthLabel}
            <InfoTip>
              {t.pipeline.healthExplainOk}
              <br />
              {t.pipeline.healthExplainDegraded.replace(/:$/, ".")}
              <br />
              {t.pipeline.healthExplainDown}
            </InfoTip>
          </dt>
          <dd className="mt-2">
            <Badge tone={health === "ok" ? "accent" : "caution"} withDot>
              {healthLabel}
            </Badge>
            {/* The reason is printed, not hidden in a tooltip: "Degraded" alone
                is exactly the ambiguity this card is meant to remove. */}
            {health === "ok" ? null : (
              <div className={`mt-1.5 text-xs leading-snug ${TONE_TEXT.warn}`}>
                {health === "down" ? (
                  <p>{healthExplain}</p>
                ) : (
                  <ul className="space-y-0.5">
                    {healthReasons.map((reason) => (
                      <li key={reason}>{reason}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </dd>
        </div>

        <div>
          <p className="font-mono text-[0.625rem] tracking-[0.18em] text-ink-500 uppercase">
            {t.pipeline.autoRefresh}
            <InfoTip>{t.pipeline.tipAutoRefresh}</InfoTip>
          </p>
          {/* Three states, not on/off, so a segmented control rather than the
              Toggle primitive. aria-pressed makes each one announce its state. */}
          <div
            role="group"
            aria-label={t.pipeline.autoRefresh}
            className="mt-1.5 inline-flex overflow-hidden rounded-field border border-sage-100"
          >
            {REFRESH_CHOICES.map((choice) => {
              const active = choice === refreshChoice;
              return (
                <button
                  key={String(choice)}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onRefreshChoice(choice)}
                  className={`px-3 py-1 text-xs tabular-nums transition duration-200 ease-soft outline-none focus-visible:ring-2 focus-visible:ring-sage-600/40 ${
                    active ? "bg-sage-600 text-white" : "bg-white text-ink-600 hover:bg-sage-100"
                  }`}
                >
                  {choice === null
                    ? t.pipeline.autoRefreshOff
                    : t.pipeline.autoRefreshEvery.replace("{seconds}", String(choice / 1000))}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </dl>
  );
}

function Kpi({
  label,
  tip,
  value,
  note,
  tone,
  noteTone = "muted",
}: {
  label: string;
  tip: string;
  value: number;
  note: string;
  /** "strong" = a plain count, not a health signal: moss, not green. */
  tone: Tone | "strong";
  noteTone?: Tone;
}) {
  const valueClass = tone === "strong" ? "text-moss-700" : TONE_TEXT[tone];

  return (
    <div className="bg-white px-5 py-4">
      <dt className="font-mono text-[0.625rem] tracking-[0.18em] text-ink-500 uppercase">
        {label}
        <InfoTip>{tip}</InfoTip>
      </dt>
      <dd>
        <span className={`mt-1 block text-3xl font-medium tabular-nums ${valueClass}`}>
          {value.toLocaleString()}
        </span>
        <span className={`mt-1.5 block text-xs ${TONE_TEXT[noteTone]}`}>{note}</span>
      </dd>
    </div>
  );
}
