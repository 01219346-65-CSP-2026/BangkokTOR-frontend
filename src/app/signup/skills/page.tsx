"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { TextField } from "@/components/ui/TextField";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "@/i18n/LanguageProvider";
import type { SkillId } from "@/i18n/Translations";


const SKILL_IDS: SkillId[] = [
  "projectManagement",
  "productManagement",
  "uiUxDesign",
  "graphicDesign",
  "webDevelopment",
  "frontendDevelopment",
  "backendDevelopment",
  "fullStackDevelopment",
  "mobileAppDevelopment",
  "dataAnalysis",
  "dataScience",
  "machineLearning",
  "copywriting",
  "contentWriting",
  "digitalMarketing",
  "seo",
  "socialMediaManagement",
  "videoEditing",
  "photography",
  "illustration",
  "customerSupport",
  "sales",
  "bookkeeping",
  "translation",
  "virtualAssistance",
  "softwareTesting",
  "devOps",
  "publicSpeaking",
];

export default function SkillsPage() {
  const router = useRouter();
  const t = useTranslations("skills");
  const [query, setQuery] = useState("");
  const [selectedSkillIds, setSelectedSkillIds] = useState<SkillId[]>([]);

  const suggestions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return [];

    return SKILL_IDS.filter((id) => {
      const label = t.skillNames[id].toLowerCase();
      return label.includes(normalizedQuery) && !selectedSkillIds.includes(id);
    }).slice(0, 8);
  }, [query, selectedSkillIds, t]);

  function addSkill(id: SkillId) {
    setSelectedSkillIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }

  function removeSkill(id: SkillId) {
    setSelectedSkillIds((prev) => prev.filter((item) => item !== id));
  }

  function handleSkip() {
    // TODO: point this at wherever onboarding should land once there's a backend.
    console.log("Skipped skill selection");
    router.push("/");
  }

  function handleSave() {
    // TODO: send selectedSkillIds to the API once it exists.
    console.log("Saved skills:", selectedSkillIds);
    router.push("/");
  }

  return (
    <AuthShell
      maxWidthClassName="max-w-[26rem]"
      step={{ current: 2, total: 2, label: "Skills" }}
    >
      <h1 className="font-display text-3xl tracking-tight text-moss-700">
        {t.heading}
      </h1>
      <p className="mt-2 text-sm text-zinc-600">{t.subheading}</p>

      <div className="mt-7">
        <h2 className="mb-2 text-sm font-medium text-moss-700">
          {t.yourSkillsLabel}
        </h2>
        <div className="flex min-h-[3rem] flex-wrap items-center gap-2 rounded-field border border-dashed border-sage-400 bg-sage-100/40 p-2.5">
          {selectedSkillIds.length === 0 ? (
            <p className="px-1 text-sm text-zinc-500">{t.noSkillsYet}</p>
          ) : (
            selectedSkillIds.map((id) => (
              <span
                key={id}
                className="flex items-center gap-1.5 rounded-field border border-sage-400 bg-white py-1 pr-1 pl-3 text-sm text-moss-700"
              >
                {t.skillNames[id]}
                <button
                  type="button"
                  onClick={() => removeSkill(id)}
                  aria-label={t.removeSkillLabel.replace(
                    "{skill}",
                    t.skillNames[id]
                  )}
                  className="flex h-5 w-5 items-center justify-center rounded text-zinc-500 transition-colors outline-none hover:bg-sage-100 hover:text-moss-700 focus-visible:ring-2 focus-visible:ring-sage-600/40"
                >
                  ×
                </button>
              </span>
            ))
          )}
        </div>
      </div>

      <div className="mt-6">
        <TextField
          id="skill-search"
          label={t.searchLabel}
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t.searchPlaceholder}
        />

        {query.trim() && (
          <div className="mt-3 max-h-56 divide-y divide-sage-100 overflow-y-auto rounded-field border border-sage-400">
            {suggestions.length === 0 ? (
              <p className="p-3.5 text-sm text-zinc-500">{t.noMatches}</p>
            ) : (
              suggestions.map((id) => (
                <div
                  key={id}
                  className="flex items-center justify-between gap-3 px-3.5 py-2"
                >
                  <span className="text-sm text-moss-700">
                    {t.skillNames[id]}
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => addSkill(id)}
                    aria-label={t.addSkillLabel.replace(
                      "{skill}",
                      t.skillNames[id]
                    )}
                  >
                    Add
                  </Button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="mt-9 flex items-center justify-between gap-3 border-t border-sage-100 pt-6">
        <Button type="button" variant="ghost" onClick={handleSkip}>
          {t.skip}
        </Button>
        <Button type="button" onClick={handleSave}>
          {t.save}
        </Button>
      </div>
    </AuthShell>
  );
}