import { firtNames, lastNames } from "../constants/names.constants";
import { CourseId } from "../types/Courses";
import { Player, Position } from "../types/Player";
import { University } from "../types/University";
import { createEmptyPlayerSeasonStats } from "./createEmptySeasonStats";

const SKILL_CAP = 80;
let idCounter = 1;

const courses: CourseId[] = [
  "computer_science",
  "software_engineering",
  "information_systems",
  "data_science",
  "artificial_intelligence",
  "cyber_security",
  "game_development",
  "computer_engineering",
  "electrical_engineering",
  "mechanical_engineering",
  "civil_engineering",
  "architecture",
  "business_administration",
  "economics",
  "accounting",
  "marketing",
  "law",
  "medicine",
  "nursing",
  "pharmacy",
  "psychology",
  "biology",
  "physics",
  "chemistry",
  "mathematics",
  "statistics",
  "journalism",
  "graphic_design",
  "education",
  "international_relations",
];

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

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

export function createPlayer(university: University, pos: Position): Player {
  const firstName = firtNames[rand(0, firtNames.length - 1)];
  const lastName = lastNames[rand(0, lastNames.length - 1)];
  const rating = rand(1, 5) as 1 | 2 | 3 | 4 | 5;

  const yearsInCollege = rand(1, 4);
  const yearsToGraduate = clamp(4 - yearsInCollege + rand(0, 1), 1, 4);
  const [min, max] = getSkillRangeByRating(rating)
  return {
    id: `p${String(idCounter++).padStart(5, "0")}`,
    firstName,
    lastName,
    age: rand(18, 23),

    grades: rand(60, 100),
    yearsInCollege,
    yearsToGraduate,
    course: courses[rand(0, courses.length - 1)],
    currentUniversity: university.id,

    skills: skillByPosition(pos, rating),
    inCourtPosition: pos,
    scholarship: Math.random() > 0.4,
    potential: rand(max, 99),
    stamina: rand(60, 90),
    injuryProne: rand(1, 25),
    active: true,
    injured: false,
    practicing: null,
    stats: {
      [2026]: createEmptyPlayerSeasonStats(2026),
    },
  };
}

export function generateAllPlayers(universities: University[]) {
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
      players.push(createPlayer(uni, pos));
    });
  });

  return players;
}

