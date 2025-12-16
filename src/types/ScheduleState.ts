import { Match } from "./Match";

export type ScheduleSave = {
  currentRound: number;
  matches: Match[];
};

export type ScheduleState = {
  currentRound: number;
  matchesById: Record<string, Match>;
  matchesByRound: Record<number, string[]>;
};