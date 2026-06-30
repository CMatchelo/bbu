import { Position } from "../../../types/Player";

export interface CourtSlotDefinition {
  position: Position;
  x: number;
  y: number;
}

export const COURT_SLOTS: CourtSlotDefinition[] = [
  { position: "PG", x: 50, y: 28 },
  { position: "SF", x: 23, y: 38 },
  { position: "SG", x: 78, y: 38 },
  { position: "PF", x: 73, y: 56 },
  { position: "C", x: 50, y: 67 },
];
