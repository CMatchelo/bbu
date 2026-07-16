import { MatchNews, NewsComment } from "../types/MatchNews";
import { University } from "../types/University";
import { Player } from "../types/Player";
import { interpolate, getNewsTitle, getNewsSubtitle } from "./newsContent";
import { commentsEn } from "../data/newsComments/matchsComments.en";
import { commentsPt } from "../data/newsComments/matchsComments.pt";
import { playerCommentsEn } from "../data/newsComments/playerComments.en";
import { playerCommentsPt } from "../data/newsComments/playerComments.pt";

function getMatchComments(lang: string) { return lang === "pt" ? commentsPt : commentsEn; }
function getPlayerComments(lang: string) { return lang === "pt" ? playerCommentsPt : playerCommentsEn; }

function toHashtag(name: string): string {
  return name.replace(/[^a-zA-Z0-9]/g, "");
}

export function getNewsPostText(
  item: MatchNews,
  lang: string,
  universities: University[],
): string {
  const homeTeam = universities.find((u) => u.id === item.homeTeamId);
  const awayTeam = universities.find((u) => u.id === item.awayTeamId);
  const title = getNewsTitle(item, lang, universities);
  const subtitle = getNewsSubtitle(item, lang, universities);

  return `${title}: ${subtitle}, #${toHashtag(homeTeam?.nickname ?? "")} ${item.homeScore} x ${item.awayScore} #${toHashtag(awayTeam?.nickname ?? "")}`;
}

function getPlayerIdForStat(
  item: MatchNews,
  stat: "points" | "rebounds" | "assists" | "steals",
): { playerId: string; value: number } {
  switch (stat) {
    case "points": return { playerId: item.mostPointsPlayerId, value: item.mostPointsValue };
    case "rebounds": return { playerId: item.mostReboundsPlayerId, value: item.mostReboundsValue };
    case "assists": return { playerId: item.mostAssistsPlayerId, value: item.mostAssistsValue };
    case "steals": return { playerId: item.mostStealsPlayerId, value: item.mostStealsValue };
  }
}

function resolveComment(
  item: MatchNews,
  source: NewsComment["source"],
  lang: string,
  universities: University[],
  players: Player[],
): string {
  if (source.kind === "match") {
    const homeTeam = universities.find((u) => u.id === item.homeTeamId);
    const awayTeam = universities.find((u) => u.id === item.awayTeamId);
    const template = getMatchComments(lang)[source.occasion]?.[source.index] ?? "";
    return interpolate(template, {
      homeTeam: homeTeam?.nickname ?? "",
      awayTeam: awayTeam?.nickname ?? "",
      margin: Math.abs(item.homeScore - item.awayScore),
    });
  }

  const { playerId, value } = getPlayerIdForStat(item, source.stat);
  const player = players.find((p) => p.id === playerId);
  const template = getPlayerComments(lang)[source.stat]?.[source.index] ?? "";
  return interpolate(template, {
    playerName: player?.firstName ?? "",
    value,
  });
}

export function getNewsComments(
  item: MatchNews,
  lang: string,
  universities: University[],
  players: Player[],
): { username: string; likes: number; text: string }[] {
  return item.comments.map((comment) => ({
    username: comment.username,
    likes: comment.likes,
    text: resolveComment(item, comment.source, lang, universities, players),
  }));
}
