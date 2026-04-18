import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Player } from "../../types/Player";
import { University } from "../../types/University";
import { Skill } from "../../types/Skill";

interface DataState {
  /** universities grouped by leagueId */
  universitiesByLeague: Record<string, University[]>;
  /** players grouped by universityId */
  playersByUniversity: Record<string, Player[]>;
  loading: boolean;
}

const initialState: DataState = {
  universitiesByLeague: {},
  playersByUniversity: {},
  loading: false,
};

/** Loads universities from the original asset files (for New Game). */
export const loadUniversitiesFromFiles = createAsyncThunk(
  "data/loadUniversitiesFromFiles",
  async () => {
    const universities: University[] = await window.api.loadJson("universities");
    return universities;
  },
);

function groupByLeague(universities: University[]): Record<string, University[]> {
  const result: Record<string, University[]> = {};
  for (const uni of universities) {
    if (!result[uni.leagueId]) result[uni.leagueId] = [];
    result[uni.leagueId].push(uni);
  }
  return result;
}

function groupByUniversity(players: Player[]): Record<string, Player[]> {
  const result: Record<string, Player[]> = {};
  for (const player of players) {
    if (!result[player.currentUniversity]) result[player.currentUniversity] = [];
    result[player.currentUniversity].push(player);
  }
  return result;
}

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setUniversities(state, action: PayloadAction<University[]>) {
      state.universitiesByLeague = groupByLeague(action.payload);
    },
    setPlayers(state, action: PayloadAction<Record<string, Player>>) {
      state.playersByUniversity = groupByUniversity(Object.values(action.payload));
    },
    updatePlayer(
      state,
      action: PayloadAction<{ id: string; changes: Partial<Player> }>,
    ) {
      const { id, changes } = action.payload;
      for (const players of Object.values(state.playersByUniversity)) {
        const player = players.find((p) => p.id === id);
        if (player) {
          Object.assign(player, changes);
          return;
        }
      }
    },
    updatePlayerSkill(
      state,
      action: PayloadAction<{
        id: string;
        skill: keyof Skill;
        value: number;
      }>,
    ) {
      const { id, skill, value } = action.payload;
      for (const players of Object.values(state.playersByUniversity)) {
        const player = players.find((p) => p.id === id);
        if (player?.skills) {
          player.skills[skill] = value;
          return;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUniversitiesFromFiles.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUniversitiesFromFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.universitiesByLeague = groupByLeague(action.payload);
      })
      .addCase(loadUniversitiesFromFiles.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setUniversities, setPlayers, updatePlayer, updatePlayerSkill } =
  dataSlice.actions;
export default dataSlice.reducer;
