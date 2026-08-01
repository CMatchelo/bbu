import { Position } from "../../../types/Player";

export interface CourtSlotDefinition {
  position: Position;
  x: number;
  y: number;
}

export const COURT_SLOTS: CourtSlotDefinition[] = [
  { position: "PG", x: 50, y: 28 },
  { position: "SF", x: 22.4, y: 37.4 },
  { position: "SG", x: 77.8, y: 37.5 },
  { position: "PF", x: 73.3, y: 56.2 },
  { position: "C", x: 50, y: 67 },
];
