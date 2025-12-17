import { Player } from "./Player";
import { PlayType } from "./PlayType";

export type PossessionResult = {
  result: string;
  
  shotType: PlayType;
  selectedPlayer: Player;

  assistBy?: Player;

  success: boolean;
  points: number;

  reboundWonBy?: string;
  reboundWinnerPlayer?: Player;

  log: string;
};
