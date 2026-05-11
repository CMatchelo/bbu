import { Match } from '../types/Match';
import { University } from '../types/University';
import { PlayoffResult, LeagueStandings } from '../types/LeagueStandings';
import { PLAYOFFS_CHAMPIONSHIP } from '../constants/game.constants';
import { SeriesState } from '../types/SeriesState';

// Seed numbers for each R1 bracket slot (pairs: [higherSeed, lowerSeed])
const R1_BRACKET: [number, number][] = [
  [1, 32], [16, 17], [8, 25], [9, 24],
  [2, 31], [15, 18], [7, 26], [10, 23],
  [3, 30], [14, 19], [6, 27], [11, 22],
  [4, 29], [13, 20], [5, 28], [12, 21],
];

// Minimum wins needed to win a series per round
function winsNeeded(round: 1 | 2 | 3 | 4 | 5): number {
  if (round === 1) return 2;
  if (round === 2) return 3;
  return 4;
}

// Games created upfront per round (minimum necessary)
export function initialGamesForRound(round: 1 | 2 | 3 | 4 | 5): number {
  if (round === 1) return 2;
  if (round === 2) return 3;
  return 4;
}

export function playoffResultForRound(round: 1 | 2 | 3 | 4 | 5): PlayoffResult {
  if (round === 1) return 'round1';
  if (round === 2) return 'round2';
  if (round === 3) return 'quarterfinal';
  if (round === 4) return 'semifinal';
  return 'runner_up';
}

function teamScore(uni: University, season: number): [number, number, number] {
  const stats = uni.stats[season];
  if (!stats) return [0, 0, 0];
  const wins = stats.wins ?? 0;
  const diff = (stats.points ?? 0) - (stats.pointsAllowed ?? 0);
  const pts = stats.points ?? 0;
  return [wins, diff, pts];
}

function compareTeams(a: University, b: University, season: number, tieRands: Map<string, number>): number {
  const [aw, ad, ap] = teamScore(a, season);
  const [bw, bd, bp] = teamScore(b, season);
  if (bw !== aw) return bw - aw;
  if (bd !== ad) return bd - ad;
  if (bp !== ap) return bp - ap;
  return (tieRands.get(a.id) ?? 0) - (tieRands.get(b.id) ?? 0);
}

export function sortTeams(teams: University[], season: number, tieRands: Map<string, number>): University[] {
  return [...teams].sort((a, b) => compareTeams(a, b, season, tieRands));
}

// Returns an array of 32 seeded qualifiers: top 6 per league + 2 best 7th-place
// leagueGroups: Record<leagueId, University[]>
export function getPlayoffQualifiers(
  leagueGroups: Record<string, University[]>,
  season: number,
): University[] {
  const tieRands = new Map<string, number>();
  const allTeams = Object.values(leagueGroups).flat();
  allTeams.forEach((u) => tieRands.set(u.id, Math.random()));

  const top6PerLeague: University[] = [];
  const seventhPlaces: University[] = [];

  for (const teams of Object.values(leagueGroups)) {
    const sorted = sortTeams(teams, season, tieRands);
    top6PerLeague.push(...sorted.slice(0, 6));
    if (sorted[6]) seventhPlaces.push(sorted[6]);
  }

  const best2Sevenths = sortTeams(seventhPlaces, season, tieRands).slice(0, 2);
  const qualifiers = [...top6PerLeague, ...best2Sevenths];

  // Sort all 32 by overall record for seeding
  return sortTeams(qualifiers, season, tieRands);
}

export function createSeriesMatches(
  matchupId: string,
  homeId: string,
  awayId: string,
  round: 1 | 2 | 3 | 4 | 5,
  startWeek: number,
): Match[] {
  const count = initialGamesForRound(round);
  const matches: Match[] = [];
  for (let i = 0; i < count; i++) {
    matches.push({
      id: crypto.randomUUID(),
      championship: PLAYOFFS_CHAMPIONSHIP,
      home: homeId,
      away: awayId,
      week: startWeek + i,
      played: false,
      playoffRound: round,
      playoffMatchupId: matchupId,
      seriesGame: i + 1,
    });
  }
  return matches;
}

// Build all R1 matches from the 32 seeded teams, starting at startWeek
export function buildR1Matches(seededTeams: University[], startWeek: number): Match[] {
  const matches: Match[] = [];
  R1_BRACKET.forEach(([highSeed, lowSeed], slotIndex) => {
    const home = seededTeams[highSeed - 1];
    const away = seededTeams[lowSeed - 1];
    if (!home || !away) return;
    const matchupId = `R1-S${slotIndex + 1}`;
    matches.push(...createSeriesMatches(matchupId, home.id, away.id, 1, startWeek));
  });
  return matches;
}

export function computeSeriesStates(matchesById: Record<string, Match>): SeriesState[] {
  const byMatchup = new Map<string, Match[]>();

  for (const match of Object.values(matchesById)) {
    if (match.championship !== PLAYOFFS_CHAMPIONSHIP) continue;
    const mid = match.playoffMatchupId!;
    if (!byMatchup.has(mid)) byMatchup.set(mid, []);
    byMatchup.get(mid)!.push(match);
  }

  const result: SeriesState[] = [];

  byMatchup.forEach((games, matchupId) => {
    const sorted = [...games].sort((a, b) => (a.seriesGame ?? 0) - (b.seriesGame ?? 0));
    const first = sorted[0];
    const round = first.playoffRound as 1 | 2 | 3 | 4 | 5;
    const homeId = first.home;
    const awayId = first.away;
    const needed = winsNeeded(round);

    let homeWins = 0;
    let awayWins = 0;
    let gamesPlayed = 0;

    for (const g of sorted) {
      if (!g.played || !g.result) continue;
      gamesPlayed++;
      if (g.result.homeScore > g.result.awayScore) homeWins++;
      else awayWins++;
    }

    const decided = homeWins >= needed || awayWins >= needed;
    const winnerId = homeWins >= needed ? homeId : awayWins >= needed ? awayId : null;
    const loserId = winnerId ? (winnerId === homeId ? awayId : homeId) : null;

    result.push({
      matchupId,
      homeId,
      awayId,
      round,
      homeWins,
      awayWins,
      gamesPlayed,
      totalCreated: sorted.length,
      decided,
      winnerId,
      loserId,
    });
  });

  return result;
}

// Returns the next week to assign for new playoff matches
export function nextPlayoffWeek(matchesById: Record<string, Match>): number {
  let max = 36;
  for (const m of Object.values(matchesById)) {
    if (m.championship === PLAYOFFS_CHAMPIONSHIP && m.week > max) {
      max = m.week;
    }
  }
  return max + 1;
}

// Given all completed R1 series, build R2 matchups
function buildNextRoundMatches(
  seriesStates: SeriesState[],
  currentRound: 1 | 2 | 3 | 4,
  startWeek: number,
): Match[] {
  const nextRound = (currentRound + 1) as 2 | 3 | 4 | 5;
  // Sort by slot number so pairing is deterministic
  const decided = seriesStates
    .filter((s) => s.round === currentRound && s.decided && s.winnerId)
    .sort((a, b) => {
      const slotA = parseInt(a.matchupId.split('-S')[1]);
      const slotB = parseInt(b.matchupId.split('-S')[1]);
      return slotA - slotB;
    });

  const matches: Match[] = [];
  for (let i = 0; i < decided.length; i += 2) {
    const seriesA = decided[i];
    const seriesB = decided[i + 1];
    if (!seriesA || !seriesB) break;

    const slotNumber = Math.floor(i / 2) + 1;
    const matchupId = `R${nextRound}-S${slotNumber}`;
    matches.push(
      ...createSeriesMatches(matchupId, seriesA.winnerId!, seriesB.winnerId!, nextRound, startWeek),
    );
  }
  return matches;
}

// Returns matches to add (new series games or next round)
// and teams eliminated (to update their playoffResult)
export function advancePlayoffs(matchesById: Record<string, Match>): {
  newMatches: Match[];
  eliminated: { id: string; result: PlayoffResult }[];
  champion: string | null;
} {
  const allSeries = computeSeriesStates(matchesById);
  const newMatches: Match[] = [];
  const eliminated: { id: string; result: PlayoffResult }[] = [];
  let champion: string | null = null;

  // Find the highest existing round (the current active round)
  let activeRound: 1 | 2 | 3 | 4 | 5 | null = null;
  for (let round = 5; round >= 1; round--) {
    if (allSeries.some((s) => s.round === round)) {
      activeRound = round as 1 | 2 | 3 | 4 | 5;
      break;
    }
  }

  if (activeRound !== null) {
    const r = activeRound;
    const seriesInRound = allSeries.filter((s) => s.round === r);
    const allDecided = seriesInRound.every((s) => s.decided);

    for (const series of seriesInRound) {
      if (series.decided) {
        if (series.loserId) {
          if (r === 5) {
            champion = series.winnerId;
            eliminated.push({ id: series.loserId, result: 'runner_up' });
          } else {
            eliminated.push({ id: series.loserId, result: playoffResultForRound(r) });
          }
        }
      } else {
        // Series not decided: create next game if all created games are played
        const maxGames = winsNeeded(r) * 2 - 1;
        if (series.totalCreated < maxGames && series.gamesPlayed >= series.totalCreated) {
          const nextWeek = nextPlayoffWeek(matchesById);
          newMatches.push({
            id: crypto.randomUUID(),
            championship: PLAYOFFS_CHAMPIONSHIP,
            home: series.homeId,
            away: series.awayId,
            week: nextWeek,
            played: false,
            playoffRound: r,
            playoffMatchupId: series.matchupId,
            seriesGame: series.totalCreated + 1,
          });
        }
      }
    }

    // If all series in this round are decided and it's not the finals, create next round
    if (allDecided && r < 5) {
      const nextRound = (r + 1) as 2 | 3 | 4 | 5;
      const nextRoundExists = allSeries.some((s) => s.round === nextRound);
      if (!nextRoundExists) {
        const startWeek = nextPlayoffWeek(matchesById);
        newMatches.push(...buildNextRoundMatches(allSeries, r as 1 | 2 | 3 | 4, startWeek));
      }
    }
  }

  return { newMatches, eliminated, champion };
}

export function buildLeagueStandings(
  leagueGroups: Record<string, University[]>,
  season: number,
  nationalChampionId: string,
  tieRands: Map<string, number>,
): LeagueStandings {
  const leagueChampion = (leagueId: string): string => {
    const teams = leagueGroups[leagueId] ?? [];
    const sorted = sortTeams(teams, season, tieRands);
    return sorted[0]?.id ?? '';
  };

  return {
    year: season,
    ne_league: leagueChampion('ne_league'),
    n_league: leagueChampion('n_league'),
    cw_league: leagueChampion('cw_league'),
    se_league: leagueChampion('se_league'),
    s_league: leagueChampion('s_league'),
    nationalChampion: nationalChampionId,
  };
}
