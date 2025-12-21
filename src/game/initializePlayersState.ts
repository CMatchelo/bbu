import { Player } from "../types/Player";
import { PlayerGameStats } from "../types/PlayerGameStats";
import { University } from "../types/University";

export function initializePlayerState(
  homeUniversityId: string,
  awayUniversityId: string,
  playersHome: Player[],
  playersAway: Player[]
): Record<string, PlayerGameStats> {

  if (!playersHome || !playersHome) return {}

  const allPlayers = [...playersHome, ...playersAway];

  return Object.fromEntries(
    allPlayers.map((player) => [
      player.id,
      {
        name: player.firstName + " " + player.lastName,
        playerId: player.id,
        teamId: player.currentUniversity,
        opponentId:
          player.currentUniversity === homeUniversityId
            ? awayUniversityId
            : homeUniversityId,
        points: 0,
        fgm: 0,
        fga: 0,
        tpm: 0,
        tpa: 0,
        assists: 0,
        steals: 0,
        turnovers: 0,
        rebounds: 0,
        blocks: 0,
        stamina: 100
      },
    ])
  );
}
