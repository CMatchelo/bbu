import { MatchNews } from "../types/MatchNews";
import { University } from "../types/University";
import { Player } from "../types/Player";
import { getTitleOccasionPair, getOutcomeOccasion } from "./newsOccasion";
import { titlesEN } from "../data/newsContent/titles.en";
import { titlesPT } from "../data/newsContent/titles.pt";
import { subtitlesEN } from "../data/newsContent/subtitles.en";
import { subtitlesPT } from "../data/newsContent/subtitles.pt";
import { matchTextsEN } from "../data/newsContent/matchTexts.en";
import { matchTextsPT } from "../data/newsContent/matchTexts.pt";
import { playerTextsEN } from "../data/newsContent/playerTexts.en";
import { playerTextsPT } from "../data/newsContent/playerTexts.pt";

function interpolate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? `{${key}}`));
}

function getTitles(lang: string) { return lang === "pt" ? titlesPT : titlesEN; }
function getSubtitles(lang: string) { return lang === "pt" ? subtitlesPT : subtitlesEN; }
function getMatchTexts(lang: string) { return lang === "pt" ? matchTextsPT : matchTextsEN; }
function getPlayerTexts(lang: string) { return lang === "pt" ? playerTextsPT : playerTextsEN; }

export function getNewsTitle(
  item: MatchNews,
  lang: string,
  universities: University[],
): string {
  const homeTeam = universities.find((u) => u.id === item.homeTeamId);
  const awayTeam = universities.find((u) => u.id === item.awayTeamId);
  const winner = universities.find((u) => u.id === item.winnerTeamId);
  const loser = universities.find((u) => u.id !== item.winnerTeamId && (u.id === item.homeTeamId || u.id === item.awayTeamId));
  const margin = Math.abs(item.homeScore - item.awayScore);

  const [pool0, pool1] = getTitleOccasionPair(item.homeScore, item.awayScore);
  const titles = getTitles(lang);
  const usePool1 = item.titleId >= 25;
  const pool = usePool1 ? pool1 : pool0;
  const idx = item.titleId % 25;
  const template = titles[pool]?.[idx] ?? "";

  return interpolate(template, {
    homeTeam: homeTeam?.nickname ?? "",
    awayTeam: awayTeam?.nickname ?? "",
    winner: winner?.nickname ?? "",
    loser: loser?.nickname ?? "",
    homeScore: item.homeScore,
    awayScore: item.awayScore,
    margin,
  });
}

export function getNewsSubtitle(
  item: MatchNews,
  lang: string,
  universities: University[],
): string {
  const homeTeam = universities.find((u) => u.id === item.homeTeamId);
  const awayTeam = universities.find((u) => u.id === item.awayTeamId);
  const winner = universities.find((u) => u.id === item.winnerTeamId);
  const loser = universities.find((u) => u.id !== item.winnerTeamId && (u.id === item.homeTeamId || u.id === item.awayTeamId));

  const occasion = getOutcomeOccasion(item.homeScore, item.awayScore);
  const subtitles = getSubtitles(lang);
  const template = subtitles[occasion]?.[item.subtitleId] ?? "";

  return interpolate(template, {
    homeTeam: homeTeam?.nickname ?? "",
    awayTeam: awayTeam?.nickname ?? "",
    winner: winner?.nickname ?? "",
    loser: loser?.nickname ?? "",
    homeScore: item.homeScore,
    awayScore: item.awayScore,
    margin: Math.abs(item.homeScore - item.awayScore),
  });
}

export function getNewsMatchText(
  item: MatchNews,
  lang: string,
  universities: University[],
): string {
  const homeTeam = universities.find((u) => u.id === item.homeTeamId);
  const awayTeam = universities.find((u) => u.id === item.awayTeamId);
  const winner = universities.find((u) => u.id === item.winnerTeamId);
  const loser = universities.find((u) => u.id !== item.winnerTeamId && (u.id === item.homeTeamId || u.id === item.awayTeamId));

  const occasion = getOutcomeOccasion(item.homeScore, item.awayScore);
  const texts = getMatchTexts(lang);
  const template = texts[occasion]?.[item.textId] ?? "";

  return interpolate(template, {
    homeTeam: homeTeam?.nickname ?? "",
    awayTeam: awayTeam?.nickname ?? "",
    winner: winner?.nickname ?? "",
    loser: loser?.nickname ?? "",
    homeScore: item.homeScore,
    awayScore: item.awayScore,
    margin: Math.abs(item.homeScore - item.awayScore),
  });
}

export function getNewsPlayerTexts(
  item: MatchNews,
  lang: string,
  players: Player[],
): { points: string; rebounds: string; assists: string; steals: string } {
  const pt = getPlayerTexts(lang);
  const find = (id: string) => players.find((p) => p.id === id);

  const ptsPlayer = find(item.mostPointsPlayerId);
  const rebPlayer = find(item.mostReboundsPlayerId);
  const astPlayer = find(item.mostAssistsPlayerId);
  const stlPlayer = find(item.mostStealsPlayerId);

  const build = (
    pool: string[],
    idx: number,
    player: Player | undefined,
    value: number,
  ) =>
    interpolate(pool[idx] ?? "", {
      playerName: player?.firstName ?? "",
      value,
    });

  return {
    points: build(pt.points, item.ptsTextId, ptsPlayer, item.mostPointsValue),
    rebounds: build(pt.rebounds, item.rebTextId, rebPlayer, item.mostReboundsValue),
    assists: build(pt.assists, item.astTextId, astPlayer, item.mostAssistsValue),
    steals: build(pt.steals, item.stlTextId, stlPlayer, item.mostStealsValue),
  };
}
