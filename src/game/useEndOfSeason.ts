import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useUser } from "../Context/UserContext";
import { store } from "../store";
import {
  selectAllPlayers,
  selectAllUniversities,
  selectAllHighSchoolPlayers,
} from "../selectors/data.selectors";
import {
  addPlayers,
  removePlayers,
  updatePlayers,
  setHighSchoolPlayers,
  updateUniversities,
} from "../store/slices/dataSlice";
import { setSchedule, setCurrentWeek, saveScheduleThunk } from "../store/slices/scheduleSlice";
import { generateLeagueSchedules } from "../utils/managerSchedule";
import { generateHighSchoolPlayers, convertHSPlayerToPlayer } from "../utils/createPlayer";
import { createEmptyPlayerSeasonStats, createEmptyTeamSeasonStats } from "../utils/createEmptySeasonStats";
import { savePlayers, saveUniversities, saveHighSchoolPlayers, saveGraduatedPlayers } from "../utils/saveGame";
import { rand } from "../utils/mathFunc";

export function useEndOfSeason() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, loadUser } = useUser();

  return useCallback(async () => {
    if (!user) return;

    const newSeason = user.currentSeason + 1;
    const folderName = `${user.name}_${user.id}`;

    // ── 1. Convert signed HS players to Player ────────────────────────────
    const hsPlayers = selectAllHighSchoolPlayers(store.getState());
    const signedHS = hsPlayers.filter((p) => p.signedWith !== null);
    const newCollegians = signedHS.map((p) => convertHSPlayerToPlayer(p, newSeason));
    if (newCollegians.length > 0) {
      dispatch(addPlayers(newCollegians));
    }

    // ── 2. Update existing players ────────────────────────────────────────
    const allPlayers = selectAllPlayers(store.getState());
    const graduatingIds: string[] = [];

    const playerUpdates = allPlayers
      .filter((p) => !newCollegians.some((nc) => nc.id === p.id))
      .map((p) => {
        const newYearsToGraduate = p.yearsToGraduate - 1;
        if (newYearsToGraduate <= 0) {
          graduatingIds.push(p.id);
        }
        return {
          id: p.id,
          changes: {
            yearsInCollege: p.yearsInCollege + 1,
            yearsToGraduate: newYearsToGraduate,
            stamina: rand(60, 90),
            available: true,
            stats: { ...p.stats, [newSeason]: createEmptyPlayerSeasonStats(newSeason) },
          },
        };
      });

    dispatch(updatePlayers(playerUpdates));

    // Save graduating players to disk before removing from state
    const allPlayersAfterUpdate = selectAllPlayers(store.getState());
    const graduatingPlayers = allPlayersAfterUpdate.filter((p) => graduatingIds.includes(p.id));
    if (graduatingPlayers.length > 0) {
      await saveGraduatedPlayers(folderName, graduatingPlayers);
      dispatch(removePlayers(graduatingIds));
    }

    // ── 3. Replace HS players with a fresh batch ──────────────────────────
    const freshHsPlayers = generateHighSchoolPlayers();
    dispatch(setHighSchoolPlayers(freshHsPlayers));

    // ── 4. Update universities ────────────────────────────────────────────
    const universities = selectAllUniversities(store.getState());
    const uniUpdates = universities.map((uni) => {
      const signedPlayerIds = uni.signedPlayers ?? [];
      const rosterWithSigned = [...uni.roster, ...signedPlayerIds];
      const rosterAfterGraduation = rosterWithSigned.filter(
        (id) => !graduatingIds.includes(id),
      );

      return {
        id: uni.id,
        changes: {
          roster: rosterAfterGraduation,
          signedPlayers: [],
          watchlist: [],
          stats: {
            ...uni.stats,
            [newSeason]: createEmptyTeamSeasonStats(newSeason),
          },
        },
      };
    });
    dispatch(updateUniversities(uniUpdates));

    // ── 5. New schedule ───────────────────────────────────────────────────
    const freshUniversities = selectAllUniversities(store.getState());
    const newSchedule = generateLeagueSchedules(freshUniversities);
    dispatch(setSchedule(newSchedule));
    dispatch(setCurrentWeek(1));

    // ── 6. Increment user season ──────────────────────────────────────────
    const updatedUser = { ...user, currentSeason: newSeason };
    await window.api.saveGame(updatedUser);
    loadUser(updatedUser);

    // ── 7. Save everything ────────────────────────────────────────────────
    await Promise.all([
      savePlayers(folderName),
      saveHighSchoolPlayers(folderName),
      saveUniversities(folderName),
      dispatch(saveScheduleThunk(folderName)),
    ]);

    navigate("/team");
  }, [dispatch, navigate, user, loadUser]);
}
