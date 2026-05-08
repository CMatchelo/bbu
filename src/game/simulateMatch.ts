import { GameState } from "../types/GameState";
import { University } from "../types/University";
import { createEmptyTeamStats } from "../utils/createEmptyStats";
import { initializePlayerStats } from "./initializePlayersState";
import { selectCpuStarters } from "./selectCpuStarters";
import { simulatePossession } from "./simulatePossession";
import { updateStats, updateTeamStats } from "./updateGameStats";
import { MatchWithTeams } from "../types/Match";
import { AppDispatch, store } from "../store";
import {
  selectAllPlayers,
  selectAllUniversities,
  selectPlayersFromUniversity,
} from "../selectors/data.selectors";
import { setMultipleMatchResults } from "../store/slices/scheduleSlice";
import { PlayerGameStats } from "../types/PlayerGameStats";
import { TeamGameStats } from "../types/TeamGameStats";
import {
  updatePlayersSkills,
  updatePlayerStats,
  updateUniversityStats,
} from "../store/slices/dataSlice";
import {
  playerGameStatsToDeltas,
  teamGameStatsToDeltas,
} from "../utils/gameStatsToMatchResults";
import { QUARTER_DURATION, TIMEOUTS_QTY } from "../constants/game.constants";
import { progressPlayers } from "./playerProgression";
import { substituteCPU } from "./cpuSubs";
import { toRecord } from "../utils/toRecord";

export function simulateMatchWithoutPlayer(
  schedule: MatchWithTeams[],
  currentWeek: number,
  userUni: string,
  dispatch: AppDispatch,
  includeUserMatches = false,
) {
  const matches = schedule.filter(
    (match) =>
      (includeUserMatches || (match.away !== userUni && match.home !== userUni)) &&
      !match.played &&
      match.week <= currentWeek,
  );
  const state = store.getState();
  const universities = selectAllUniversities(state);
  const uniById = Object.fromEntries(universities.map((u) => [u.id, u]));
  const results = matches
    .map((match) => {
      const home = uniById[match.homeTeam.id];
      const away = uniById[match.awayTeam.id];

      if (!home || !away) return null;

      const result = simulateFullMatch(home, away);
      if (!result) return null;

      return {
        matchId: match.id,
        homeScore: result?.homeScore || 0,
        awayScore: result?.awayScore || 0,
        playerStats: result.playerStats,
        homeStats: result.homeStats,
        awayStats: result.awayStats,
      };
    })
    .filter(Boolean);

  const matchesSimulated = results.filter(
    (item): item is NonNullable<typeof item> => item !== null,
  );
  dispatch(
    setMultipleMatchResults(
      matchesSimulated.map(({ matchId, homeScore, awayScore }) => ({
        matchId,
        homeScore,
        awayScore,
      })),
    ),
  );

  const allPlayerStats: Record<string, PlayerGameStats> = {};
  const allTeamStats: Record<string, TeamGameStats> = {};

  for (const match of matchesSimulated) {
    for (const [id, stats] of Object.entries(match.playerStats)) {
      allPlayerStats[id] = stats;
    }

    // TeamStats
    allTeamStats[match.homeStats.id] = match.homeStats;
    allTeamStats[match.awayStats.id] = match.awayStats;
  }

  const allPlayers = selectAllPlayers(store.getState());
  const unis = toRecord(universities);
  const playersWithProgress = progressPlayers(allPlayers, allPlayerStats, unis);

  dispatch(updatePlayerStats(playerGameStatsToDeltas(2026, allPlayerStats)));
  dispatch(updatePlayersSkills(playersWithProgress));
  dispatch(updateUniversityStats(teamGameStatsToDeltas(2026, allTeamStats)));
}

function simulateFullMatch(
  homeUniversity: University,
  awayUniversity: University,
) {
  const homePlayers = selectPlayersFromUniversity(store.getState(), homeUniversity.id);
  const awayPlayers = selectPlayersFromUniversity(store.getState(), awayUniversity.id);
  const state = {
    quarter: 1,
    timeLeft: QUARTER_DURATION,
    isGameOver: false,
    currentPoss: "home",
    homeStats: createEmptyTeamStats(homeUniversity.id),
    awayStats: createEmptyTeamStats(awayUniversity.id),
    playerStats: initializePlayerStats(
      homeUniversity.id,
      awayUniversity.id,
      homePlayers,
      awayPlayers,
    ),
    homeLineup: selectCpuStarters(homePlayers || []),
    awayLineup: selectCpuStarters(awayPlayers || []),
    homeTimeouts: TIMEOUTS_QTY,
    homeTimeoutsOnQrt: 0,
    awayTimeouts: TIMEOUTS_QTY,
    awayTimeoutsOnQrt: 0,
    logPlays: [],
  };

  if (state.isGameOver && state.homeStats.points === state.homeStats.points) {
    state.isGameOver = false;
    state.timeLeft += 60;
  }

  while (!state.isGameOver) {
    runNextPossessionPure(state, homeUniversity, awayUniversity);
  }

  return {
    homeScore: state.homeStats.points,
    awayScore: state.awayStats.points,
    playerStats: state.playerStats,
    homeStats: state.homeStats,
    awayStats: state.awayStats,
  };
}

function runNextPossessionPure(
  state: GameState,
  homeUniversity: University,
  awayUniversity: University,
) {
  if (state.isGameOver || !state.currentPoss || state.timeLeft <= 0) {
    return state;
  }

  const offenseIsHome = state.currentPoss === state.homeStats.id;

  const offensePlayers = offenseIsHome ? state.homeLineup : state.awayLineup;

  const defensePlayers = offenseIsHome ? state.awayLineup : state.homeLineup;

  const result = simulatePossession(
    offensePlayers,
    defensePlayers,
    offenseIsHome,
    80,
    state.playerStats,
  );

  const duration = Math.floor(Math.random() * 10) + 15;

  // clock
  state.timeLeft -= duration;

  if (state.timeLeft <= 0) {
    state.homeTimeoutsOnQrt = 0;
    state.awayTimeoutsOnQrt = 0;

    if (state.quarter === 4) {
      state.isGameOver = true;
      state.timeLeft = 0;
      return state;
    }

    state.quarter += 1;
    state.timeLeft = QUARTER_DURATION;
  }

  // player stats
  const { updatedStats, newlyInjuredIds } = updateStats(
    state.playerStats,
    result,
    duration,
    false,
    homeUniversity,
    awayUniversity,
    state.homeLineup,
    state.awayLineup,
  );
  state.playerStats = updatedStats;

  // Substitute injured CPU players immediately
  if (newlyInjuredIds.length > 0) {
    const homePlayers = selectPlayersFromUniversity(store.getState(), homeUniversity.id) || [];
    const awayPlayers = selectPlayersFromUniversity(store.getState(), awayUniversity.id) || [];

    const injuredInHome = newlyInjuredIds.some((id) =>
      state.homeLineup.some((p) => p.id === id),
    );
    const injuredInAway = newlyInjuredIds.some((id) =>
      state.awayLineup.some((p) => p.id === id),
    );

    const scoreDiff = state.homeStats.points - state.awayStats.points;

    if (injuredInHome) {
      state.homeLineup = substituteCPU(homePlayers, state.homeLineup, state.playerStats, scoreDiff);
    }
    if (injuredInAway) {
      state.awayLineup = substituteCPU(awayPlayers, state.awayLineup, state.playerStats, -scoreDiff);
    }
  }

  // team stats
  const updated = updateTeamStats(state.homeStats, state.awayStats, result);

  state.homeStats = updated.newHomeStats;
  state.awayStats = updated.newAwayStats;

  // troca posse
  if (
    result.success ||
    result.result === "def_rebound" ||
    result.result === "turnover"
  ) {
    state.currentPoss =
      state.currentPoss === state.homeStats.id
        ? state.awayStats.id
        : state.homeStats.id;
  }

  return state;
}