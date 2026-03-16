import { Match } from "../types/Match";
import { University } from "../types/University";

type Streak = {
  last: "home" | "away" | null;
  count: number;
};

export function GenerateSchedule(universities: University[], championship: string): Match[] {
  if (universities.length % 2 !== 0) {
    throw new Error("Number of teams must be even");
  }

  const weeksCount = universities.length - 1;
  const half = universities.length / 2;

  const streaks = new Map<string, Streak>();
  universities.forEach((u) => streaks.set(u.id, { last: null, count: 0 }));

  const baseWeeks: Match[][] = [];

  for (let r = 0; r < weeksCount; r++) {
    const matches: Match[] = [];

    for (let i = 0; i < half; i++) {
      let home = universities[i];
      let away = universities[universities.length - 1 - i];

      // balance here
      const balanced = balanceHomeAway(home, away, streaks);
      home = balanced.home;
      away = balanced.away;

      matches.push({
        id: crypto.randomUUID(),
        championship,
        home: home.id,
        away: away.id,
        played: false,
        week: r + 1,
      });

      updateStreak(streaks.get(home.id)!, "home");
      updateStreak(streaks.get(away.id)!, "away");
    }

    baseWeeks.push(matches);

    // rotate teams
    const fixed = universities[0];
    const rest = universities.slice(1);
    rest.unshift(rest.pop()!);
    universities.splice(0, universities.length, fixed, ...rest);
  }

  // Expand to 4 legs (same logic as before)
  const schedule: Match[] = [];
  const total = weeksCount;

  baseWeeks.forEach((r) => schedule.push(...r));
  baseWeeks.forEach((r, i) =>
    r.forEach((m) =>
      schedule.push({
        id: crypto.randomUUID(),
        championship,
        home: m.away,
        away: m.home,
        played: false,
        week: total + i + 1,
      })
    )
  );
  baseWeeks.forEach((r, i) =>
    r.forEach((m) =>
      schedule.push({
        ...m,
        id: crypto.randomUUID(),
        week: total * 2 + i + 1,
      })
    )
  );
  baseWeeks.forEach((r, i) =>
    r.forEach((m) =>
      schedule.push({
        id: crypto.randomUUID(),
        championship,
        home: m.away,
        away: m.home,
        played: false,
        week: total * 3 + i + 1,
      })
    )
  );

  return schedule;
}

function balanceHomeAway(
  home: University,
  away: University,
  streaks: Map<string, Streak>
): { home: University; away: University } {
  const h = streaks.get(home.id)!;
  const a = streaks.get(away.id)!;

  // Prefer giving home to the one coming from away games
  if (h.last === "home" && a.last === "away") {
    return { home: away, away: home };
  }

  // Prefer giving home to the one with longer streak
  if (h.count > a.count) {
    return { home: away, away: home };
  }

  return { home, away };
}

function updateStreak(streak: Streak, current: "home" | "away") {
  if (streak.last === current) {
    streak.count++;
  } else {
    streak.last = current;
    streak.count = 1;
  }
}