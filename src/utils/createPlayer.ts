import { courses } from "../constants/courses.constants";
import { firtNames, lastNames } from "../constants/names.constants";
import { selectPlayersFromUniversity } from "../selectors/data.selectors";
import { store } from "../store";
import { Player, Position } from "../types/Player";
import { HighSchoolPlayer } from "../types/HighSchoolPlayer";
import { University } from "../types/University";
import { Skill } from "../types/Skill";
import { createEmptyPlayerSeasonStats } from "./createEmptySeasonStats";
import { clamp, rand, randomFloat } from "./mathFunc";

const SKILL_CAP = 80;

function getSkillRangeByRating(rating: 1 | 2 | 3 | 4 | 5): [number, number] {
  const ranges: Record<number, [number, number]> = {
    1: [44, 55],
    2: [49, 60],
    3: [53, 64],
    4: [58, 69],
    5: [64, 75],
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

export function calculatMaxMinGrade(realGrade: number) {
  const maxPotential = clamp(rand(realGrade, realGrade + 15), 48, 99);
  const minPotential = clamp(rand(realGrade - 15, realGrade), 48, 99);
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

export function calcSkillRange(
  realValue: number,
  playerKnowledge: number,
  prev?: { min: number; max: number },
): { min: number; max: number } {
  const knowledgeFactor = playerKnowledge / 100;
  const maxRange = rand(17, 23);
  const baseRange = maxRange * (1 - knowledgeFactor);
  const rangeVariance = baseRange * randomFloat(0.8, 1.2);
  const centerOffset = randomFloat(-rangeVariance * 0.3, rangeVariance * 0.3);
  const estimatedCenter = realValue + centerOffset;
  let min = Math.floor(estimatedCenter - rangeVariance / 2);
  let max = Math.ceil(estimatedCenter + rangeVariance / 2);
  min = clamp(min, 0, 99);
  max = clamp(max, 0, 99);
  if (min > max) [min, max] = [max, min];
  if (prev) {
    min = Math.max(min, prev.min);
    max = Math.min(max, prev.max);
    if (min > max) min = max;
  }
  return { min, max };
}

export function calcAllSkillRanges(
  skills: Skill,
  knowledge: number,
  prevMin?: Skill,
  prevMax?: Skill,
): { minSkills: Skill; maxSkills: Skill } {
  const keys = Object.keys(skills) as (keyof Skill)[];
  const minSkills = {} as Skill;
  const maxSkills = {} as Skill;
  for (const key of keys) {
    const prev = prevMin && prevMax ? { min: prevMin[key], max: prevMax[key] } : undefined;
    const { min, max } = calcSkillRange(skills[key], knowledge, prev);
    minSkills[key] = min;
    maxSkills[key] = max;
  }
  return { minSkills, maxSkills };
}

export function generateHighSchoolPlayers(): HighSchoolPlayer[] {
  const positions: Position[] = ["PG", "SG", "SF", "PF", "C"];
  const players: HighSchoolPlayer[] = [];

  for (const pos of positions) {
    for (let i = 0; i < 50; i++) {
      const firstName = firtNames[rand(0, firtNames.length - 1)];
      const lastName = lastNames[rand(0, lastNames.length - 1)];
      const rating = rand(1, 3) as 1 | 2 | 3;
      const skills = skillByPosition(pos, rating);
      const potential = rand(getSkillRangeByRating(rating)[1], 99);
      const { minPotential, maxPotential } = calculatMaxMinGrade(potential);
      const { minSkills, maxSkills } = calcAllSkillRanges(skills, 1);
      const skillKeys = Object.keys(skills) as (keyof Skill)[];
      const skillsRevealed = Object.fromEntries(
        skillKeys.map((k) => [k, false]),
      ) as Record<keyof Skill, boolean>;

      players.push({
        id: crypto.randomUUID(),
        firstName,
        lastName,
        age: rand(17, 18),
        grades: rand(70, 100),
        tutoring: false,
        skills,
        inCourtPosition: pos,
        universityInterest: [],
        potential,
        minPotential,
        maxPotential,
        intelligence: rand(0, 100),
        injuryProne: rand(0, 50),
        active: true,
        scouted: false,
        playerKnowledge: 1,
        minSkills,
        maxSkills,
        skillsRevealed,
        signedWith: null,
      });
    }
  }

  return players;
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
