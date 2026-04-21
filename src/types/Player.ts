import { SeasonStats } from "./SeasonStats";
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

  skills: Skill;
  inCourtPosition: Position;
  scholarship: boolean;
  potential: number;
  stamina: number;
  injuryProne: number;
  active: boolean;
  injured: boolean;
  stats: Record<number, SeasonStats>;
};
