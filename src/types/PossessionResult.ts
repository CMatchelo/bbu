import { PlayType } from "./PlayType";

export type PossessionResult = {
  result: string;
  
  shotType: PlayType;
  selectedPlayerId?: string;

  success: boolean;
  points: number;

  reboundWonBy?: string;
  reboundWinnerPlayerId?: string;

  log: string;
};
