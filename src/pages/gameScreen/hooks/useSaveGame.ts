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
  updatePlayersSkills,
  updatePlayerStats,
  updateUniversityStats,
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
} from "../../../selectors/data.selectors";
import { toRecord } from "../../../utils/toRecord";
import { TeamGameStats } from "../../../types/TeamGameStats";
import { setStarters } from "../../../store/slices/gameSettingsSlice";
import { savePlayers, saveUniversities } from "../../../utils/saveGame";
import { progressPlayers } from "../../../game/playerProgression";

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
        updatePlayerStats(playerGameStatsToDeltas(user.currentSeason, playerGameStats)),
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
