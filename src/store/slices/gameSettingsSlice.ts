import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Player } from "../../types/Player";

export type AttackType = "threept" | "twopt" | "layup";

interface GameSettingsState {
  attackPreferences: AttackType[];   // sempre 3 itens em ordem
  starters: Player[];               // ids dos 5 titulares
}

const initialState: GameSettingsState = {
  attackPreferences: ["threept", "twopt", "layup"],
  starters: [],
};

export const gameSettingsSlice = createSlice({
  name: "gameSettings",
  initialState,
  reducers: {
    setAttackPreferences(state, action: PayloadAction<AttackType[]>) {
      state.attackPreferences = action.payload;
    },
    setStarters(state, action: PayloadAction<Player[]>) {
      state.starters = action.payload;
    },
  },
});

export const { setAttackPreferences, setStarters } = gameSettingsSlice.actions;
export default gameSettingsSlice.reducer;