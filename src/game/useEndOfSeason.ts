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
import { setSchedule, setCurrentWeek, saveScheduleThunk, updateLeagueStandingsLeaders } from "../store/slices/scheduleSlice";
import { generateLeagueSchedules } from "../utils/managerSchedule";
import { generateHighSchoolPlayers, convertHSPlayerToPlayer, createPlayer } from "../utils/createPlayer";
import { createEmptyPlayerSeasonStats, createEmptyTeamSeasonStats } from "../utils/createEmptySeasonStats";
import { savePlayers, saveUniversities, saveHighSchoolPlayers, saveGraduatedPlayers, saveLeagueStandings } from "../utils/saveGame";
import { rand } from "../utils/mathFunc";
import { StatLeader } from "../types/LeagueStandings";
import { Position } from "../types/Player";

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

    // ── 5. Fill universities to 3 players per position ───────────────────
    const POSITIONS: Position[] = ["PG", "SG", "SF", "PF", "C"];
    const allPlayersForFill = selectAllPlayers(store.getState());
    const universitiesForFill = selectAllUniversities(store.getState());
    const fillPlayers = universitiesForFill.flatMap((uni) => {
      if (uni.id === user.currentUniversity.id) return [];
      return POSITIONS.flatMap((pos) => {
        const count = allPlayersForFill.filter(
          (p) => p.currentUniversity === uni.id && p.inCourtPosition === pos,
        ).length;
        const missing = Math.max(0, 3 - count);
        return Array.from({ length: missing }, () =>
          createPlayer(uni, pos, 2, user.currentUniversity.id, false, true, false, newSeason),
        );
      });
    });
    if (fillPlayers.length > 0) {
      dispatch(addPlayers(fillPlayers));
      const fillByUni: Record<string, string[]> = {};
      for (const p of fillPlayers) {
        if (!fillByUni[p.currentUniversity]) fillByUni[p.currentUniversity] = [];
        fillByUni[p.currentUniversity].push(p.id);
      }
      dispatch(
        updateUniversities(
          universitiesForFill.map((uni) => ({
            id: uni.id,
            changes: {
              roster: [
                ...(uni.roster ?? []),
                ...(fillByUni[uni.id] ?? []),
              ],
            },
          })),
        ),
      );
    }

    // ── 6. Compute and persist stat leaders ───────────────────────────────
    const allPlayersForLeaders = selectAllPlayers(store.getState());
    const currentSeason = user.currentSeason;
    function computeLeader(
      key: "points" | "assists" | "rebounds" | "tpm" | "steals",
    ): StatLeader | null {
      let best: StatLeader | null = null;
      for (const p of allPlayersForLeaders) {
        const s = p.stats[currentSeason];
        if (!s || s.matches === 0) continue;
        const value = parseFloat((s[key] / s.matches).toFixed(1));
        if (!best || value > best.value) {
          best = { id: p.id, firstName: p.firstName, lastName: p.lastName, universityId: p.currentUniversity, value };
        }
      }
      return best;
    }
    dispatch(
      updateLeagueStandingsLeaders({
        year: currentSeason,
        leaders_points: computeLeader("points"),
        leaders_assists: computeLeader("assists"),
        leaders_rebounds: computeLeader("rebounds"),
        leaders_tpm: computeLeader("tpm"),
        leaders_steals: computeLeader("steals"),
      }),
    );

    await saveLeagueStandings(folderName, store.getState().schedule.leagueStandingsHistory);

    // ── 7. New schedule ───────────────────────────────────────────────────
    const freshUniversities = selectAllUniversities(store.getState());
    const newSchedule = generateLeagueSchedules(freshUniversities);
    dispatch(setSchedule(newSchedule));
    dispatch(setCurrentWeek(1));

    // ── 8. Increment user season ──────────────────────────────────────────
    const updatedUser = { ...user, currentSeason: newSeason };
    await window.api.saveGame(updatedUser);
    loadUser(updatedUser);

    // ── 9. Save everything ────────────────────────────────────────────────
    await Promise.all([
      savePlayers(folderName),
      saveHighSchoolPlayers(folderName),
      saveUniversities(folderName),
      dispatch(saveScheduleThunk(folderName)),
    ]);

    navigate("/team", { state: { showDraft: true } });
  }, [dispatch, navigate, user, loadUser]);
}
