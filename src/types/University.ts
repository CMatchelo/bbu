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