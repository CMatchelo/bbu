import { DefensivePlaySystem, OffensivePlaySystem } from "../types/PlaySystem";
import { createDefaultDefensivePlaySystem, createDefaultOffensivePlaySystem } from "../utils/createPlaySystem";

const PLAY_WEIGHTS = [38, 25, 20, 10, 5, 2];

export function selectPlayForPossession(order: string[]): string {
  const r = Math.random() * 100;
  let cumulative = 0;
  for (let i = 0; i < order.length; i++) {
    cumulative += PLAY_WEIGHTS[i] ?? 0;
    if (r < cumulative) return order[i];
  }
  return order[order.length - 1];
}

export function getCpuOffensiveOrder(system: OffensivePlaySystem | undefined): (keyof OffensivePlaySystem)[] {
  const s = system ?? createDefaultOffensivePlaySystem();
  return (Object.entries(s) as [keyof OffensivePlaySystem, { familiarity: number }][])
    .sort((a, b) => b[1].familiarity - a[1].familiarity)
    .map(([key]) => key);
}

export function getCpuDefensiveOrder(system: DefensivePlaySystem | undefined): (keyof DefensivePlaySystem)[] {
  const s = system ?? createDefaultDefensivePlaySystem();
  return (Object.entries(s) as [keyof DefensivePlaySystem, { familiarity: number }][])
    .sort((a, b) => b[1].familiarity - a[1].familiarity)
    .map(([key]) => key);
}

export const MATCHUP_TABLE: Record<keyof OffensivePlaySystem, Record<keyof DefensivePlaySystem, number>> = {
  PickAndRoll:  { ManToMan: 0,  Zone: 2,  PerimeterPressure: -2, FullCourtPress: 2,  SwitchEverything: -4, PackedPaint: 2  },
  Motion:       { ManToMan: 2,  Zone: -2, PerimeterPressure: 0,  FullCourtPress: 2,  SwitchEverything: -2, PackedPaint: 2  },
  Isolation:    { ManToMan: 0,  Zone: 2,  PerimeterPressure: -2, FullCourtPress: -2, SwitchEverything: -4, PackedPaint: 2  },
  FiveOut:      { ManToMan: 2,  Zone: 4,  PerimeterPressure: -4, FullCourtPress: -2, SwitchEverything: -2, PackedPaint: 4  },
  PostUp:       { ManToMan: -2, Zone: 2,  PerimeterPressure: 4,  FullCourtPress: -2, SwitchEverything: 0,  PackedPaint: -4 },
  FastBreak:    { ManToMan: 2,  Zone: -2, PerimeterPressure: 0,  FullCourtPress: -4, SwitchEverything: 2,  PackedPaint: 2  },
};

export const SHOT_DIST: Record<keyof OffensivePlaySystem, [number, number, number]> = {
  PickAndRoll: [30, 25, 45],
  Motion:      [35, 30, 35],
  Isolation:   [20, 45, 35],
  FiveOut:     [55, 15, 30],
  PostUp:      [10, 35, 55],
  FastBreak:   [25, 10, 65],
};
