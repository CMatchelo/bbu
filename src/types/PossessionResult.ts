import { Player } from "./Player";
import { PlayType } from "./PlayType";

export type PossessionResult = {
  result: string;
  
  shotType: PlayType;
  selectedPlayer: Player;

  assistBy?: Player;

  turnoverBy?: Player;
  stealedBy?: Player;

  success: boolean;
  points: number;

  reboundWonBy?: string;
  reboundWinnerPlayer?: Player;

  blockBy?: Player;

  log: string;
};
