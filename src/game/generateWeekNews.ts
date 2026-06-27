import { MatchNews } from "../types/MatchNews";
import { PlayerGameStats } from "../types/PlayerGameStats";

const rand25 = () => Math.floor(Math.random() * 25);

type MatchInput = {
  matchId: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  playerStats: Record<string, PlayerGameStats>;
};

function findTopPlayer(
  playerStats: Record<string, PlayerGameStats>,
  stat: keyof Pick<PlayerGameStats, "points" | "rebounds" | "assists" | "steals">,
): { id: string; value: number } {
  const players = Object.values(playerStats);
  let max = -1;
  let top: PlayerGameStats[] = [];

  for (const p of players) {
    const val = p[stat] as number;
    if (val > max) {
      max = val;
      top = [p];
    } else if (val === max) {
      top.push(p);
    }
  }

  const winner = top[Math.floor(Math.random() * top.length)];
  return { id: winner?.id ?? "", value: max };
}

export function generateWeekNews(
  matches: MatchInput[],
  week: number,
  year: number,
): MatchNews[] {
  return matches.map((match) => {
    const pts = findTopPlayer(match.playerStats, "points");
    const reb = findTopPlayer(match.playerStats, "rebounds");
    const ast = findTopPlayer(match.playerStats, "assists");
    const stl = findTopPlayer(match.playerStats, "steals");

    return {
      id: crypto.randomUUID(),
      matchId: match.matchId,
      week,
      year,
      homeTeamId: match.homeTeamId,
      awayTeamId: match.awayTeamId,
      homeScore: match.homeScore,
      awayScore: match.awayScore,
      winnerTeamId: match.homeScore > match.awayScore ? match.homeTeamId : match.awayTeamId,
      mostPointsPlayerId: pts.id,
      mostPointsValue: pts.value,
      mostReboundsPlayerId: reb.id,
      mostReboundsValue: reb.value,
      mostAssistsPlayerId: ast.id,
      mostAssistsValue: ast.value,
      mostStealsPlayerId: stl.id,
      mostStealsValue: stl.value,
      // titleId 0–24 = first occasion pool, 25–49 = second occasion pool
      titleId: Math.floor(Math.random() * 2) * 25 + rand25(),
      subtitleId: rand25(),
      textId: rand25(),
      ptsTextId: rand25(),
      rebTextId: rand25(),
      astTextId: rand25(),
      stlTextId: rand25(),
    };
  });
}
