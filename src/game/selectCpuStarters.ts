import { Player } from "../types/Player";
import { Skill } from "../types/Skill";

type Position = Player["inCourtPosition"];

const POSITIONS: Position[] = ["PG", "SG", "SF", "PF", "C"];

export function selectCpuStarters(players: Player[]): Player[] {
  const starters: Player[] = [];

  for (const position of POSITIONS) {
    const candidates = players.filter(
      (p) => p.inCourtPosition === position
    );

    if (candidates.length === 0) {
      console.warn(`CPU has no players for position ${position}`);
      continue;
    }

    const bestPlayer = candidates.reduce((best, current) => {
      const bestScore = calculateSkillAverage(best.skills);
      const currentScore = calculateSkillAverage(current.skills);

      return currentScore > bestScore ? current : best;
    });

    starters.push(bestPlayer);
  }

  return starters;
}

function calculateSkillAverage(skills: Skill): number {
  const values = Object.values(skills);
  const total = values.reduce((sum, v) => sum + v, 0);
  return total / values.length;
}
