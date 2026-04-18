import type { Skill } from "./Skill";

type Stats = {
  matches: number;
  points: number;
  fgm: number;
  fga: number;
  tpm: number;
  tpa: number;
  turnovers: number;
  blocks: number;
  rebounds: number;
  assists: number;
  steals: number;
};

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
  stats: Stats;
};
