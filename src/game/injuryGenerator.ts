import { INJURIES } from "../constants/injuries.constants";
import { selectUniversityById } from "../selectors/data.selectors";
import { store } from "../store";
import { BodyPartId, InjuryType, PlayerInjury } from "../types/Injury";
import { Player } from "../types/Player";
import { rand } from "../utils/mathFunc";

export function ApplyInjuries(players: Player[]) {
  const updates = [];
  for (const player of players) {
    if (player.injured === false) continue;
    if (player.injury) {
      const remaining = player.injury.gamesRemaining - 1;
      if (remaining <= 0) {
        updates.push({
          id: player.id,
          changes: {
            injury: null,
            injured: false,
          },
        });
      } else {
        updates.push({
          id: player.id,
          changes: {
            injury: {
              ...player.injury,
              gamesRemaining: remaining,
            },
          },
        });
      }

      continue;
    }

    const newInjury = InjuryGenerator(player);
    if (!newInjury) continue;

    updates.push({
      id: player.id,
      changes: {
        injury: newInjury,
      },
    });
  }
  return updates;
}

function InjuryGenerator(player: Player): PlayerInjury {
  const injury = MainInjury();
  const injuryTime = InjuryTime(injury, player);
  const bodyPart: BodyPartId = BodyPartSelect(injury.bodyParts);
  return {
    injuryId: injury.id,
    bodyPart,
    gamesRemaining: injuryTime,
  };
}

export function MainInjury(): InjuryType {
  const injuries = INJURIES;
  const weight = injuries.reduce((sum, i) => sum + i.weight, 0);
  const rand = Math.random() * weight;
  let acc = 0;
  for (const i of injuries) {
    acc += i.weight;
    if (rand <= acc) return i;
  }
  return injuries[2];
}

function InjuryTime(injury: InjuryType, player: Player): number {
  const baseGames = rand(injury.minGames, injury.maxGames);
  const medCenterLevel = selectUniversityById(player.currentUniversity)(
    store.getState(),
  ).medicalCenterLevel;
  const medicalModifier = 1 + (3 - medCenterLevel) * 0.15;
  return Math.round(baseGames * medicalModifier);
}

function BodyPartSelect(bodyParts: BodyPartId[]): BodyPartId {
  const bodyPart = rand(0, bodyParts.length);
  return bodyParts[bodyPart];
}
