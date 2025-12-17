import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Player } from "../../types/Player";
import { PlayType } from "../../types/PlayType";

interface GameSettingsState {
  attackPreferences: PlayType[];
  starters: Player[];
}

const initialState: GameSettingsState = {
  attackPreferences: ["THREE", "TWO", "LAYUP"],
  starters: [],
};

export const gameSettingsSlice = createSlice({
  name: "gameSettings",
  initialState,
  reducers: {
    setAttackPreferences(state, action: PayloadAction<PlayType[]>) {
      state.attackPreferences = action.payload;
    },
    setStarters(state, action: PayloadAction<Player[]>) {
      state.starters = action.payload;
    },
  },
});

export const { setAttackPreferences, setStarters } = gameSettingsSlice.actions;
export default gameSettingsSlice.reducer;