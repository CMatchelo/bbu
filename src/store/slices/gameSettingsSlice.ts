import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Player } from "../../types/Player";
import { DefensivePlaySystem, OffensivePlaySystem } from "../../types/PlaySystem";

export type OffensivePlayKey = keyof OffensivePlaySystem;
export type DefensivePlayKey = keyof DefensivePlaySystem;

interface GameSettingsState {
  offensivePlayOrder: OffensivePlayKey[];
  defensivePlayOrder: DefensivePlayKey[];
  starters: Player[];
}

const initialState: GameSettingsState = {
  offensivePlayOrder: ["PickAndRoll", "Motion", "Isolation", "FiveOut", "PostUp", "FastBreak"],
  defensivePlayOrder: ["ManToMan", "Zone", "PerimeterPressure", "FullCourtPress", "SwitchEverything", "PackedPaint"],
  starters: [],
};

export const gameSettingsSlice = createSlice({
  name: "gameSettings",
  initialState,
  reducers: {
    setOffensivePlayOrder(state, action: PayloadAction<OffensivePlayKey[]>) {
      state.offensivePlayOrder = action.payload;
    },
    setDefensivePlayOrder(state, action: PayloadAction<DefensivePlayKey[]>) {
      state.defensivePlayOrder = action.payload;
    },
    setStarters(state, action: PayloadAction<Player[]>) {
      state.starters = action.payload;
    },
  },
});

export const { setOffensivePlayOrder, setDefensivePlayOrder, setStarters } = gameSettingsSlice.actions;
export default gameSettingsSlice.reducer;
