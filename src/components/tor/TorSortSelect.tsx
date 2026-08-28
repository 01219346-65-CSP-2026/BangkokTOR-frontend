"use client";

import { useTranslations } from "@/i18n/LanguageProvider";
import type { SortId } from "@/lib/torFilters";

type TorSortSelectProps = {
  value: SortId;
  onChange: (sort: SortId) => void;
};

/**
 * Sort, not a filter.
 *
 * It sits opposite the result count where a second bordered field would read as
 * another filter competing with the panel on the left. So it drops the box
 * entirely: a quiet inline control that reorders what is already there.
 */
export function TorSortSelect({ value, onChange }: TorSortSelectProps) {
  const t = useTranslations("tor");

  return (
    <div className="flex items-center gap-1.5">
      <label htmlFor="tor-sort" className="text-xs text-ink-500">
        {t.sortLabel}
      </label>
      <select
        id="tor-sort"
        value={value}
        onChange={(event) => onChange(event.target.value as SortId)}
        className="cursor-pointer rounded-field border-none bg-transparent py-1 pr-1 text-xs font-medium text-ink-600 transition duration-200 ease-soft outline-none hover:text-sage-600 focus-visible:ring-2 focus-visible:ring-sage-600"
      >
        {(Object.keys(t.sortOptions) as SortId[]).map((id) => (
          <option key={id} value={id}>
            {t.sortOptions[id]}
          </option>
        ))}
      </select>
    </div>
  );
}
