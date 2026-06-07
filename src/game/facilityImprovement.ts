export function calcFacilityAcceptance(reputation: number, currentLevel: number): boolean {
  if (reputation < 60) return false;
  const baseProbability = 0.05 + 0.95 * ((reputation - 60) / 40);
  const levelFactor = (5 - currentLevel) / 4;
  return Math.random() < baseProbability * levelFactor;
}
