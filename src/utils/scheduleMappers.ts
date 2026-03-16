import { ScheduleSave, ScheduleState } from "../types/ScheduleState";

export function scheduleStateToSave(state: ScheduleState): ScheduleSave {
  return {
    currentWeek: state.currentWeek,
    matches: Object.values(state.matchesById),
  };
}