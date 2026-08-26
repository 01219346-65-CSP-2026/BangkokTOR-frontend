"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AuthShell } from "../../components/auth/AuthShell";
import { TextField } from "../../components/ui/TextField";
import { Button } from "../../components/ui/Button";

// Static mock data for now — swap with the one from API later.
const MOCK_SKILLS = [
  "Project Management",
  "Product Management",
  "UI/UX Design",
  "Graphic Design",
  "Web Development",
  "Frontend Development",
  "Backend Development",
  "Full-Stack Development",
  "Mobile App Development",
  "Data Analysis",
  "Data Science",
  "Machine Learning",
  "Copywriting",
  "Content Writing",
  "Digital Marketing",
  "SEO",
  "Social Media Management",
  "Video Editing",
  "Photography",
  "Illustration",
  "Customer Support",
  "Sales",
  "Bookkeeping",
  "Translation",
  "Virtual Assistance",
  "Software Testing",
  "DevOps",
  "Public Speaking",
];

export default function SkillsPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const suggestions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return [];

    return MOCK_SKILLS.filter(
      (skill) =>
        skill.toLowerCase().includes(normalizedQuery) &&
        !selectedSkills.includes(skill)
    ).slice(0, 8);
  }, [query, selectedSkills]);

  function addSkill(skill: string) {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev : [...prev, skill]));
  }

  function removeSkill(skill: string) {
    setSelectedSkills((prev) => prev.filter((item) => item !== skill));
  }

  function handleSkip() {
    console.log("Skipped skill selection");
    router.push("/");
  }

  function handleSave() {
    console.log("Saved skills:", selectedSkills);
    router.push("/");
  }

  return (
    <AuthShell maxWidthClassName="max-w-xl">
      <h1 className="font-display mt-6 text-4xl tracking-tight text-green-600">
        Select Your Skills
      </h1>
      <p className="mt-2 text-sm text-zinc-600">
        Search for your skills below and add them to your profile.
      </p>

      <div className="mt-8">
        <h2 className="mb-2 text-sm font-medium text-zinc-800">Your Skills</h2>
        <div className="flex min-h-[2.75rem] flex-wrap gap-2 rounded-2xl border border-dashed border-zinc-200 p-3">
          {selectedSkills.length === 0 ? (
            <p className="text-sm text-zinc-400">No skills added yet.</p>
          ) : (
            selectedSkills.map((skill) => (
              <span
                key={skill}
                className="flex items-center gap-2 rounded-full border-2 border-green-400 bg-green-300/50 px-4 py-1.5 text-sm text-zinc-800"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  aria-label={`Remove ${skill}`}
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
          label="Search Skills"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="e.g. Project"
        />

        {query.trim() && (
          <div className="mt-3 max-h-56 divide-y divide-zinc-100 overflow-y-auto rounded-2xl border border-zinc-200">
            {suggestions.length === 0 ? (
              <p className="p-3 text-sm text-zinc-400">No matching skills.</p>
            ) : (
              suggestions.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center justify-between px-4 py-2.5"
                >
                  <span className="text-sm text-zinc-800">{skill}</span>
                  <button
                    type="button"
                    onClick={() => addSkill(skill)}
                    aria-label={`Add ${skill}`}
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
          Skip
        </Button>
        <Button type="button" onClick={handleSave}>
          Save Skills
        </Button>
      </div>
    </AuthShell>
  );
}