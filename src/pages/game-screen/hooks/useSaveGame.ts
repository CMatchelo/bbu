import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useSelector } from "react-redux";
import { RootState, store } from "../../../store";
import { selectMatchesToSimulate } from "../../../selectors/data.scheduleSelector";
import { simulateMatchWithoutPlayer } from "../../../game/simulateMatch";
import {
  incrementWeek,
  saveScheduleThunk,
  setMatchResult,
  addMatches,
  addLeagueStandings,
} from "../../../store/slices/scheduleSlice";
import {
  updatePlayers,
  updatePlayersSkills,
  updatePlayerStats,
  updateUniversityStats,
  updateHighSchoolPlayers,
  updateUniversities,
} from "../../../store/slices/dataSlice";
import { User } from "../../../types/User";
import { PlayerGameStats } from "../../../types/PlayerGameStats";
import {
  playerGameStatsToDeltas,
  teamGameStatsToDeltas,
} from "../../../utils/gameStatsToMatchResults";
import {
  selectAllPlayers,
  selectAllUniversities,
  selectAllHighSchoolPlayers,
  selectUniversitiesGrouped,
} from "../../../selectors/data.selectors";
import { toRecord } from "../../../utils/toRecord";
import { TeamGameStats } from "../../../types/TeamGameStats";
import { setStarters } from "../../../store/slices/gameSettingsSlice";
import { savePlayers, saveUniversities, saveHighSchoolPlayers, saveLeagueStandings } from "../../../utils/saveGame";
import { calcAllSkillRanges } from "../../../utils/createPlayer";
import { progressPlayers } from "../../../game/playerProgression";
import { CalculateHSGrades } from "../../../game/educationFunctions";
import { Skill } from "../../../types/Skill";
import { updatePlayersAttributes } from "../../../game/updatePlayers";
import { runCpuScouting, runCpuSigning } from "../../../game/cpuScouting";
import { REGULAR_SEASON_WEEKS, PLAYOFFS_CHAMPIONSHIP } from "../../../constants/game.constants";
import {
  getPlayoffQualifiers,
  buildR1Matches,
  advancePlayoffs,
  buildLeagueStandings,
  sortTeams,
  computeSeriesStates,
} from "../../../utils/playoffsUtils";

interface UseSaveGameParams {
  user: User;
  matchId: string;
  week: number;
  currentSeason: number;
  playerTeamId: string;
  homePoints: number;
  awayPoints: number;
  playerGameStats: Record<string, PlayerGameStats>;
  homeStats: TeamGameStats;
  awayStats: TeamGameStats;
}

interface UseSaveGameReturn {
  isSaving: boolean;
  saveError: string | null;
  saveGame: () => Promise<void>;
}

export function useSaveGame({
  user,
  matchId,
  week,
  currentSeason,
  playerTeamId,
  homePoints,
  awayPoints,
  playerGameStats,
  homeStats,
  awayStats,
}: UseSaveGameParams): UseSaveGameReturn {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const matchesToSimulate = useSelector((state: RootState) =>
    selectMatchesToSimulate(state, week, playerTeamId),
  );

  const saveGame = useCallback(async () => {
    if (isSaving) return;

    setIsSaving(true);
    setSaveError(null);
    try {
      const matchResult = {
        matchId,
        homeScore: homePoints,
        awayScore: awayPoints,
      };

      dispatch(setMatchResult(matchResult));
      simulateMatchWithoutPlayer(
        matchesToSimulate,
        week,
        currentSeason,
        playerTeamId,
        dispatch,
      );
      const folderName = `${user.name}_${user.id}`;

      // --- Playoffs logic ---
      let skipIncrementWeek = false;
      const allUniversities = selectAllUniversities(store.getState());
      const leagueGroups = selectUniversitiesGrouped(store.getState());

      if (week === REGULAR_SEASON_WEEKS) {
        // End of regular season: set regional ranks and create R1 bracket
        const tieRands = new Map<string, number>();
        allUniversities.forEach((u) => tieRands.set(u.id, Math.random()));

        const rankUpdates: { id: string; changes: Partial<typeof allUniversities[0]> }[] = [];
        for (const [, teams] of Object.entries(leagueGroups)) {
          const sorted = sortTeams(teams, user.currentSeason, tieRands);
          sorted.forEach((u, idx) => {
            const existing = u.seasonRecords ?? [];
            rankUpdates.push({
              id: u.id,
              changes: {
                seasonRecords: [
                  ...existing.filter((r) => r.season !== user.currentSeason),
                  { season: user.currentSeason, regionalRank: idx + 1, playoffResult: null },
                ],
              },
            });
          });
        }
        dispatch(updateUniversities(rankUpdates));

        const qualifiers = getPlayoffQualifiers(leagueGroups, user.currentSeason);
        const r1Matches = buildR1Matches(qualifiers, week + 1);
        dispatch(addMatches(r1Matches));
      }

      if (week >= REGULAR_SEASON_WEEKS) {
        // After each playoff week: advance series and rounds
        const currentMatchesById = store.getState().schedule.matchesById;
        const { newMatches, eliminated, champion } = advancePlayoffs(currentMatchesById);

        if (newMatches.length > 0) {
          dispatch(addMatches(newMatches));
        }

        if (eliminated.length > 0) {
          const freshUnis = selectAllUniversities(store.getState());
          const elimUpdates = eliminated.map(({ id, result }) => {
            const uni = freshUnis.find((u) => u.id === id);
            const existing = uni?.seasonRecords ?? [];
            return {
              id,
              changes: {
                seasonRecords: existing.map((r) =>
                  r.season === user.currentSeason ? { ...r, playoffResult: result } : r,
                ),
              },
            };
          });
          dispatch(updateUniversities(elimUpdates));
        }

        if (champion) {
          // Mark champion
          const freshUnis = selectAllUniversities(store.getState());
          const champUni = freshUnis.find((u) => u.id === champion);
          if (champUni) {
            const existing = champUni.seasonRecords ?? [];
            dispatch(updateUniversities([{
              id: champion,
              changes: {
                seasonRecords: existing.map((r) =>
                  r.season === user.currentSeason ? { ...r, playoffResult: 'champion' } : r,
                ),
              },
            }]));
          }

          // Build and save LeagueStandings for this year
          const tieRands = new Map<string, number>();
          const latestUnis = selectAllUniversities(store.getState());
          latestUnis.forEach((u) => tieRands.set(u.id, Math.random()));
          const standings = buildLeagueStandings(selectUniversitiesGrouped(store.getState()), user.currentSeason, champion, tieRands);
          dispatch(addLeagueStandings(standings));
          const history = store.getState().schedule.leagueStandingsHistory;
          await saveLeagueStandings(folderName, history);
        }

        // If user just won their series but other series in the same round are still pending,
        // simulate those series to completion so the next round can be created
        const justPlayedMatch = store.getState().schedule.matchesById[matchId];
        if (justPlayedMatch?.playoffMatchupId) {
          const allSeriesNow = computeSeriesStates(store.getState().schedule.matchesById);
          const userSeries = allSeriesNow.find((s) => s.matchupId === justPlayedMatch.playoffMatchupId);

          if (userSeries?.decided && userSeries.winnerId === playerTeamId) {
            const sameRoundPending = allSeriesNow.filter(
              (s) => s.round === userSeries.round && !s.decided,
            );

            if (sameRoundPending.length > 0) {
              skipIncrementWeek = true;
              dispatch(incrementWeek());

              let roundComplete = false;
              while (!roundComplete) {
                const stateNow = store.getState();
                const matchesNow = stateNow.schedule.matchesById;

                const pendingMatchupIds = new Set(
                  computeSeriesStates(matchesNow)
                    .filter((s) => s.round === userSeries.round && !s.decided)
                    .map((s) => s.matchupId),
                );

                if (pendingMatchupIds.size === 0) { roundComplete = true; break; }

                const pendingMatches = Object.values(matchesNow).filter(
                  (m) =>
                    m.championship === PLAYOFFS_CHAMPIONSHIP &&
                    !m.played &&
                    m.playoffMatchupId != null &&
                    pendingMatchupIds.has(m.playoffMatchupId),
                );

                if (pendingMatches.length === 0) { roundComplete = true; break; }

                const nextWeekNum = Math.min(...pendingMatches.map((m) => m.week));
                const uniById = Object.fromEntries(
                  selectAllUniversities(stateNow).map((u) => [u.id, u]),
                );
                const toSimulate = pendingMatches
                  .filter((m) => m.week === nextWeekNum)
                  .map((m) => ({ ...m, homeTeam: uniById[m.home], awayTeam: uniById[m.away] }))
                  .filter((m) => m.homeTeam && m.awayTeam);

                if (toSimulate.length === 0) { roundComplete = true; break; }

                simulateMatchWithoutPlayer(toSimulate, nextWeekNum, currentSeason, playerTeamId, dispatch);
                dispatch(incrementWeek());

                const afterState = store.getState();
                const { newMatches: nm, eliminated: el, champion: champ } = advancePlayoffs(afterState.schedule.matchesById);

                if (nm.length > 0) dispatch(addMatches(nm));

                if (el.length > 0) {
                  const freshUs = selectAllUniversities(afterState);
                  const elUpdates = el.map(({ id, result }) => {
                    const u = freshUs.find((u) => u.id === id);
                    const ex = u?.seasonRecords ?? [];
                    return {
                      id,
                      changes: {
                        seasonRecords: ex.map((r) =>
                          r.season === user.currentSeason ? { ...r, playoffResult: result } : r,
                        ),
                      },
                    };
                  });
                  dispatch(updateUniversities(elUpdates));
                }

                if (champ) {
                  const latestUs = selectAllUniversities(store.getState());
                  const cu = latestUs.find((u) => u.id === champ);
                  if (cu) {
                    const ex = cu.seasonRecords ?? [];
                    dispatch(updateUniversities([{
                      id: champ,
                      changes: {
                        seasonRecords: ex.map((r) =>
                          r.season === user.currentSeason ? { ...r, playoffResult: 'champion' } : r,
                        ),
                      },
                    }]));
                  }
                  const tieRandsF = new Map<string, number>();
                  selectAllUniversities(store.getState()).forEach((u) => tieRandsF.set(u.id, Math.random()));
                  const st = buildLeagueStandings(selectUniversitiesGrouped(store.getState()), user.currentSeason, champ, tieRandsF);
                  dispatch(addLeagueStandings(st));
                  const hist = store.getState().schedule.leagueStandingsHistory;
                  await saveLeagueStandings(folderName, hist);
                  roundComplete = true;
                }

                // Round complete when no more pending series in user's round
                const updatedSeries = computeSeriesStates(store.getState().schedule.matchesById);
                if (updatedSeries.filter((s) => s.round === userSeries.round).every((s) => s.decided)) {
                  roundComplete = true;
                }
              }
            }
          }
        }

        // If user's team is eliminated, simulate all remaining playoff weeks automatically
        const allUnisCurrent = selectAllUniversities(store.getState());
        const userUni = allUnisCurrent.find((u) => u.id === user.currentUniversity.id);
        const userRecord = userUni?.seasonRecords?.find((r) => r.season === user.currentSeason);
        const userEliminated = userRecord?.playoffResult != null && userRecord.playoffResult !== 'champion';

        if (userEliminated) {
          skipIncrementWeek = true;
          // Increment week for the just-completed playoff game before auto-simulating the rest
          dispatch(incrementWeek());
          let remaining = true;
          while (remaining) {
            const stateNow = store.getState();
            const matchesNow = stateNow.schedule.matchesById;
            const allPlayoffMatches = Object.values(matchesNow).filter(
              (m) => m.championship === 'playoffs' && !m.played,
            );
            if (allPlayoffMatches.length === 0) { remaining = false; break; }

            // Simulate all unplayed playoff matches in the next week
            const nextWeekNum = Math.min(...allPlayoffMatches.map((m) => m.week));
            const toSimulate = allPlayoffMatches
              .filter((m) => m.week === nextWeekNum)
              .map((m) => {
                const uniById = Object.fromEntries(
                  selectAllUniversities(stateNow).map((u) => [u.id, u]),
                );
                return { ...m, homeTeam: uniById[m.home], awayTeam: uniById[m.away] };
              })
              .filter((m) => m.homeTeam && m.awayTeam);

            if (toSimulate.length === 0) { remaining = false; break; }

            simulateMatchWithoutPlayer(toSimulate, nextWeekNum, currentSeason, '', dispatch);
            dispatch(incrementWeek());

            const afterState = store.getState();
            const { newMatches: nm, eliminated: el, champion: champ } = advancePlayoffs(afterState.schedule.matchesById);

            if (nm.length > 0) dispatch(addMatches(nm));

            if (el.length > 0) {
              const freshUs = selectAllUniversities(afterState);
              const elUpdates = el.map(({ id, result }) => {
                const u = freshUs.find((u) => u.id === id);
                const ex = u?.seasonRecords ?? [];
                return {
                  id,
                  changes: {
                    seasonRecords: ex.map((r) =>
                      r.season === user.currentSeason ? { ...r, playoffResult: result } : r,
                    ),
                  },
                };
              });
              dispatch(updateUniversities(elUpdates));
            }

            if (champ) {
              const latestUs = selectAllUniversities(store.getState());
              const cu = latestUs.find((u) => u.id === champ);
              if (cu) {
                const ex = cu.seasonRecords ?? [];
                dispatch(updateUniversities([{
                  id: champ,
                  changes: {
                    seasonRecords: ex.map((r) =>
                      r.season === user.currentSeason ? { ...r, playoffResult: 'champion' } : r,
                    ),
                  },
                }]));
              }
              const tieRandsF = new Map<string, number>();
              selectAllUniversities(store.getState()).forEach((u) => tieRandsF.set(u.id, Math.random()));
              const st = buildLeagueStandings(selectUniversitiesGrouped(store.getState()), user.currentSeason, champ, tieRandsF);
              dispatch(addLeagueStandings(st));
              const hist = store.getState().schedule.leagueStandingsHistory;
              await saveLeagueStandings(folderName, hist);
              remaining = false;
            }
          }
        }
      }
      // --- End playoffs logic ---

      // Update week (skipped when elimination loop already handled all increments)
      if (!skipIncrementWeek) {
        dispatch(incrementWeek());
      }

      // Update players stats
      dispatch(
        updatePlayerStats(
          playerGameStatsToDeltas(user.currentSeason, playerGameStats),
        ),
      );

      // Update players skills
      const allPlayers = selectAllPlayers(store.getState());
      const unis = toRecord(selectAllUniversities(store.getState()));
      const playersWithProgress = progressPlayers(
        allPlayers,
        playerGameStats,
        unis,
      );
      dispatch(updatePlayersSkills(playersWithProgress));

      // Update players injuries and grades
      const updates = updatePlayersAttributes(allPlayers);
      dispatch(updatePlayers(updates));

      // Update scouted high school players
      const hsPlayers = selectAllHighSchoolPlayers(store.getState());
      const scoutedUpdates = hsPlayers
        .filter((p) => p.scouted)
        .map((p) => {
          const oldKnowledge = p.playerKnowledge;
          const newKnowledge = Math.min(oldKnowledge + 10, 100);

          const thresholdsCrossed =
            Math.floor(newKnowledge / 10) - Math.floor(oldKnowledge / 10);

          const skillsRevealed = { ...p.skillsRevealed };
          if (newKnowledge >= 100) {
            (Object.keys(skillsRevealed) as (keyof Skill)[]).forEach((k) => {
              skillsRevealed[k] = true;
            });
          } else {
            const unrevealed = (Object.keys(skillsRevealed) as (keyof Skill)[]).filter(
              (k) => !skillsRevealed[k],
            );
            for (let i = 0; i < thresholdsCrossed && unrevealed.length > 0; i++) {
              const idx = Math.floor(Math.random() * unrevealed.length);
              skillsRevealed[unrevealed.splice(idx, 1)[0]] = true;
            }
          }

          const { minSkills, maxSkills } = calcAllSkillRanges(
            p.skills,
            newKnowledge,
            p.minSkills,
            p.maxSkills,
          );

          // Add user university to universityInterest when knowledge first crosses 30
          const crossedThreshold =
            oldKnowledge < 30 &&
            newKnowledge >= 30 &&
            !p.universityInterest.includes(user.currentUniversity.id);
          const universityInterest = crossedThreshold
            ? [...p.universityInterest, user.currentUniversity.id]
            : undefined;

          return {
            id: p.id,
            changes: {
              playerKnowledge: newKnowledge,
              minSkills,
              maxSkills,
              skillsRevealed,
              ...(universityInterest !== undefined ? { universityInterest } : {}),
            },
          };
        });
      if (scoutedUpdates.length > 0) {
        dispatch(updateHighSchoolPlayers(scoutedUpdates));
      }

      // Update HS player grades (all players, tutoring affects delta)
      const hsPlayersAfterScout = selectAllHighSchoolPlayers(store.getState());
      if (hsPlayersAfterScout.length > 0) {
        const gradeUpdates = CalculateHSGrades(hsPlayersAfterScout);
        dispatch(updateHighSchoolPlayers(gradeUpdates));
      }

      // CPU scouting: every 4 games
      const newWeek = week + 1;
      if (newWeek % 4 === 0) {
        const freshHs = selectAllHighSchoolPlayers(store.getState());
        const freshUnis = selectAllUniversities(store.getState());
        const freshPlayers = selectAllPlayers(store.getState());
        const { playerUpdates: sp, uniUpdates: su } = runCpuScouting(
          freshUnis, freshHs, freshPlayers, user.currentUniversity.id,
        );
        if (sp.length > 0) dispatch(updateHighSchoolPlayers(sp));
        if (su.length > 0) dispatch(updateUniversities(su));
      }

      // CPU signing: every 10 games
      if (newWeek % 10 === 0) {
        const freshHs = selectAllHighSchoolPlayers(store.getState());
        const freshUnis = selectAllUniversities(store.getState());
        const freshPlayers = selectAllPlayers(store.getState());
        const { playerUpdates: sp, uniUpdates: su } = runCpuSigning(
          freshUnis, freshHs, freshPlayers, user.currentUniversity.id,
        );
        if (sp.length > 0) dispatch(updateHighSchoolPlayers(sp));
        if (su.length > 0) dispatch(updateUniversities(su));
      }

      // Save HS players (covers scouting + grades + CPU changes)
      await saveHighSchoolPlayers(folderName);

      // Save players
      await savePlayers(folderName);

      // Update universities
      const uniGameStats = toRecord([homeStats, awayStats]);
      dispatch(
        updateUniversityStats(teamGameStatsToDeltas(currentSeason, uniGameStats)),
      );
      await saveUniversities(folderName);
      await dispatch(saveScheduleThunk(folderName));
      dispatch(setStarters([]));

      const isSeasonOver = store.getState().schedule.leagueStandingsHistory
        .some((s) => s.year === user.currentSeason && s.nationalChampion !== '');
      navigate(isSeasonOver ? "/endOfSeason" : "/team");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save game.";
      setSaveError(message);
      setIsSaving(false);
    }
  }, [
    isSaving,
    user,
    matchId,
    homePoints,
    awayPoints,
    playerGameStats,
    homeStats,
    awayStats,
    matchesToSimulate,
    week,
    currentSeason,
    playerTeamId,
    dispatch,
    navigate,
  ]);

  return { isSaving, saveError, saveGame };
}
