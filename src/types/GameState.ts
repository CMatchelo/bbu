import { Player } from "./Player";
import { PlayerGameStats } from "./PlayerGameStats";
import { PlayLog } from "./PlayLog";
import { TeamGameStats } from "./TeamGameStats";

export type GameState = {
  quarter: number;
  timeLeft: number;
  isGameOver: boolean;
  currentPoss: string;

  homeStats: TeamGameStats;
  awayStats: TeamGameStats;

  playerStats: Record<string, PlayerGameStats>;

  homeLineup: Player[];
  awayLineup: Player[];

  homeTimeouts: number;
  homeTimeoutsOnQrt: number;

  awayTimeouts: number;
  awayTimeoutsOnQrt: number;

  logPlays?: PlayLog[];
};