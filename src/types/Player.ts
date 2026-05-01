import { PlayerInjury } from "./Injury";
import { PlayerSeasonStats } from "./SeasonStats";
import type { Skill } from "./Skill";



export type Position = "SG" | "PG" | "SF" | "PF" | "C"

export type Player = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;

  grades: number;
  yearsInCollege: number;
  yearsToGraduate: number;
  course: string;
  currentUniversity: string;
  tutoring: boolean;

  skills: Skill;
  inCourtPosition: Position;
  scholarship: boolean;
  potential: number;
  stamina: number;
  intelligence: number;

  injuryProne: number;
  injured: boolean;
  injury: PlayerInjury | null;
  
  active: boolean;
  available: boolean;

  practicing: keyof Skill | null;
  stats: Record<number, PlayerSeasonStats>;
};
