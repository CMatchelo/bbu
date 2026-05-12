import { DefensivePlaySystem, OffensivePlaySystem } from "../types/PlaySystem";
import { rand } from "./mathFunc";

export function createDefaultOffensivePlaySystem(): OffensivePlaySystem {
  return {
    PickAndRoll: { familiarity: rand(30, 60), practicingPoints: 2 },
    Motion: { familiarity: rand(30, 60), practicingPoints: 2 },
    Isolation: { familiarity: rand(30, 60), practicingPoints: 2 },
    FiveOut: { familiarity: rand(30, 60), practicingPoints: 2 },
    PostUp: { familiarity: rand(30, 60), practicingPoints: 2 },
    FastBreak: { familiarity: rand(30, 60), practicingPoints: 2 },
  };
}

export function createDefaultDefensivePlaySystem(): DefensivePlaySystem {
  return {
    ManToMan: { familiarity: rand(30, 60), practicingPoints: 2 },
    Zone: { familiarity: rand(30, 60), practicingPoints: 2 },
    PerimeterPressure: { familiarity: rand(30, 60), practicingPoints: 2 },
    FullCourtPress: { familiarity: rand(30, 60), practicingPoints: 2 },
    SwitchEverything: { familiarity: rand(30, 60), practicingPoints: 2 },
    PackedPaint: { familiarity: rand(30, 60), practicingPoints: 2 },
  };
}

export function familiarityDelta(practicingPoints: number): number {
  if (practicingPoints === 0) return -4;
  if (practicingPoints === 1) return -2;
  if (practicingPoints === 2) return 0;
  if (practicingPoints === 3) return 1;
  if (practicingPoints === 4) return 2;
  return 3;
}
