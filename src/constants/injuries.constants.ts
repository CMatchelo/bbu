import { InjuryType } from "../types/Injury";

export const INJURIES: InjuryType[] = [
  {
    id: "torn_ligament",
    minGames: 5,
    maxGames: 15,
    bodyParts: ["shoulder", "ankle", "knee"],
    weight: 8
  },
  {
    id: "fractured_bone",
    minGames: 10,
    maxGames: 25,
    bodyParts: ["hand", "arm", "leg", "foot", "ribs"],
    weight: 4
  },
  {
    id: "bruise",
    minGames: 1,
    maxGames: 3,
    bodyParts: ["back", "shoulder", "hips"],
    weight: 35
  },
  {
    id: "sprain",
    minGames: 2,
    maxGames: 6,
    bodyParts: ["ankle", "knee", "wrist"],
    weight: 25
  },
  {
    id: "strain",
    minGames: 2,
    maxGames: 5,
    bodyParts: ["hamstring", "quadriceps", "calf"],
    weight: 22
  },
  {
    id: "dislocation",
    minGames: 6,
    maxGames: 12,
    bodyParts: ["shoulder", "finger"],
    weight: 6
  },
  {
    id: "concussion",
    minGames: 5,
    maxGames: 10,
    bodyParts: ["head"],
    weight: 6
  },
  {
    id: "tendonitis",
    minGames: 3,
    maxGames: 8,
    bodyParts: ["knee", "wrist", "shoulder"],
    weight: 14
  },
  {
    id: "stress_fracture",
    minGames: 8,
    maxGames: 18,
    bodyParts: ["foot"],
    weight: 7
  },
  {
    id: "muscle_tear",
    minGames: 6,
    maxGames: 14,
    bodyParts: ["hamstring", "quadriceps", "calf"],
    weight: 10
  },
  {
    id: "back_spasm",
    minGames: 2,
    maxGames: 6,
    bodyParts: ["back"],
    weight: 18
  },
  {
    id: "herniated_disc",
    minGames: 10,
    maxGames: 22,
    bodyParts: ["back"],
    weight: 3
  },
  {
    id: "broken_nose",
    minGames: 3,
    maxGames: 7,
    bodyParts: ["head"],
    weight: 9
  },
  {
    id: "finger_sprain",
    minGames: 1,
    maxGames: 4,
    bodyParts: ["finger", "toe"],
    weight: 20
  },
  {
    id: "groin_strain",
    minGames: 4,
    maxGames: 9,
    bodyParts: ["groin"],
    weight: 12
  },
  {
    id: "calf_strain",
    minGames: 3,
    maxGames: 7,
    bodyParts: ["calf"],
    weight: 16
  },
  {
    id: "achilles_tendon_injury",
    minGames: 12,
    maxGames: 30,
    bodyParts: ["achilles"],
    weight: 2
  },
  {
    id: "knee_cartilage_injury",
    minGames: 8,
    maxGames: 20,
    bodyParts: ["knee"],
    weight: 5
  },
  {
    id: "shoulder_impingement",
    minGames: 4,
    maxGames: 10,
    bodyParts: ["shoulder"],
    weight: 13
  },
  {
    id: "hip_pointer",
    minGames: 2,
    maxGames: 5,
    bodyParts: ["hips"],
    weight: 15
  },
];
