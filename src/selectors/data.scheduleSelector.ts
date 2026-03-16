import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { Match } from "../types/Match";
import { selectUniversitiesArray } from "./data.selectors";

export const selectMatchesByWeek =
  (week: number) =>
  (state: RootState): Match[] => {
    const ids = state.schedule.matchesByWeek[week] ?? [];
    return ids.map((id) => state.schedule.matchesById[id]);
  };

export const selectAllMatches = (state: RootState): Match[] => {
  return Object.values(state.schedule.matchesById);
};

export const selectMatchesByTeam =
  (teamId: string) =>
  (state: RootState): Match[] => {
    return Object.values(state.schedule.matchesById).filter(
      (match) => match.home === teamId || match.away === teamId
    );
  };

export const selectTeamSchedule = (teamId: string) =>
  createSelector(
    [
      (state: RootState) => selectMatchesByTeam(teamId)(state),
      (state: RootState) => selectUniversitiesArray(state),
    ],
    (matches, universities) => {
      const uniById = Object.fromEntries(
        universities.map((uni) => [uni.id, uni])
      );
      return matches.map((match) => ({
        ...match,
        homeTeam: uniById[match.home],
        awayTeam: uniById[match.away],
      }));
    }
  );

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
          (match) => match.home === universityId || match.away === universityId
        ) ?? null
    );
  }
);
