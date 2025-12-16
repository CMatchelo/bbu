import { Action, createSlice, PayloadAction, ThunkAction } from "@reduxjs/toolkit";
import { ScheduleState } from "../../types/ScheduleState";
import { Match } from "../../types/Match";
import { scheduleStateToSave } from "../../utils/scheduleMappers";
import { AppDispatch, RootState } from "..";

const initialState: ScheduleState = {
  currentRound: 1,
  matchesById: {},
  matchesByRound: {},
};

export const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    setSchedule(state, action: PayloadAction<Match[]>) {
      state.matchesById = {};
      state.matchesByRound = {}

      for (const match of action.payload) {
        state.matchesById[match.id] = match;

        if (!state.matchesByRound[match.round]) {
          state.matchesByRound[match.round] = []
        }
        state.matchesByRound[match.round].push(match.id)
      }
    },
    setCurrentRound(state, action: PayloadAction<number>) {
      state.currentRound = action.payload;
    },
    setMatchResult(
      state,
      action: PayloadAction<{
        matchId: string,
        homeScore: number,
        awayScore: number,
      }>
    ) {
      const match = state.matchesById[action.payload.matchId]
      if (!match) return
      match.played = true;
      match.result = {
        homeScore: action.payload.homeScore,
        awayScore: action.payload.awayScore
      }
    }
  },
});

export const { setSchedule, setCurrentRound, setMatchResult } = scheduleSlice.actions;
export default scheduleSlice.reducer;

export const saveScheduleThunk = (userId: string) => async (
  _dispatch: AppDispatch,
  getState: () => RootState
) => {
  const scheduleState = getState().schedule;
  const scheduleSave = scheduleStateToSave(scheduleState);

  await window.api.saveSchedule(userId, scheduleSave);
};
