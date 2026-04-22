import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Player } from "../../types/Player";
import { University } from "../../types/University";
import { Skill } from "../../types/Skill";
import { SeasonStats } from "../../types/SeasonStats";

interface DataState {
  /** universities grouped by leagueId */
  universitiesByLeague: Record<string, University[]>;
  /** players grouped by universityId */
  playersByUniversity: Record<string, Player[]>;
  loading: boolean;
  error?: string;
}

const initialState: DataState = {
  universitiesByLeague: {},
  playersByUniversity: {},
  loading: false,
};

export const loadUniversitiesFromFiles = createAsyncThunk(
  "data/loadUniversitiesFromFiles",
  async () => {
    const universities: University[] =
      await window.api.loadJson("universities");
    return universities;
  },
);

function groupByLeague(
  universities: University[],
): Record<string, University[]> {
  return universities.reduce<Record<string, University[]>>((acc, uni) => {
    (acc[uni.leagueId] ??= []).push(uni);
    return acc;
  }, {});
}

function groupByUniversity(players: Player[]): Record<string, Player[]> {
  return players.reduce<Record<string, Player[]>>((acc, player) => {
    (acc[player.currentUniversity] ??= []).push(player);
    return acc;
  }, {});
}

/** Finds a player across all university buckets. Mutates via Immer — safe inside reducers. */
function findPlayer(
  playersByUniversity: Record<string, Player[]>,
  id: string,
): Player | undefined {
  for (const players of Object.values(playersByUniversity)) {
    const player = players.find((p) => p.id === id);
    if (player) return player;
  }
}

function findUniversity(
  universitiesByLeague: Record<string, University[]>,
  id: string,
): University | undefined {
  for (const universities of Object.values(universitiesByLeague)) {
    const uni = universities.find((u) => u.id === id);
    if (uni) return uni;
  }
}

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setUniversities(state, action: PayloadAction<University[]>) {
      state.universitiesByLeague = groupByLeague(action.payload);
    },

    /** Accepts either a Player[] or a Record<string, Player> for flexibility. */
    setPlayers(
      state,
      action: PayloadAction<Player[] | Record<string, Player>>,
    ) {
      const players = Array.isArray(action.payload)
        ? action.payload
        : Object.values(action.payload);
      state.playersByUniversity = groupByUniversity(players);
    },
    updatePlayer(
      state,
      action: PayloadAction<{ id: string; changes: Partial<Player> }>,
    ) {
      const { id, changes } = action.payload;
      const player = findPlayer(state.playersByUniversity, id);
      if (player) Object.assign(player, changes);
    },
    updatePlayerStats(
      state,
      action: PayloadAction<
        {
          id: string;
          skillChanges?: Partial<Skill>;
          statDeltas?: Partial<SeasonStats>;
        }[]
      >,
    ) {
      for (const { id, skillChanges, statDeltas } of action.payload) {
        const player = findPlayer(state.playersByUniversity, id);
        if (!player) continue;

        if (skillChanges && player.skills) {
          Object.assign(player.skills, skillChanges); // skills = substituição direta
        }

        if (statDeltas && statDeltas.year && player.stats[statDeltas.year]) {
          for (const key of Object.keys(statDeltas) as (keyof SeasonStats)[]) {
            if (statDeltas[key] !== undefined) {
              player.stats[statDeltas.year][key] += statDeltas[key]!;
            }
          }
        }
      }
    },
    updateUniversityStats(
      state,
      action: PayloadAction<
        {
          id: string;
          statDeltas?: Partial<SeasonStats>;
        }[]
      >,
    ) {
      for (const { id, statDeltas } of action.payload) {
        const university = findUniversity(state.universitiesByLeague, id);
        if (!university) continue;

        if (
          statDeltas &&
          statDeltas.year &&
          university.stats[statDeltas.year]
        ) {
          for (const key of Object.keys(statDeltas) as (keyof SeasonStats)[]) {
            if (statDeltas[key] !== undefined) {
              university.stats[statDeltas.year][key] += statDeltas[key]!;
            }
          }
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUniversitiesFromFiles.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(loadUniversitiesFromFiles.fulfilled, (state, action) => {
        state.loading = false;
        state.universitiesByLeague = groupByLeague(action.payload);
      })
      .addCase(loadUniversitiesFromFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setUniversities, setPlayers, updatePlayer, updatePlayerStats, updateUniversityStats } =
  dataSlice.actions;
export default dataSlice.reducer;
