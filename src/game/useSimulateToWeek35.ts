import { useCallback } from "react";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { store } from "../store";
import { selectAllUniversities } from "../selectors/data.selectors";
import { useUser } from "../Context/UserContext";
import { setCurrentWeek, saveScheduleThunk } from "../store/slices/scheduleSlice";
import { simulateMatchWithoutPlayer } from "./simulateMatch";
import { savePlayers, saveUniversities } from "../utils/saveGame";

const SIM_TARGET_WEEK = 35;

export function useSimulateToWeek35() {
  const dispatch = useAppDispatch();
  const { user } = useUser();

  return useCallback(async () => {
    if (!user) return;
    const folderName = `${user.name}_${user.id}`;

    const startWeek = store.getState().schedule.currentWeek;

    for (let week = startWeek; week <= SIM_TARGET_WEEK; week++) {
      const stateNow = store.getState();
      const universities = selectAllUniversities(stateNow);
      const uniById = Object.fromEntries(universities.map((u) => [u.id, u]));

      const weekMatches = Object.values(stateNow.schedule.matchesById)
        .filter((m) => m.week === week && !m.played && uniById[m.home] && uniById[m.away])
        .map((m) => ({ ...m, homeTeam: uniById[m.home], awayTeam: uniById[m.away] }));

      if (weekMatches.length > 0) {
        simulateMatchWithoutPlayer(weekMatches, week, user.currentSeason, user.currentUniversity.id, dispatch, true);
      }

      dispatch(setCurrentWeek(week + 1));
    }

    await Promise.all([
      dispatch(saveScheduleThunk(folderName)),
      saveUniversities(folderName),
      savePlayers(folderName),
    ]);
  }, [dispatch, user]);
}
