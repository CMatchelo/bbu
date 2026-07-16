import { MatchNews, NewsComment } from "../types/MatchNews";
import { PlayerGameStats } from "../types/PlayerGameStats";
import { getTitleOccasionPair } from "../utils/newsOccasion";
import { reporterProfiles } from "../data/newsComments/reporterProfiles";
import { fanUsernames } from "../data/newsComments/fanUsernames";
import { rand as randInt } from "../utils/mathFunc";

const rand25 = () => randInt(0, 24);
const randPick = <T,>(arr: T[]) => arr[randInt(0, arr.length - 1)];

const PLAYER_STATS: ("points" | "rebounds" | "assists" | "steals")[] = [
  "points",
  "rebounds",
  "assists",
  "steals",
];

type MatchInput = {
  matchId: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  playerStats: Record<string, PlayerGameStats>;
};

function generateComments(homeScore: number, awayScore: number): NewsComment[] {
  const [occasionA, occasionB] = getTitleOccasionPair(homeScore, awayScore);
  const count = randInt(1, 5);
  const usedUsernames = new Set<string>();
  const usedSources = new Set<string>();
  const comments: NewsComment[] = [];

  let attempts = 0;
  while (comments.length < count && attempts < 50) {
    attempts++;
    const username = randPick(fanUsernames);
    if (usedUsernames.has(username)) continue;

    const source: NewsComment["source"] =
      randInt(0, 1) === 0
        ? { kind: "match", occasion: randPick([occasionA, occasionB]), index: rand25() }
        : { kind: "player", stat: randPick(PLAYER_STATS), index: rand25() };

    const sourceKey =
      source.kind === "match"
        ? `match:${source.occasion}:${source.index}`
        : `player:${source.stat}:${source.index}`;
    if (usedSources.has(sourceKey)) continue;

    usedUsernames.add(username);
    usedSources.add(sourceKey);
    comments.push({ username, likes: randInt(0, 150), source });
  }

  return comments;
}

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

  const winner = top[randInt(0, top.length - 1)];
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
      titleId: randInt(0, 1) * 25 + rand25(),
      subtitleId: rand25(),
      textId: rand25(),
      ptsTextId: rand25(),
      rebTextId: rand25(),
      astTextId: rand25(),
      stlTextId: rand25(),
      reporterHandle: randPick(reporterProfiles),
      likes: randInt(5, 900),
      comments: generateComments(match.homeScore, match.awayScore),
    };
  });
}
