import { number } from "react-i18next/icu.macro";
import { courses } from "../constants/courses.constants";
import { firtNames, lastNames } from "../constants/names.constants";
import { teamOverall } from "../game/skillsAverage";
import { selectPlayersFromUniversity } from "../selectors/data.selectors";
import { store } from "../store";
import { Player, Position } from "../types/Player";
import { University } from "../types/University";
import { createEmptyPlayerSeasonStats } from "./createEmptySeasonStats";
import { clamp, rand } from "./mathFunc";

const SKILL_CAP = 80;
let idCounter = 1;

function getSkillRangeByRating(rating: 1 | 2 | 3 | 4 | 5): [number, number] {
  const ranges: Record<number, [number, number]> = {
    1: [48, 58],
    2: [52, 62],
    3: [56, 66],
    4: [60, 70],
    5: [64, 74],
  };
  return ranges[rating];
}

function getRatingByDifficulty(
  isPlayerUni: boolean,
  difficulty: number,
): 1 | 2 | 3 | 4 | 5 {
  if (!isPlayerUni) {
    return rand(1, 5) as 1 | 2 | 3 | 4 | 5;
  }

  if (difficulty === 1) return rand(3, 5) as 1 | 2 | 3 | 4 | 5;
  if (difficulty === 2) return rand(1, 5) as 1 | 2 | 3 | 4 | 5;
  if (difficulty === 3) return rand(1, 3) as 1 | 2 | 3 | 4 | 5;

  return rand(1, 5) as 1 | 2 | 3 | 4 | 5;
}

function skillByPosition(pos: Position, rating: 1 | 2 | 3 | 4 | 5) {
  const [min, max] = getSkillRangeByRating(rating);
  const base = {
    layup: rand(min, max),
    twopt: rand(min, max),
    threept: rand(min, max),
    pass: rand(min, max),
    ballHandling: rand(min, max),
    speedWithBall: rand(min, max),
    rebound: rand(min, max),
    defense: rand(min, max),
    steal: rand(min, max),
    block: rand(min, max),
  };

  const bonuses: Record<Position, Partial<typeof base>> = {
    PG: { pass: 6, ballHandling: 7, speedWithBall: 5 },
    SG: { threept: 7, twopt: 5, speedWithBall: 3 },
    SF: { defense: 5, rebound: 4, twopt: 3 },
    PF: { rebound: 7, block: 5, defense: 4 },
    C: { block: 9, rebound: 9, layup: 4, threept: -3 },
  };

  for (const [skill, bonus] of Object.entries(bonuses[pos])) {
    const key = skill as keyof typeof base;
    base[key] = clamp(base[key] + (bonus ?? 0), 0, SKILL_CAP);
  }

  return base;
}

function calculatMaxMinGrade(realGrade: number) {
  const maxPotential = rand(realGrade, realGrade + 15);
  const minPotential = rand(realGrade - 15, realGrade);
  return { minPotential, maxPotential };
}

export function createPlayer(
  university: University,
  pos: Position,
  difficulty: number,
  playerUni: string,
  isEmergency: boolean,
  isDraft: boolean,
  isNewGame: boolean,
): Player {
  const firstName = firtNames[rand(0, firtNames.length - 1)];
  const lastName = lastNames[rand(0, lastNames.length - 1)];

  const isPlayerUni = university.id === playerUni;
  const rating = isEmergency
    ? 1
    : isDraft
      ? (rand(1, 3) as 1 | 2 | 3)
      : getRatingByDifficulty(isPlayerUni, difficulty);

  // Calculate how long already in the college
  const minStart = isNewGame ? 2 : 1;
  const yearsInCollege = isDraft ? 1 : rand(minStart, 4);
  const yearsToGraduate = isDraft
    ? rand(4, 5)
    : clamp(4 - yearsInCollege + rand(0, 1), 1, 4);

  // Calculate min and max range for the skills
  const [minRange, maxRange] = getSkillRangeByRating(rating);

  // Calculate player potential, as well as max and min potential that will be displayed to user
  const potential = isEmergency ? rand(minRange, maxRange) : rand(maxRange, 99);
  const { minPotential, maxPotential } = calculatMaxMinGrade(potential);
  return {
    id: crypto.randomUUID(),
    firstName,
    lastName,
    age: rand(18, 23),

    grades: rand(70, 100),
    yearsInCollege,
    yearsToGraduate,
    course: courses[rand(0, courses.length - 1)],
    currentUniversity: university.id,
    tutoring: false,

    skills: skillByPosition(pos, rating),
    inCourtPosition: pos,
    scholarship: Math.random() > 0.4,
    potential,
    minPotential,
    maxPotential,
    stamina: rand(60, 90),
    intelligence: rand(0, 100),

    injuryProne: rand(0, 50),
    injured: false,
    injury: null,

    active: true,
    available: true,

    practicing: null,
    stats: {
      [2026]: createEmptyPlayerSeasonStats(2026),
    },
  };
}

export function generateAllPlayers(
  universities: University[],
  difficulty: number,
  playerUni: string,
) {
  const players: Player[] = [];

  universities.forEach((uni) => {
    const pos: Position[] = ["C", "PF", "SF", "SG", "PG"];

    const n1 = rand(0, pos.length - 1);
    const p1 = pos.splice(n1, 1)[0];

    const n2 = rand(0, pos.length - 1);
    const p2 = pos.splice(n2, 1)[0];

    const dist: Position[] = [
      "PG",
      "PG",
      "SG",
      "SG",
      "SF",
      "SF",
      "PF",
      "PF",
      "C",
      "C",
      p1,
      p2,
    ];

    dist.forEach((pos) => {
      players.push(
        createPlayer(uni, pos, difficulty, playerUni, false, false, true),
      );
    });
  });

  return players;
}

export function generateDraftPlayers(
  universities: University[],
  playerUni: string,
) {
  const playerOptions: Player[] = [];
  const cpuPlayers: Player[] = [];

  universities.forEach((uni) => {
    const uniPlayers: Player[] = [];
    const dist: Position[] = [
      "PG",
      "PG",
      "SG",
      "SG",
      "SF",
      "SF",
      "PF",
      "PF",
      "C",
      "C",
    ];

    dist.forEach((pos) => {
      const newPlayer = createPlayer(
        uni,
        pos,
        2,
        playerUni,
        false,
        true,
        false,
      );
      if (uni.id === playerUni) {
        playerOptions.push(newPlayer);
      } else {
        uniPlayers.push(newPlayer);
      }
    });
    if (uni.id !== playerUni) {
      const selected = cpuSelectPlayer(uniPlayers, uni.id);
      cpuPlayers.push(...selected);
    }
  });
  return { playerOptions, cpuPlayers };
}

function cpuSelectPlayer(players: Player[], uniId: string): Player[] {
  const currentSquad = selectPlayersFromUniversity(store.getState(), uniId);
  const selected: Player[] = [];
  const positions: Position[] = ["PG", "SG", "SF", "PF", "C"];

  for (const pos of positions) {
    const currentCount = currentSquad.filter(
      (p) => p.inCourtPosition === pos,
    ).length;
    const candidates = players.filter((p) => p.inCourtPosition === pos);

    if (currentCount >= 3) continue;

    if (currentCount <= 1) {
      selected.push(...candidates);
    } else {
      const best = candidates.reduce((a, b) =>
        a.potential >= b.potential ? a : b,
      );
      selected.push(best);
    }
  }

  return selected;
}

export function addDraftedPlayers(
  draftedPlayers: Player[],
  universities: University[],
): { players: Player[]; universities: University[] } {
  const playersByUni: Record<string, string[]> = {};

  for (const p of draftedPlayers) {
    if (!playersByUni[p.currentUniversity])
      playersByUni[p.currentUniversity] = [];
    playersByUni[p.currentUniversity].push(p.id);
  }

  const updatedUniversities = universities.map((uni) => ({
    ...uni,
    roster: [...uni.roster, ...(playersByUni[uni.id] || [])],
  }));

  return { players: draftedPlayers, universities: updatedUniversities };
}
