import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { selectUniversitiesWithPlayers } from "./data.selectors";
import { selectCurrentRoundMatchByUniversity } from "./data.scheduleSelector";

export const selectGameContext = createSelector(
  [
    selectUniversitiesWithPlayers,
    (state: RootState, userUniversityId?: string) =>
      userUniversityId
        ? selectCurrentRoundMatchByUniversity(state, userUniversityId)
        : null,
    (_state: RootState, userUniversityId?: string) => userUniversityId,
  ],
  (universities, match, userUniversityId) => {
    if (!match || !userUniversityId) {
      return null;
    }

    const homeUniversity = universities.find(
      (u) => u.id === match.home
    );
    const awayUniversity = universities.find(
      (u) => u.id === match.away
    );

    if (!homeUniversity || !awayUniversity) {
      return null;
    }

    const playerUniversity =
      homeUniversity.id === userUniversityId
        ? homeUniversity
        : awayUniversity;

    const cpuUniversity =
      homeUniversity.id === userUniversityId
        ? awayUniversity
        : homeUniversity;

    return {
      match,
      homeUniversity,
      awayUniversity,
      playerUniversity,
      cpuUniversity,
    };
  }
);
