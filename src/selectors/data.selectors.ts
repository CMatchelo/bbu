import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { University } from "../types/University";

/** Flat array of all universities across all leagues. */
export const selectAllUniversities = createSelector(
  [(state: RootState) => state.data.universitiesByLeague],
  (byLeague): University[] => Object.values(byLeague).flat(),
);

/** All universities enriched with their Player objects. */
export const selectUniversitiesWithPlayers = createSelector(
  [
    (state: RootState) => state.data.universitiesByLeague,
    (state: RootState) => state.data.playersByUniversity,
  ],
  (byLeague, byUniversity): University[] => {
    return Object.values(byLeague)
      .flat()
      .map((uni) => ({
        ...uni,
        players: byUniversity[uni.id] ?? [],
      }));
  },
);

/** Universities grouped by leagueId (already the storage shape). */
export const selectUniversitiesGrouped = createSelector(
  [(state: RootState) => state.data.universitiesByLeague],
  (byLeague): Record<string, University[]> => byLeague,
);

export const selectUniversityById =
  (uniId: string | null | undefined) =>
  (state: RootState): University => {
    if (!uniId) throw new Error("University not found");
    for (const unis of Object.values(state.data.universitiesByLeague)) {
      const found = unis.find((u) => u.id === uniId);
      if (found) return found;
    }
    throw new Error(`University ${uniId} not found`);
  };
