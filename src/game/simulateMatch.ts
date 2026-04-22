import { GameState } from "../types/GameState";
import { University } from "../types/University";
import { createEmptyTeamStats } from "../utils/createEmptyStats";
import { quarterDuration } from "../constants/quarterDuration";
import { initializePlayerStats } from "./initializePlayersState";
import { selectCpuStarters } from "./selectCpuStarters";
import { simulatePossession } from "./simulatePossession";
import { updateStats, updateTeamStats } from "./updateGameStats";
import { MatchWithTeams } from "../types/Match";
import { AppDispatch, store } from "../store";
import { selectUniversitiesWithPlayers } from "../selectors/data.selectors";
import { setMultipleMatchResults } from "../store/slices/scheduleSlice";

export function simulateMatchWithoutPlayer(
  schedule: MatchWithTeams[],
  currentWeek: number,
  userUni: string,
  dispatch: AppDispatch,
) {
  const matches = schedule.filter(
    (match) =>
      match.away !== userUni &&
      match.home !== userUni &&
      !match.played &&
      match.week <= currentWeek,
  );
  const state = store.getState();
  const universities = selectUniversitiesWithPlayers(state);
  const uniById = Object.fromEntries(universities.map((u) => [u.id, u]));
  const results = matches
    .map((match) => {
      const home = uniById[match.homeTeam.id];
      const away = uniById[match.awayTeam.id];

      if (!home || !away) return null;

      const result = simulateFullMatch(home, away);

      return {
        matchId: match.id,
        homeScore: result?.homeScore || 0,
        awayScore: result?.awayScore || 0,
      };
    })
    .filter(Boolean);
  const matchesSimulated = results.filter(
    (item): item is { matchId: string; homeScore: number; awayScore: number } =>
      item !== null,
  );
  dispatch(setMultipleMatchResults(matchesSimulated));
}

export function simulateFullMatch(
  homeUniversity: University,
  awayUniversity: University,
) {
  if (!homeUniversity.players || !awayUniversity.players) return;
  const state = {
    quarter: 1,
    timeLeft: quarterDuration,
    isGameOver: false,
    currentPoss: "home",
    homeStats: createEmptyTeamStats(homeUniversity.id),
    awayStats: createEmptyTeamStats(awayUniversity.id),
    playerStats: initializePlayerStats(
      homeUniversity.id,
      awayUniversity.id,
      homeUniversity.players,
      awayUniversity.players,
    ),
    homeLineup: selectCpuStarters(homeUniversity.players || []),
    awayLineup: selectCpuStarters(awayUniversity.players || []),
    homeTimeouts: 8,
    homeTimeoutsOnQrt: 0,
    awayTimeouts: 8,
    awayTimeoutsOnQrt: 0,
    logPlays: [],
  };

  while (!state.isGameOver) {
    runNextPossessionPure(state, homeUniversity, awayUniversity);
  }

  return {
    homeScore: state.homeStats.points,
    awayScore: state.awayStats.points,
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
    state.timeLeft = quarterDuration;
  }

  // player stats
  state.playerStats = updateStats(
    state.playerStats,
    result,
    duration,
    false,
    homeUniversity,
    awayUniversity,
    state.homeLineup,
    state.awayLineup,
  );

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
