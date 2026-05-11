import { LeagueStandings } from "./LeagueStandings";
import { Match } from "./Match";

export type ScheduleSave = {
  currentWeek: number;
  matches: Match[];
};

export type ScheduleState = {
  currentWeek: number;
  matchesById: Record<string, Match>;
  matchesByWeek: Record<number, string[]>;
};

export interface ExtendedScheduleState extends ScheduleState {
  leagueStandingsHistory: LeagueStandings[];
}