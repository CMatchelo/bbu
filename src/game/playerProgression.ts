import { Skill } from "../types/Skill";
import { Player } from "../types/Player";
import { PlayerGameStats } from "../types/PlayerGameStats";
import { University } from "../types/University";
import { clamp } from "./matchAuxFunctions";

const PROGRESSION = {
  basePerGame: 0.04,
  trainingBonus: 0.08,
  skillCap: 99,
};

export function progressPlayers(
  players: Player[],
  statsById: Record<string, PlayerGameStats>,
  universities: Record<string, University>,
): { id: string; changes: Partial<Skill> }[] {
  const updates: { id: string; changes: Partial<Skill> }[] = [];

  for (const player of players) {
    const stats = statsById[player.id];
    if (!stats || stats.minutes === 0) continue;
    console.log(stats);
    const university = universities[player.currentUniversity];
    if (!university) continue;
    console.log(university);
    const changes = progressPlayer(player, stats, university);
    console.log(
      `Jogador ${player.firstName} ${player.lastName} progrediu ${changes}`,
    );
    if (Object.keys(changes).length > 0) {
      updates.push({ id: player.id, changes });
    }
  }

  return updates;
}

function progressPlayer(
  player: Player,
  stats: PlayerGameStats,
  university: University,
): Partial<Skill> {
  const updatedSkills: Partial<Skill> = {};
  const skills = Object.keys(player.skills) as (keyof Skill)[];

  for (const skill of skills) {
    const current = player.skills[skill];
    const perfMult = getPerformanceMultiplier(skill, stats);
    const potMult = getPotentialMultiplier(current, player.potential);
    const uniMult = getUniversityMultiplier(skill, university);
    const isTraining = player.practicing === skill;
    const trainingBonus = isTraining ? PROGRESSION.trainingBonus * uniMult : 0;

    // Problema academico: grades < 3 perde o trainingBonus
    const academicPenalty = player.grades < 3;
    const effectiveBonus = academicPenalty ? 0 : trainingBonus;

    const gain =
      (PROGRESSION.basePerGame + effectiveBonus) * perfMult * potMult;

    const newValue = Math.min(current + gain, PROGRESSION.skillCap);

    if (newValue !== current) {
      updatedSkills[skill] = newValue;
    }
  }

  return updatedSkills;
}

function getPerformanceMultiplier(
  skill: keyof Skill,
  stats: PlayerGameStats,
): number {
  switch (skill) {
    case "layup":
    case "twopt": {
      const twoAttempts = stats.fga - stats.tpa;
      const twoMade = stats.fgm - stats.tpm;
      if (twoAttempts === 0) return 0.8;
      return clamp(0.5 + (twoMade / twoAttempts) * 2, 0.5, 1.5);
    }
    case "threept": {
      if (stats.tpa === 0) return 0.8;
      return clamp(0.5 + (stats.tpm / stats.tpa) * 2.5, 0.5, 1.5);
    }
    case "pass": {
      const assistBonus = Math.min(stats.assists * 0.08, 0.4);
      const turnoverPenalty = Math.min(stats.turnovers * 0.1, 0.4);
      return clamp(1 + assistBonus - turnoverPenalty, 0.5, 1.5);
    }
    case "ballHandling":
    case "speedWithBall": {
      const bonus = Math.min(stats.assists * 0.05, 0.2);
      const penalty = Math.min(stats.turnovers * 0.15, 0.5);
      return clamp(1 + bonus - penalty, 0.5, 1.5);
    }
    case "rebound":
      return clamp(0.8 + Math.min(stats.rebounds * 0.07, 0.4), 0.5, 1.5);
    case "defense":
      return clamp(
        0.8 + Math.min((stats.steals + stats.blocks) * 0.08, 0.4),
        0.5,
        1.5,
      );
    case "steal":
      return clamp(0.8 + Math.min(stats.steals * 0.15, 0.5), 0.5, 1.5);
    case "block":
      return clamp(0.8 + Math.min(stats.blocks * 0.2, 0.5), 0.5, 1.5);
    default:
      return 1.0;
  }
}

function getPotentialMultiplier(current: number, potential: number): number {
  const ratio = current / potential;
  if (ratio >= 1.0) return 0;
  if (ratio >= 0.9) return 0.25;
  if (ratio >= 0.75) return 0.6;
  return 1.0;
}

function getUniversityMultiplier(
  skill: keyof Skill,
  university: University,
): number {
  const courtSkills: (keyof Skill)[] = [
    "layup",
    "twopt",
    "threept",
    "pass",
    "ballHandling",
  ];
  const gymSkills: (keyof Skill)[] = [
    "speedWithBall",
    "rebound",
    "steal",
    "defense",
    "block",
  ];

  console.log(
    `University ${university.id} has a Court Level ${university.courtLevel} and a Gym Level ${university.gymLevel}`,
  );

  if (courtSkills.includes(skill)) return 0.8 + university.courtLevel * 0.08;
  if (gymSkills.includes(skill)) return 0.8 + university.gymLevel * 0.08;
  return 1.0;
}
