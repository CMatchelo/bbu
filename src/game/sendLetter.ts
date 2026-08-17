import { HighSchoolPlayer } from "../types/HighSchoolPlayer";
import { University } from "../types/University";
import { toRecord } from "../utils/toRecord";

const TUTORING_BONUS = 1.5;
const LETTER_USER_BONUS = 2;
const HESITATION_BASE = 6;

type PlayerUpdate = { id: string; changes: Partial<HighSchoolPlayer> };
type UniUpdate = { id: string; changes: Partial<University> };

export type LetterOutcome = "accepted" | "declined-other" | "declined-wait";

export type LetterResult = {
  outcome: LetterOutcome;
  otherUniversityName?: string;
  playerUpdates: PlayerUpdate[];
  uniUpdates: UniUpdate[];
};

function jitter(): number {
  return 0.85 + Math.random() * 0.3;
}

function scoreFor(uni: University, player: HighSchoolPlayer): number {
  return (
    (uni.academicPrestige + (player.tutoring ? TUTORING_BONUS : 0) + player.playerKnowledge / 10) *
    jitter()
  );
}

function signPlayerWith(
  winnerUniId: string,
  player: HighSchoolPlayer,
  universities: University[],
): UniUpdate[] {
  const uniById = toRecord(universities);
  const uniUpdates: UniUpdate[] = [];

  for (const uni of universities) {
    const watchlist = uni.watchlist ?? [];
    if (!watchlist.includes(player.id)) continue;
    uniUpdates.push({
      id: uni.id,
      changes: { watchlist: watchlist.filter((id) => id !== player.id) },
    });
  }

  const winnerUni = uniById[winnerUniId];
  const existingUpdate = uniUpdates.find((u) => u.id === winnerUniId);
  const signedPlayers = [...(winnerUni.signedPlayers ?? []), player.id];
  if (existingUpdate) {
    existingUpdate.changes.signedPlayers = signedPlayers;
  } else {
    uniUpdates.push({ id: winnerUniId, changes: { signedPlayers } });
  }

  return uniUpdates;
}

export function sendLetterOfIntent(
  player: HighSchoolPlayer,
  universities: University[],
  userUniId: string,
): LetterResult {
  const uniById = toRecord(universities);
  const userUni = uniById[userUniId];

  const rivalUnis = player.universityInterest
    .filter((id) => id !== userUniId)
    .map((id) => uniById[id])
    .filter((u): u is University => !!u);

  const userScore = scoreFor(userUni, player) + LETTER_USER_BONUS;
  const hesitationScore = HESITATION_BASE * jitter();
  const rivalScored = rivalUnis.map((uni) => ({ uni, score: scoreFor(uni, player) }));

  let winner: "user" | "hesitation" | University = "user";
  let bestScore = userScore;
  if (hesitationScore > bestScore) {
    winner = "hesitation";
    bestScore = hesitationScore;
  }
  for (const { uni, score } of rivalScored) {
    if (score > bestScore) {
      winner = uni;
      bestScore = score;
    }
  }

  if (winner === "user") {
    return {
      outcome: "accepted",
      playerUpdates: [
        { id: player.id, changes: { signedWith: userUniId, universityInterest: [] } },
      ],
      uniUpdates: signPlayerWith(userUniId, player, universities),
    };
  }

  const declineChanges: Partial<HighSchoolPlayer> = {
    rejectedLetter: true,
    scouted: false,
  };

  if (winner === "hesitation") {
    return {
      outcome: "declined-wait",
      playerUpdates: [{ id: player.id, changes: declineChanges }],
      uniUpdates: [],
    };
  }

  return {
    outcome: "declined-other",
    otherUniversityName: winner.name,
    playerUpdates: [
      {
        id: player.id,
        changes: { ...declineChanges, signedWith: winner.id, universityInterest: [] },
      },
    ],
    uniUpdates: signPlayerWith(winner.id, player, universities),
  };
}
