import { PlaytypeEntry } from "../types/PlaySystem";

export interface TopPlayEntry {
  key: string;
  label: string;
  familiarity: number;
}

export function getTopPlays<T extends Record<string, PlaytypeEntry>>(
  system: T,
  labels: Record<keyof T, string>,
  count = 2,
): TopPlayEntry[] {
  return Object.entries(system)
    .sort(([, a], [, b]) => b.familiarity - a.familiarity)
    .slice(0, count)
    .map(([key, entry]) => ({
      key,
      label: labels[key as keyof T],
      familiarity: entry.familiarity,
    }));
}
