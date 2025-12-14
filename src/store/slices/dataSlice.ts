import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Player } from "../../types/Player";
import { University } from "../../types/University";
import { Skill } from "../../types/Skill";

interface DataState {
  universitiesById: Record<string, University>;
  playersById: Record<string, Player>;
  loading: boolean;
}

const initialState: DataState = {
  universitiesById: {},
  playersById: {},
  loading: false,
};

export const loadGameData = createAsyncThunk("data/loadGameData", async () => {
  const universities = await window.api.loadJson("universities");
  const players = await window.api.loadJson("players");
  return { universities, players };
});

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    updatePlayer(
      state,
      action: PayloadAction<{ id: string; changes: Partial<Player> }>
    ) {
      const player = state.playersById[action.payload.id];

      if (!player) return;

      Object.assign(player, action.payload.changes);
    },
    updatePlayerSkill(
      state,
      action: PayloadAction<{
        id: string;
        skill: keyof Skill;
        value: number;
      }>
    ) {
      const player = state.playersById[action.payload.id];
      if (!player) return;
      player.skills[action.payload.skill] = action.payload.value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadGameData.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadGameData.fulfilled, (state, action) => {
        state.loading = false;

        for (const uni of action.payload.universities) {
          state.universitiesById[uni.id] = uni;
        }

        for (const player of action.payload.players) {
          state.playersById[player.id] = player;
        }
      })
      .addCase(loadGameData.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { updatePlayer, updatePlayerSkill } = dataSlice.actions;
export default dataSlice.reducer;
