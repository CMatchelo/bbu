import type { Skill } from "./Skill";
import type { Position } from "./Player";

export type HighSchoolPlayer = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;

  grades: number;
  tutoring: boolean;

  skills: Skill;
  inCourtPosition: Position;
  scholarshipOffers: string[];
  potential: number;
  minPotential: number;
  maxPotential: number;
  intelligence: number;
  injuryProne: number;

  active: boolean;

  scouted: boolean;
  playerKnowledge: number;
  minSkills: Skill;
  maxSkills: Skill;
  skillsRevealed: Record<keyof Skill, boolean>;
  committedWith: string | null;
};
