import { Player } from "./Player";

export type University = {
  id: string;
  city: string;
  state: string;
  name: string;
  nickname: string;
  //championships: CompletedTournament[]
  roster: string[];
  players?: Player[];
  playersOnCourt?: Player[];
  facilitiesLevel: number;
  academicPrestige: number;
  budget: number;
  fanbase: number;
  leagueId: string;
};

export type TeamSimInfo = {
  fanbase: number;
  playersOnCourt: Player[];
  offenseAvg: number;
  defenseAvg: number;
};

/* function calculateOffenseAvg(players: Player[]): number {
  return players.reduce((sum, p) => {
    return sum + (p.skills.pass + p.skills.dribble) / 2;
  }, 0);
} */
