export type PossessionResult = {
  possessionId: number;
  attackingTeamId: string;
  defendingTeamId: string;

  shotType: "three" | "two" | "layup" | "turnover";
  selectedPlayerId?: string;

  success: boolean;
  points: number;

  reboundWonBy?: string;
  reboundWinnerPlayerId?: string;

  log: string;
};
