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
  updatePlayerStats,
  updateUniversityStats,
} from "../../../store/slices/dataSlice";
import { User } from "../../../types/User";
import { PlayerGameStats } from "../../../types/PlayerGameStats";
import { gameStatsToMatchResults } from "../../../utils/gameStatsToMatchResults";
import { selectAllPlayers, selectAllUniversities } from "../../../selectors/data.selectors";
import { toRecord } from "../../../utils/toRecord";
import { TeamGameStats } from "../../../types/TeamGameStats";

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

      dispatch(incrementWeek());
      dispatch(
        updatePlayerStats(
          gameStatsToMatchResults({ currentYear: 2026, playerGameStats }),
        ),
      );
      const players = selectAllPlayers(store.getState());

      const folderName = `${user.name}_${user.id}`;
      await window.api.savePlayers(folderName, toRecord(players));
      const uniGameStats = toRecord([homeStats, awayStats]);
      dispatch(
        updateUniversityStats(
          gameStatsToMatchResults({ currentYear: 2026, uniGameStats }),
        ),
      );
      const universities = selectAllUniversities(store.getState());
      console.log(universities);
      await window.api.saveUniversities(folderName, toRecord(universities));
      await dispatch(saveScheduleThunk(folderName));

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
