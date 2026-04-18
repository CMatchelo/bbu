import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { selectMatchesToSimulate } from "../../../selectors/data.scheduleSelector";
import { simulateMatchWithoutPlayer } from "../../../game/simulateMatch";
import {
  incrementWeek,
  saveScheduleThunk,
  setMatchResult,
} from "../../../store/slices/scheduleSlice";
import { User } from "../../../types/User";

interface UseSaveGameParams {
  user: User;
  matchId: string;
  week: number;
  playerTeamId: string;
  homePoints: number;
  awayPoints: number;
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

      const folderName = `${user.name}_${user.id}`;
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
    matchesToSimulate,
    week,
    playerTeamId,
    dispatch,
    navigate,
  ]);

  return { isSaving, saveError, saveGame };
}
