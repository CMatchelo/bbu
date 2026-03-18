import {
  Action,
  createSlice,
  PayloadAction,
  ThunkAction,
} from "@reduxjs/toolkit";
import { ScheduleState } from "../../types/ScheduleState";
import { Match } from "../../types/Match";
import { scheduleStateToSave } from "../../utils/scheduleMappers";
import { AppDispatch, RootState } from "..";

const initialState: ScheduleState = {
  currentWeek: 1,
  matchesById: {},
  matchesByWeek: {},
};

export const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
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

export const { setSchedule, setCurrentWeek, incrementWeek, setMatchResult, setMultipleMatchResults } =
  scheduleSlice.actions;
export default scheduleSlice.reducer;

export const saveScheduleThunk =
  (userId: string) =>
  async (_dispatch: AppDispatch, getState: () => RootState) => {
    const scheduleState = getState().schedule;
    const scheduleSave = scheduleStateToSave(scheduleState);

    await window.api.saveSchedule(userId, scheduleSave);
  };
