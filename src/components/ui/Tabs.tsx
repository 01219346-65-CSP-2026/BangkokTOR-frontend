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

export function Tabs<T extends string>({ tabs, activeTab, onChange }: TabsProps<T>) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 p-1">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-green-600 text-white shadow-sm"
                : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {tab.label}
            {typeof tab.count === "number" && (
              <span
                className={`ml-1.5 ${isActive ? "text-green-100" : "text-zinc-400"}`}
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