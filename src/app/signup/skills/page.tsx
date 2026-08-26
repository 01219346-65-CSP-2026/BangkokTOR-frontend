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
    <AuthShell maxWidthClassName="max-w-xl">
      <h1 className="font-display mt-6 text-4xl tracking-tight text-green-600">
        {t.heading}
      </h1>
      <p className="mt-2 text-sm text-zinc-600">{t.subheading}</p>

      <div className="mt-8">
        <h2 className="mb-2 text-sm font-medium text-zinc-800">
          {t.yourSkillsLabel}
        </h2>
        <div className="flex min-h-[2.75rem] flex-wrap gap-2 rounded-2xl border border-dashed border-zinc-200 p-3">
          {selectedSkillIds.length === 0 ? (
            <p className="text-sm text-zinc-400">{t.noSkillsYet}</p>
          ) : (
            selectedSkillIds.map((id) => (
              <span
                key={id}
                className="flex items-center gap-2 rounded-full border-2 border-green-400 bg-green-300/50 px-4 py-1.5 text-sm text-zinc-800"
              >
                {t.skillNames[id]}
                <button
                  type="button"
                  onClick={() => removeSkill(id)}
                  aria-label={t.removeSkillLabel.replace(
                    "{skill}",
                    t.skillNames[id]
                  )}
                  className="text-zinc-600 transition-colors hover:text-zinc-900"
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
          <div className="mt-3 max-h-56 divide-y divide-zinc-100 overflow-y-auto rounded-2xl border border-zinc-200">
            {suggestions.length === 0 ? (
              <p className="p-3 text-sm text-zinc-400">{t.noMatches}</p>
            ) : (
              suggestions.map((id) => (
                <div
                  key={id}
                  className="flex items-center justify-between px-4 py-2.5"
                >
                  <span className="text-sm text-zinc-800">
                    {t.skillNames[id]}
                  </span>
                  <button
                    type="button"
                    onClick={() => addSkill(id)}
                    aria-label={t.addSkillLabel.replace(
                      "{skill}",
                      t.skillNames[id]
                    )}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white transition-colors hover:bg-green-700"
                  >
                    +
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="mt-10 flex items-center justify-between">
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