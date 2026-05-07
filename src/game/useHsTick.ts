import { useCallback } from "react";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { store } from "../store";
import { updateHighSchoolPlayers, updateUniversities } from "../store/slices/dataSlice";
import { incrementWeek } from "../store/slices/scheduleSlice";
import {
  selectAllHighSchoolPlayers,
  selectAllUniversities,
  selectAllPlayers,
} from "../selectors/data.selectors";
import { useUser } from "../Context/UserContext";
import { calcAllSkillRanges } from "../utils/createPlayer";
import { CalculateHSGrades } from "./educationFunctions";
import { runCpuScouting, runCpuSigning } from "./cpuScouting";
import { saveHighSchoolPlayers, saveUniversities } from "../utils/saveGame";
import { Skill } from "../types/Skill";

export function useHsTick() {
  const dispatch = useAppDispatch();
  const { user } = useUser();

  return useCallback(async () => {
    if (!user) return;
    const folderName = `${user.name}_${user.id}`;

    // Increment week first, same as a real game save
    const weekBefore = store.getState().schedule.currentWeek;
    dispatch(incrementWeek());
    const newWeek = weekBefore + 1;

    // Scouting knowledge + skill reveal
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
    if (scoutedUpdates.length > 0) dispatch(updateHighSchoolPlayers(scoutedUpdates));

    // Grades
    const hsAfterScout = selectAllHighSchoolPlayers(store.getState());
    if (hsAfterScout.length > 0) {
      dispatch(updateHighSchoolPlayers(CalculateHSGrades(hsAfterScout)));
    }

    // CPU scouting: every 4 weeks
    if (newWeek % 4 === 0) {
      const hs = selectAllHighSchoolPlayers(store.getState());
      const unis = selectAllUniversities(store.getState());
      const players = selectAllPlayers(store.getState());
      const { playerUpdates: sp, uniUpdates: su } = runCpuScouting(
        unis, hs, players, user.currentUniversity.id,
      );
      if (sp.length > 0) dispatch(updateHighSchoolPlayers(sp));
      if (su.length > 0) dispatch(updateUniversities(su));
    }

    // CPU signing: every 10 weeks
    if (newWeek % 10 === 0) {
      const hs = selectAllHighSchoolPlayers(store.getState());
      const unis = selectAllUniversities(store.getState());
      const players = selectAllPlayers(store.getState());
      const { playerUpdates: sp, uniUpdates: su } = runCpuSigning(
        unis, hs, players, user.currentUniversity.id,
      );
      if (sp.length > 0) dispatch(updateHighSchoolPlayers(sp));
      if (su.length > 0) dispatch(updateUniversities(su));
    }

    await saveHighSchoolPlayers(folderName);
    await saveUniversities(folderName);
  }, [dispatch, user]);
}
