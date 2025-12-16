import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { University } from "../types/University";

export const selectUniversitiesWithPlayers = createSelector(
  [
    (state: RootState) => state.data.universitiesById,
    (state: RootState) => state.data.playersById,
  ],
  (universitiesById, playersById): University[] => {
    return Object.values(universitiesById).map((uni) => ({
      ...uni,
      players: uni.roster.map((id) => playersById[id]),
    }));
  }
);

export const selectUniversitiesArray = (state: RootState): University[] =>
  Object.values(state.data.universitiesById);

export const selectUniversityById =
  (uniId: string | null) =>
  (state: RootState): University => {
    if (!uniId) throw new Error("University not found");
    return state.data.universitiesById[uniId];
  };
