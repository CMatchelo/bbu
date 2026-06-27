export type TitleOccasion =
  | "homeWinsTight" | "homeLosesTight"
  | "visitorWinsTight" | "visitorLosesTight"
  | "homeWinsComfortable" | "homeLosesComfortable"
  | "visitorWinsComfortable" | "visitorLosesComfortable"
  | "homeWinsLarge" | "homeLosesLarge"
  | "visitorWinsLarge" | "visitorLosesLarge";

export type OutcomeOccasion = "homeWins" | "homeLoses" | "visitorWins" | "visitorLoses";

const TIGHT_MAX = 8;
const COMFORTABLE_MAX = 16;

export function getTitleOccasionPair(
  homeScore: number,
  awayScore: number,
): [TitleOccasion, TitleOccasion] {
  const margin = Math.abs(homeScore - awayScore);
  const homeWon = homeScore > awayScore;

  if (margin <= TIGHT_MAX) {
    return homeWon
      ? ["homeWinsTight", "visitorLosesTight"]
      : ["visitorWinsTight", "homeLosesTight"];
  }
  if (margin <= COMFORTABLE_MAX) {
    return homeWon
      ? ["homeWinsComfortable", "visitorLosesComfortable"]
      : ["visitorWinsComfortable", "homeLosesComfortable"];
  }
  return homeWon
    ? ["homeWinsLarge", "visitorLosesLarge"]
    : ["visitorWinsLarge", "homeLosesLarge"];
}

export function getOutcomeOccasion(homeScore: number, awayScore: number): OutcomeOccasion {
  return homeScore > awayScore ? "homeWins" : "visitorWins";
}

export function getLoserOutcomeOccasion(homeScore: number, awayScore: number): OutcomeOccasion {
  return homeScore > awayScore ? "visitorLoses" : "homeLoses";
}
