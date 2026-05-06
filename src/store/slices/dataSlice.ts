import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Player } from "../../types/Player";
import { University } from "../../types/University";
import { Skill } from "../../types/Skill";
import { HighSchoolPlayer } from "../../types/HighSchoolPlayer";
import { PlayerSeasonStats, TeamSeasonStats } from "../../types/SeasonStats";

interface DataState {
  /** universities grouped by leagueId */
  universitiesByLeague: Record<string, University[]>;
  /** players grouped by universityId */
  playersById: Record<string, Player>;
  highSchoolPlayersById: Record<string, HighSchoolPlayer>;
  loading: boolean;
  error?: string;
}

const initialState: DataState = {
  universitiesByLeague: {},
  playersById: {},
  highSchoolPlayersById: {},
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
    setPlayers(
      state,
      action: PayloadAction<Player[] | Record<string, Player>>,
    ) {
      const players = Array.isArray(action.payload)
        ? action.payload
        : Object.values(action.payload);
      state.playersById = {};
      for (const p of players) {
        state.playersById[p.id] = p;
      }
    },
    addPlayers(state, action: PayloadAction<Player[]>) {
      for (const p of action.payload) {
        state.playersById[p.id] = p;
      }
    },
    updatePlayer(
      state,
      action: PayloadAction<{ id: string; changes: Partial<Player> }>,
    ) {
      const { id, changes } = action.payload;
      const player = state.playersById[id];
      if (player) Object.assign(player, changes);
    },
    updatePlayers(
      state,
      action: PayloadAction<{ id: string; changes: Partial<Player> }[]>,
    ) {
      for (const { id, changes } of action.payload) {
        const player = state.playersById[id];
        if (player) Object.assign(player, changes);
      }
    },
    updatePlayerSkills(
      state,
      action: PayloadAction<{ id: string; changes: Partial<Skill> }>,
    ) {
      const { id, changes } = action.payload;
      const player = state.playersById[id];
      if (player?.skills) {
        Object.assign(player.skills, changes);
      }
    },
    updatePlayersSkills(
      state,
      action: PayloadAction<{ id: string; changes: Partial<Skill> }[]>,
    ) {
      for (const { id, changes } of action.payload) {
        const player = state.playersById[id];
        if (player?.skills) Object.assign(player.skills, changes);
      }
    },
    updatePlayerStats(
      state,
      action: PayloadAction<
        {
          id: string;
          statDeltas: Partial<PlayerSeasonStats>;
        }[]
      >,
    ) {
      for (const { id, statDeltas } of action.payload) {
        const player = state.playersById[id];
        if (!player) continue;

        if (statDeltas && statDeltas.year && player.stats[statDeltas.year]) {
          for (const key of Object.keys(
            statDeltas,
          ) as (keyof PlayerSeasonStats)[]) {
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
          statDeltas?: Partial<TeamSeasonStats>;
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
          for (const key of Object.keys(
            statDeltas,
          ) as (keyof TeamSeasonStats)[]) {
            if (statDeltas[key] !== undefined) {
              university.stats[statDeltas.year][key] += statDeltas[key]!;
            }
          }
        }
      }
    },
    setHighSchoolPlayers(
      state,
      action: PayloadAction<HighSchoolPlayer[] | Record<string, HighSchoolPlayer>>,
    ) {
      const players = Array.isArray(action.payload)
        ? action.payload
        : Object.values(action.payload);
      state.highSchoolPlayersById = {};
      for (const p of players) {
        state.highSchoolPlayersById[p.id] = p;
      }
    },
    updateHighSchoolPlayers(
      state,
      action: PayloadAction<{ id: string; changes: Partial<HighSchoolPlayer> }[]>,
    ) {
      for (const { id, changes } of action.payload) {
        const player = state.highSchoolPlayersById[id];
        if (player) Object.assign(player, changes);
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

export const {
  setUniversities,
  setPlayers,
  addPlayers,
  updatePlayer,
  updatePlayers,
  updatePlayerStats,
  updatePlayersSkills,
  updateUniversityStats,
  setHighSchoolPlayers,
  updateHighSchoolPlayers,
} = dataSlice.actions;
export default dataSlice.reducer;
