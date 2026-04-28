export type InjuryType = {
  id: string; // chave pro i18n
  minGames: number; // base
  maxGames: number; // base
  bodyParts: BodyPartId[];
  weight: number;
};

export type BodyPartId =
  | "head"
  | "shoulder"
  | "back"
  | "ribs"
  | "arm"
  | "wrist"
  | "hand"
  | "finger"
  | "groin"
  | "hips"
  | "leg"
  | "hamstring"
  | "quadriceps"
  | "knee"
  | "ankle"
  | "foot"
  | "toe"
  | "calf"
  | "achilles"
  

export type PlayerInjury = {
  injuryId: string;
  bodyPart: BodyPartId;
  gamesRemaining: number;
};
