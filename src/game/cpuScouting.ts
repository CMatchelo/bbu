import { HighSchoolPlayer } from "../types/HighSchoolPlayer";
import { University } from "../types/University";
import { Player, Position } from "../types/Player";
import { toRecord } from "../utils/toRecord";

const POSITIONS: Position[] = ["PG", "SG", "SF", "PF", "C"];
const TUTORING_BONUS = 1.5;
const USER_BONUS = 1.5;

type PlayerUpdate = { id: string; changes: Partial<HighSchoolPlayer> };
type UniUpdate = { id: string; changes: Partial<University> };

export type ScoutingResult = {
  playerUpdates: PlayerUpdate[];
  uniUpdates: UniUpdate[];
};

function pickRandom<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

export function runCpuScouting(
  universities: University[],
  hsPlayers: HighSchoolPlayer[],
  rosterPlayers: Player[],
  userUniId: string,
): ScoutingResult {
  const hsById = toRecord(hsPlayers);
  const rosterById = toRecord(rosterPlayers);
  const cpuUnis = universities.filter((u) => u.id !== userUniId);

  const pendingWatchlist: Record<string, string[]> = {};
  const pendingInterest: Record<string, string[]> = {};

  for (const uni of cpuUnis) {
    const graduatingByPos: Partial<Record<Position, number>> = {};
    const watchlistByPos: Partial<Record<Position, number>> = {};

    for (const playerId of uni.roster) {
      const p = rosterById[playerId];
      if (p?.yearsToGraduate === 1) {
        graduatingByPos[p.inCourtPosition] = (graduatingByPos[p.inCourtPosition] ?? 0) + 1;
      }
    }

    const currentWatchlist = [
      ...(uni.watchlist ?? []),
      ...(pendingWatchlist[uni.id] ?? []),
    ];

    for (const playerId of currentWatchlist) {
      const player = hsById[playerId];
      if (player) {
        watchlistByPos[player.inCourtPosition] = (watchlistByPos[player.inCourtPosition] ?? 0) + 1;
      }
    }

    const needScores = POSITIONS.map((pos) => ({
      pos,
      need: (graduatingByPos[pos] ?? 0) - (watchlistByPos[pos] ?? 0),
    })).filter((x) => x.need > 0);

    if (needScores.length === 0) continue;

    const maxNeed = Math.max(...needScores.map((x) => x.need));
    const topPositions = needScores.filter((x) => x.need === maxNeed).map((x) => x.pos);
    const chosenPos = topPositions[Math.floor(Math.random() * topPositions.length)];

    const currentWatchlistSet = new Set(currentWatchlist);
    const valid = hsPlayers.filter(
      (p) =>
        p.inCourtPosition === chosenPos &&
        p.signedWith === null &&
        !currentWatchlistSet.has(p.id),
    );

    for (const player of pickRandom(valid, 2)) {
      const alreadyInterested = new Set([
        ...player.universityInterest,
        ...(pendingInterest[player.id] ?? []),
      ]);
      if (!alreadyInterested.has(uni.id)) {
        pendingInterest[player.id] = [...(pendingInterest[player.id] ?? []), uni.id];
      }
      pendingWatchlist[uni.id] = [...(pendingWatchlist[uni.id] ?? []), player.id];
    }
  }

  const uniById = toRecord(universities);

  const playerUpdates: PlayerUpdate[] = Object.entries(pendingInterest).map(
    ([playerId, newIds]) => ({
      id: playerId,
      changes: { universityInterest: [...hsById[playerId].universityInterest, ...newIds] },
    }),
  );

  const uniUpdates: UniUpdate[] = Object.entries(pendingWatchlist).map(([uniId, newIds]) => ({
    id: uniId,
    changes: { watchlist: [...(uniById[uniId].watchlist ?? []), ...newIds] },
  }));

  return { playerUpdates, uniUpdates };
}

export function runCpuSigning(
  universities: University[],
  hsPlayers: HighSchoolPlayer[],
  rosterPlayers: Player[],
  userUniId: string,
): ScoutingResult {
  const uniById = toRecord(universities);
  const hsById = toRecord(hsPlayers);
  const rosterById = toRecord(rosterPlayers);

  const watchlists = Object.fromEntries(
    universities.map((u) => [u.id, [...(u.watchlist ?? [])]])
  );
  const signedRosters = Object.fromEntries(
    universities.map((u) => [u.id, [...(u.signedPlayers ?? [])]])
  );

  const attemptedPlayers = new Set<string>();
  const cpuUnis = universities.filter((u) => u.id !== userUniId);

  for (const uni of cpuUnis) {
    const graduatingCount = uni.roster.filter(
      (id) => rosterById[id]?.yearsToGraduate === 1,
    ).length;
    const slots = Math.floor(graduatingCount / 3);
    if (slots === 0) continue;

    (uni.watchlist ?? [])
      .map((id) => hsById[id])
      .filter((p): p is HighSchoolPlayer => !!p && p.signedWith === null)
      .sort((a, b) => b.potential - a.potential)
      .slice(0, slots)
      .forEach((p) => attemptedPlayers.add(p.id));
  }

  const playerUpdates: PlayerUpdate[] = [];
  const signedSet = new Set<string>();

  for (const playerId of attemptedPlayers) {
    if (signedSet.has(playerId)) continue;

    const player = hsById[playerId];
    if (!player || player.signedWith !== null) continue;

    const interested = player.universityInterest
      .map((id) => uniById[id])
      .filter((u): u is University => !!u);

    if (interested.length === 0) continue;

    let bestUni: University | null = null;
    let bestScore = -Infinity;

    for (const uni of interested) {
      let score =
        uni.academicPrestige +
        (player.tutoring ? TUTORING_BONUS : 0) +
        player.playerKnowledge / 10;
      if (uni.id === userUniId) score += USER_BONUS;
      const finalScore = score * (0.85 + Math.random() * 0.3);
      if (finalScore > bestScore) {
        bestScore = finalScore;
        bestUni = uni;
      }
    }

    if (!bestUni) continue;

    signedSet.add(playerId);
    playerUpdates.push({
      id: playerId,
      changes: { signedWith: bestUni.id, universityInterest: [] },
    });

    for (const wl of Object.values(watchlists)) {
      const idx = wl.indexOf(playerId);
      if (idx !== -1) wl.splice(idx, 1);
    }

    signedRosters[bestUni.id].push(playerId);
  }

  const uniUpdates: UniUpdate[] = [];
  for (const uni of universities) {
    const newWatchlist = watchlists[uni.id];
    const newSigned = signedRosters[uni.id];
    const watchlistChanged =
      newWatchlist.length !== (uni.watchlist ?? []).length ||
      newWatchlist.some((id, i) => id !== (uni.watchlist ?? [])[i]);
    const signedChanged = newSigned.length !== (uni.signedPlayers ?? []).length;

    if (watchlistChanged || signedChanged) {
      uniUpdates.push({
        id: uni.id,
        changes: { watchlist: newWatchlist, signedPlayers: newSigned },
      });
    }
  }

  return { playerUpdates, uniUpdates };
}
