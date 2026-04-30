import { selectAllUniversities } from "../selectors/data.selectors";
import { store } from "../store";
import { Player } from "../types/Player";
import { University } from "../types/University";
import { clamp } from "../utils/mathFunc";

export function CalculateGrades(players: Player[]) {
  const updates = [];
  const universities = selectAllUniversities(store.getState());
  for (const p of players) {
    const uni = universities.find((u) => u.id === p.currentUniversity)
    const delta = calculateGradeDelta(p, uni);
    const intGain = calculateIntelligenceGain(p.intelligence, p.tutoring);

    const newGrades = clamp(p.grades + delta, 0, 100);
    const newIntelligence = clamp(p.intelligence + intGain, 0, 100);

    updates.push({
      id: p.id,
      changes: {
        intelligence: newIntelligence,
        grades: newGrades,
      },
    });
  }
  return updates;
}

function calculateGradeDelta(p: Player, uni?: University) {
  const BASE_RANGE = 3; // menor = menos variação por jogo

  const intelFactor = p.intelligence / 100;

  // random mais suave (tendência a valores médios)
  const rand = ((Math.random() + Math.random()) / 2) * 2 - 1;

  // universidade (1 a 5 → 0 a 1)
  const eduFactor = ((uni?.educationSupportLevel ?? 3) - 1) / 4;

  // pesos
  const negativeWeight = 1 - intelFactor; // Less intelligence, bigger negativeWeight
  const positiveWeight = 0.6 + intelFactor * 0.4; // More intelligence, bigger positive Weight

  let delta =
    rand >= 0
      ? rand * BASE_RANGE * positiveWeight
      : rand * BASE_RANGE * negativeWeight;

  // universidade melhora levemente o resultado
  delta *= 1 + eduFactor * 0.3;

  // tutoring reduz queda (mas não zera)
  if (p.tutoring && delta < 0) {
    delta *= 0.2; // só 20% da queda original
  }

  return delta;
}

function calculateIntelligenceGain(intelligence: number, tutoring: boolean) {
  if (!tutoring) return 0;

  const intelFactor = intelligence / 100;
  const curve = 1 - intelFactor;
  const gain = 0.1 + curve * 0.25;

  return gain;
}
