import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { University } from "../types/University";
import { Player } from "../types/Player";

export const selectAllUniversities = createSelector(
  [(state: RootState) => state.data.universitiesByLeague],
  (byLeague): University[] => Object.values(byLeague).flat(),
);

export const dividePlayersByUniversity = createSelector(
  (state: RootState) => state.data.playersById,
  (playersById) => {
    const result: Record<string, Player[]> = {};
    for (const player of Object.values(playersById)) {
      (result[player.currentUniversity] ??= []).push(player);
    }
    return result;
  },
);

export const selectPlayersFromUniversity = createSelector(
  [dividePlayersByUniversity, (_: RootState, uniId: string) => uniId],
  (playersByUniversity, uniId) => playersByUniversity[uniId] ?? [],
);

/* export const selectUniversitiesWithPlayers = createSelector(
  [
    (state: RootState) => state.data.universitiesByLeague,
    dividePlayersByUniversity,
  ],
  (byLeague, byUniversity): University[] => {
    return Object.values(byLeague)
      .flat()
      .map((uni) => ({
        ...uni,
        players: byUniversity[uni.id] ?? [],
      }));
  },
); */

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

export const selectAllPlayers = createSelector(
  [(state: RootState) => state.data.playersById],
  (playersById): Player[] => Object.values(playersById),
);

export const selectInjuredPlayers = createSelector(
  [selectAllPlayers],
  (playersById) =>
    Object.values(playersById).filter(p => p.injury)
);
