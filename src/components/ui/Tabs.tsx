type Tab<T extends string> = {
  id: T;
  label: string;
  count?: number;
};

type TabsProps<T extends string> = {
  tabs: Tab<T>[];
  activeTab: T;
  onChange: (tab: T) => void;
};

/**
 * Segmented control. Was built on `rounded-full` and raw `green-*`/`zinc-*`,
 * both of which CLAUDE.md §1–2 forbid; it now takes `rounded-field` and the
 * sage tokens like every other control. Used by notifications and admin/users.
 */
export function Tabs<T extends string>({ tabs, activeTab, onChange }: TabsProps<T>) {
  return (
    <div className="inline-flex items-center gap-1 rounded-field border border-sage-100 bg-mist-50 p-1">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(tab.id)}
            className={`rounded-field px-4 py-1.5 text-sm font-medium transition duration-200 ease-soft focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:outline-none ${
              isActive
                ? "bg-sage-600 text-white shadow-sm"
                : "text-ink-600 hover:bg-sage-100 hover:text-moss-700"
            }`}
          >
            {tab.label}
            {typeof tab.count === "number" && (
              <span
                className={`ml-1.5 tabular-nums ${
                  isActive ? "text-sage-100" : "text-ink-500"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}