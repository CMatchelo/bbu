import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Match } from "../types/Match";
import { selectUniversitiesGrouped } from "./data.selectors";
import { University } from "../types/University";

export const selectMatchesToSimulate = createSelector(
  [
    (state: RootState) => state.schedule.matchesById,
    selectUniversitiesGrouped,
    (_: RootState, currentWeek: number) => currentWeek,
    (_: RootState, __: number, userUni: string) => userUni,
  ],
  (matchesById, universities, currentWeek, userUni) => {
    const matches = Object.values(matchesById);

    const uniById = Object.fromEntries(
      Object.values(universities)
        .flat()
        .map((u) => [u.id, u]),
    );

    return matches
      .filter(
        (m) =>
          m.away !== userUni &&
          m.home !== userUni &&
          !m.played &&
          m.week <= currentWeek,
      )
      .map((m) => ({
        ...m,
        homeTeam: uniById[m.home],
        awayTeam: uniById[m.away],
      }));
  },
);

export const selectAllMatchesByLeague = createSelector(
  [
    (state: RootState) => state.schedule.matchesById,
    selectUniversitiesGrouped,
    (_: RootState, leagueId: string) => leagueId,
  ],
  (matchesById, universities, leagueId) => {
    const matches = Object.values(matchesById);

    const uniById = Object.fromEntries(
      Object.values(universities)
        .flat()
        .map((uni: University) => [uni.id, uni]),
    );
    return matches
      .filter((match) => match.championship === leagueId)
      .map((match: Match) => ({
        ...match,
        homeTeam: uniById[match.home],
        awayTeam: uniById[match.away],
      }));
  },
);

export const selectMatchesByTeam = (teamId: string) =>
  createSelector(
    [(state: RootState) => state.schedule.matchesById],
    (matchesById): Match[] => {
      return Object.values(matchesById).filter(
        (match) => match.home === teamId || match.away === teamId,
      );
    },
  );

export const selectTeamSchedule = (teamId: string) => {
  const selectMatches = selectMatchesByTeam(teamId);
  return createSelector(
    [selectMatches, selectUniversitiesGrouped],
    (matches, universities) => {
      const uniById = Object.fromEntries(
        Object.values(universities)
          .flat()
          .map((uni: University) => [uni.id, uni]),
      );

      return matches.map((match) => ({
        ...match,
        homeTeam: uniById[match.home],
        awayTeam: uniById[match.away],
      }));
    },
  );
};

export const selectcurrentWeekMatchByUniversity = createSelector(
  [
    (state: RootState) => state.schedule.currentWeek,
    (state: RootState) => state.schedule.matchesByWeek,
    (state: RootState) => state.schedule.matchesById,
    (_: RootState, universityId: string) => universityId,
  ],
  (currentWeek, matchesByWeek, matchesById, universityId) => {
    const weekMatchIds = matchesByWeek[currentWeek];
    if (!weekMatchIds) return null;

    return (
      weekMatchIds
        .map((id) => matchesById[id])
        .find(
          (match) => match.home === universityId || match.away === universityId,
        ) ?? null
    );
  },
);
