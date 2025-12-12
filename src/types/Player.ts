import type { Skill } from "./Skill";

export type Player = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;

  grades: number;
  inteligence: number;
  yearsInCollege: number;
  yearsToGraduate: number;
  course: string;
  currentUniversity: string;

  skills: Skill;
  inCourtPosition: "SG" | "PG" | "SF" | "PF" | "C";
  scholarship: boolean;
  potential: number;
  stamina: number;
  injuryProne: number;
};
