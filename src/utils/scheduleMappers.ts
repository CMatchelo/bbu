import { ScheduleSave, ScheduleState } from "../types/ScheduleState";

export function scheduleStateToSave(state: ScheduleState): ScheduleSave {
  return {
    currentRound: state.currentRound,
    matches: Object.values(state.matchesById),
  };
}