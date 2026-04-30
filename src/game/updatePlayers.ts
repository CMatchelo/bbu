import { Player } from "../types/Player";
import { CalculateGrades } from "./educationFunctions";
import { ApplyInjuries } from "./injuryGenerator";

export function updatePlayersAttributes(players: Player[]) {
  const injuries = ApplyInjuries(players);
  const grades = CalculateGrades(players);

  return mergeUpdates(injuries, grades);
}

function mergeUpdates(
  ...updateArrays: { id: string; changes: Partial<Player> }[][]
): { id: string; changes: Partial<Player> }[] {
  const map = new Map<string, Partial<Player>>();

  for (const updates of updateArrays) {
    for (const { id, changes } of updates) {
      map.set(id, { ...map.get(id), ...changes });
    }
  }

  return Array.from(map.entries()).map(([id, changes]) => ({ id, changes }));
}