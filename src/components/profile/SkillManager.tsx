"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "@/i18n/LanguageProvider";
import type { SkillId } from "@/i18n/Translations";
import { SKILL_GROUPS } from "@/lib/skillProfile";

/**
 * The profile's skill panel: only the skills the reader HAS, as removable
 * chips, and an "Add skills" dialog for the rest of the 64. Listing every
 * unselected tag in the sidebar made it taller than the whole saved list.
 *
 * The dialog is a native <dialog> opened with showModal(): the browser then
 * traps focus inside it, closes it on Escape, and returns focus to the
 * button — none of which a hand-rolled overlay gets for free.
 *
 * Every change is confirmed by a toast in a polite live region, so it is
 * announced as well as seen.
 */
export function SkillManager({
  skills,
  onToggle,
  status,
}: {
  skills: SkillId[];
  onToggle: (id: SkillId) => void;
  /** Autosave state, shown beside the heading. */
  status: "idle" | "saving" | "saved" | "error";
}) {
  const t = useTranslations("profile");
  const skillsT = useTranslations("skills");
  const names = skillsT.skillNames;

  const dialog = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");

  // One toast at a time; a new change replaces it. The id restarts the fade.
  const [toast, setToast] = useState<{ text: string; id: number } | null>(null);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  function toggle(id: SkillId) {
    const adding = !skills.includes(id);
    onToggle(id);
    setToast({
      text: (adding ? t.toastAdded : t.toastRemoved).replace("{skill}", names[id]),
      id: (toast?.id ?? 0) + 1,
    });
  }

  function openDialog() {
    setQuery("");
    dialog.current?.showModal();
  }

  const q = query.trim().toLowerCase();
  const groups = SKILL_GROUPS.map((group) => ({
    ...group,
    matches: (group.skills as readonly SkillId[]).filter((id) => !q || names[id].toLowerCase().includes(q)),
  })).filter((group) => group.matches.length > 0);

  return (
    <section aria-labelledby="skills-heading" className="rounded-field border border-sage-100 bg-white p-5">
      <div className="flex items-baseline justify-between gap-2">
        <h2 id="skills-heading" className="text-lg tracking-tight text-moss-700">
          {t.skillsHeading}
        </h2>
        <span className="text-xs text-ink-500">
          {status === "saving" ? t.skillsSaving : t.skillsActive.replace("{count}", String(skills.length))}
        </span>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-ink-500">{t.skillsIntro}</p>

      {status === "error" && (
        <p role="alert" className="mt-2 text-xs text-clay-500">
          {t.skillsError}
        </p>
      )}

      {skills.length === 0 ? (
        <p className="mt-4 rounded-field border border-dashed border-sage-400 px-4 py-5 text-center text-xs text-ink-500">
          {t.skillsNone}
        </p>
      ) : (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {skills.map((id) => (
            <li key={id}>
              <span className="inline-flex items-center gap-1 rounded-full bg-sage-600 py-1 pr-1 pl-3 text-sm text-white">
                {names[id]}
                <button
                  type="button"
                  onClick={() => toggle(id)}
                  aria-label={t.removeSkill.replace("{skill}", names[id])}
                  className="flex h-5 w-5 items-center justify-center rounded-full text-white/80 transition duration-150 hover:bg-white/20 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                >
                  <svg aria-hidden="true" viewBox="0 0 12 12" className="h-2.5 w-2.5" stroke="currentColor" strokeWidth="1.8">
                    <path d="M3 3l6 6M9 3l-6 6" strokeLinecap="round" />
                  </svg>
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={openDialog}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-dashed border-sage-600/60 bg-mist-50 py-2.5 text-sm font-medium text-sage-600 transition duration-200 ease-soft hover:border-sage-600 hover:bg-sage-100/70 hover:text-moss-700 focus-visible:ring-2 focus-visible:ring-sage-600/40 focus-visible:outline-none"
      >
        <span aria-hidden="true">+</span> {t.addSkills}
      </button>

      {/* Toast: bottom-centre, polite live region. */}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
        {toast && (
          <p
            key={toast.id}
            className="toast-in flex items-center gap-2 rounded-full bg-moss-700 px-4 py-2 text-sm text-white shadow-lg"
          >
            <span aria-hidden="true" className="text-mint-400">
              ✓
            </span>
            {toast.text}
          </p>
        )}
      </div>

      <dialog
        ref={dialog}
        aria-labelledby="add-skills-title"
        className="m-auto w-[min(40rem,calc(100vw-2rem))] rounded-field border border-sage-100 bg-white p-0 shadow-2xl backdrop:bg-moss-700/30 backdrop:backdrop-blur-[2px]"
      >
        <div className="flex max-h-[80vh] flex-col">
          <div className="border-b border-sage-100 p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 id="add-skills-title" className="text-lg tracking-tight text-moss-700">
                {t.addSkillsTitle}
              </h2>
              <span className="text-xs text-ink-500">{t.skillsActive.replace("{count}", String(skills.length))}</span>
            </div>
            <div className="relative mt-3">
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-sage-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="8.5" cy="8.5" r="5.5" />
                <path d="M13 13l4 4" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t.addSkillsSearch}
                aria-label={t.addSkillsSearch}
                className="w-full rounded-full border border-sage-400/70 bg-mist-50 py-2.5 pr-4 pl-10 text-sm text-moss-700 outline-none placeholder:text-ink-500 focus-visible:border-sage-600 focus-visible:bg-white focus-visible:ring-[3px] focus-visible:ring-sage-600/20"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {groups.length === 0 ? (
              <p className="py-6 text-center text-sm text-ink-500">{t.addSkillsNoResults.replace("{query}", query)}</p>
            ) : (
              groups.map((group) => (
                <div key={group.id} className="mb-5 last:mb-0">
                  <h3 className="mb-2 font-mono text-[0.6875rem] tracking-widest text-sage-600 uppercase">
                    {skillsT[group.labelKey]}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {group.matches.map((id) => {
                      const on = skills.includes(id);
                      return (
                        <button
                          key={id}
                          type="button"
                          aria-pressed={on}
                          onClick={() => toggle(id)}
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition duration-150 outline-none focus-visible:ring-2 focus-visible:ring-sage-600/40 ${
                            on
                              ? "border border-sage-600 bg-sage-600 text-white"
                              : "border border-sage-400/70 bg-white text-moss-700 hover:border-sage-600 hover:bg-sage-100/60"
                          }`}
                        >
                          {on ? <span aria-hidden="true">✓</span> : <span aria-hidden="true" className="text-sage-600">+</span>}
                          {names[id]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-end border-t border-sage-100 p-4">
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              className="rounded-full bg-sage-600 px-5 py-2 text-sm font-medium text-white transition duration-200 ease-soft hover:bg-moss-700 focus-visible:ring-2 focus-visible:ring-sage-600/40 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {t.addSkillsDone}
            </button>
          </div>
        </div>
      </dialog>
    </section>
  );
}
