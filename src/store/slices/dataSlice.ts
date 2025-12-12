import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Player } from "../../types/Player";
import { University } from "../../types/University";

interface DataState {
  universities: University[];
  players: Player[];
  loading: boolean;
}

const initialState: DataState = {
  universities: [],
  players: [],
  loading: false,
};

export const loadGameData = createAsyncThunk("data/loadGameData", async () => {
  const universities = await window.api.loadJson("universities");
  const players = await window.api.loadJson("players");
  console.log(universities, players)
  return { universities, players };
});

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(loadGameData.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadGameData.fulfilled, (state, action) => {
        state.loading = false;
        const universities = action.payload.universities;
        const players = action.payload.players;

        const playerMap: Record<string, Player> = {};
        for (const p of players) playerMap[p.id] = p;

        const uniWithPlayers = universities.map((uni: University) => {
          return {
            ...uni,
            players: uni.roster.map((id: string) => playerMap[id]),
          };
        });
        state.universities = uniWithPlayers;
        state.players = players;
      })
      .addCase(loadGameData.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default dataSlice.reducer;
