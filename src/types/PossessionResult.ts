import { Player } from "./Player";
import { PlayType } from "./PlayType";

export type PossessionResult = {
  result: string;
  
  shotType: PlayType;
  selectedPlayer: Player;

  assistBy?: Player;

  turnoverBy?: Player;
  stolenBy?: Player;

  success: boolean;
  points: number;

  reboundWinnerPlayer?: Player;

  blockBy?: Player;

  log: string;
};
