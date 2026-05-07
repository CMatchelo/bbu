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
} from "../../../selectors/data.selectors";
import { toRecord } from "../../../utils/toRecord";
import { TeamGameStats } from "../../../types/TeamGameStats";
import { setStarters } from "../../../store/slices/gameSettingsSlice";
import { savePlayers, saveUniversities, saveHighSchoolPlayers } from "../../../utils/saveGame";
import { calcAllSkillRanges } from "../../../utils/createPlayer";
import { progressPlayers } from "../../../game/playerProgression";
import { CalculateHSGrades } from "../../../game/educationFunctions";
import { Skill } from "../../../types/Skill";
import { updatePlayersAttributes } from "../../../game/updatePlayers";
import { runCpuScouting, runCpuSigning } from "../../../game/cpuScouting";

interface UseSaveGameParams {
  user: User;
  matchId: string;
  week: number;
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
        playerTeamId,
        dispatch,
      );
      const folderName = `${user.name}_${user.id}`;
      // Update week
      dispatch(incrementWeek());

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
        updateUniversityStats(teamGameStatsToDeltas(2026, uniGameStats)),
      );
      await saveUniversities(folderName);
      await dispatch(saveScheduleThunk(folderName));
      dispatch(setStarters([]));

      navigate("/team");
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
    playerTeamId,
    dispatch,
    navigate,
  ]);

  return { isSaving, saveError, saveGame };
}
