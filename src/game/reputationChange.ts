export function calcReputationChange(
  currentRep: number,
  userScore: number,
  opponentScore: number,
): number {
  const scoreDiff = Math.abs(userScore - opponentScore);
  const diffFactor = Math.log(scoreDiff + 1) / Math.log(51);
  const userWon = userScore > opponentScore;

  if (userWon) {
    const dampening = (100 - currentRep) / 100;
    return (1 + diffFactor * 4) * dampening + Math.random() * 0.5;
  } else {
    return -(1 + diffFactor * 3 + Math.random() * 0.5);
  }
}
