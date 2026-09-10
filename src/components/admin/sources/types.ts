import type { FrequencyId } from "@/i18n/Translations";

export type Source = {
  id: string;
  name: string;
  url: string;
  isActive: boolean;
  frequencyId: FrequencyId;
  lastScrapedHoursAgo: number;
};
