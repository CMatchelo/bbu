
import { Match } from "../types/Match";
import { University } from "../types/University";

export function GenerateSchedule(universities: University[]): Match[] {
  const firstRound: Match[] = [];
  const secondRound: Match[] = [];
  let round1 = 1;
  let round2 = universities.length
  for (let i = 0; i < universities.length; i++) {
    for (let j = 0; j < universities.length; j++) {
      const home = universities[i]
      const away = universities[j]
      firstRound.push({
        id: crypto.randomUUID(),
        homeId: home.id,
        awayId: away.id,
        round: round1,
        played: false
      })

      secondRound.push({
        id: crypto.randomUUID(),
        homeId: away.id,
        awayId: home.id,
        round: round2,
        played: false
      })
      round1 += 1;
      round2 += 1;
    }
  }

  const matches =  [...firstRound, ...secondRound];

  const duplicatedGames = matches.map(m => ({
    ...m,
    id: crypto.randomUUID(),
    round: m.round + matches.length
  }))

  return [...matches, ...duplicatedGames]
}