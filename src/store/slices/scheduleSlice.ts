import {
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { Match } from "../../types/Match";
import { LeagueStandings } from "../../types/LeagueStandings";
import { scheduleStateToSave } from "../../utils/scheduleMappers";
import { AppDispatch, RootState } from "..";
import { ExtendedScheduleState } from "../../types/ScheduleState";

const initialState: ExtendedScheduleState = {
  currentWeek: 1,
  matchesById: {},
  matchesByWeek: {},
  leagueStandingsHistory: [],
};

export const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    addMatches(state, action: PayloadAction<Match[]>) {
      for (const match of action.payload) {
        state.matchesById[match.id] = match;
        if (!state.matchesByWeek[match.week]) {
          state.matchesByWeek[match.week] = [];
        }
        state.matchesByWeek[match.week].push(match.id);
      }
    },
    setLeagueStandingsHistory(state, action: PayloadAction<LeagueStandings[]>) {
      state.leagueStandingsHistory = action.payload;
    },
    addLeagueStandings(state, action: PayloadAction<LeagueStandings>) {
      const existing = state.leagueStandingsHistory.findIndex(
        (ls) => ls.year === action.payload.year,
      );
      if (existing >= 0) {
        state.leagueStandingsHistory[existing] = action.payload;
      } else {
        state.leagueStandingsHistory.push(action.payload);
      }
    },
    setSchedule(state, action: PayloadAction<Match[]>) {
      state.matchesById = {};
      state.matchesByWeek = {};

      for (const match of action.payload) {
        state.matchesById[match.id] = match;

        if (!state.matchesByWeek[match.week]) {
          state.matchesByWeek[match.week] = [];
        }
        state.matchesByWeek[match.week].push(match.id);
      }
    },
    setCurrentWeek(state, action: PayloadAction<number>) {
      state.currentWeek = action.payload;
    },
    incrementWeek: (state) => {
      state.currentWeek += 1;
    },
    setMatchResult(
      state,
      action: PayloadAction<{
        matchId: string;
        homeScore: number;
        awayScore: number;
      }>,
    ) {
      const match = state.matchesById[action.payload.matchId];
      if (!match) return;
      match.played = true;
      match.result = {
        homeScore: action.payload.homeScore,
        awayScore: action.payload.awayScore,
      };
    },
    setMultipleMatchResults(
      state,
      action: PayloadAction<
        {
          matchId: string;
          homeScore: number;
          awayScore: number;
        }[]
      >,
    ) {
      action.payload.forEach((result) => {
        const match = state.matchesById[result.matchId];
        if (!match) return;

        match.played = true;
        match.result = {
          homeScore: result.homeScore,
          awayScore: result.awayScore,
        };
      });
    },
  },
});

export const {
  setSchedule,
  setCurrentWeek,
  incrementWeek,
  setMatchResult,
  setMultipleMatchResults,
  addMatches,
  addLeagueStandings,
  setLeagueStandingsHistory,
} = scheduleSlice.actions;
export default scheduleSlice.reducer;

export const saveScheduleThunk =
  (userId: string) =>
  async (_dispatch: AppDispatch, getState: () => RootState) => {
    const scheduleState = getState().schedule;
    const scheduleSave = scheduleStateToSave(scheduleState);

    await window.api.saveSchedule(userId, scheduleSave);
  };
