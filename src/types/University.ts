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
  courtLevel: 1 | 2 | 3 | 4 | 5;
  gymLevel: 1 | 2 | 3 | 4 | 5;
  medicalCenterLevel: 1 | 2 | 3 | 4 | 5;
  physioLevel: 1 | 2 | 3 | 4 | 5;
  educationSupportLevel: 1 | 2 | 3 | 4 | 5;
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
