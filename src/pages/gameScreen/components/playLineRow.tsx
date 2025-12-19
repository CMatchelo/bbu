import { PlayLog } from "../../../types/PlayLog";

interface PlayLineRowProps {
  play: PlayLog;
  team: "HOME" | "AWAY";
}

export const PlayLineRow = ({ play, team }: PlayLineRowProps) => {
  const isHome = play.team === "HOME";
  const isTeam = play.team === team;
  const isSuccess = play.result.success;

  const formatPlayerName = (player?: { firstName: string; lastName: string }) =>
    player ? `${player.firstName[0]}. ${player.lastName}` : "";

  const primaryPlayer = play.result.turnoverBy
    ? formatPlayerName(play.result.turnoverBy)
    : formatPlayerName(play.result.selectedPlayer);

  const secondaryPlayer =
    isSuccess && play.result.assistBy
      ? formatPlayerName(play.result.assistBy)
      : !isSuccess && play.result.reboundWinnerPlayer
      ? formatPlayerName(play.result.reboundWinnerPlayer)
      : !isSuccess && play.result.stealedBy
      ? formatPlayerName(play.result.stealedBy)
      : "";

  let secondaryLabel = "";

  if (isSuccess && play.result.assistBy) {
    secondaryLabel = "Assist by";
  } else if (!isSuccess && play.result.reboundWinnerPlayer) {
    secondaryLabel = "Rebound by";
  } else if (!isSuccess && play.result.stealedBy) {
    secondaryLabel = "Steal by";
  }

  let boxLabel = ""
  if (isSuccess) {
    boxLabel = play.result.points.toString()
  } else if (!isSuccess && play.result.reboundWinnerPlayer) {
    boxLabel = "X"
  } else if (!isSuccess && play.result.turnoverBy) {
    boxLabel = "TO"
  }

  return (
    <div
      className={`
        h-10 w-full flex items-center
        ${isHome ? "flex-row-reverse" : "flex-row"}
        ${isTeam ? "border-b" : ""}
        ${isSuccess ? "border-green-400" : "border-red-400"}
      `}
    >
      {isTeam && (
        <div
          className={`flex gap-4 w-full justify-end items-center ${
            isHome ? "flex-row" : "flex-row-reverse"
          }`}
        >
          {secondaryPlayer && (
            <span className="text-xs">
              {secondaryLabel} {secondaryPlayer}
            </span>
          )}

          <div
            className={`w-30 gap-2 flex ${
              isHome ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <span>{primaryPlayer}</span>
          </div>

          <div
            className={`h-full flex justify-center w-8 p-2 text-gray-800 ${
              isSuccess ? "bg-green-400" : "bg-red-400"
            }`}
          >
            {boxLabel}
          </div>
        </div>
      )}
    </div>
  );
};
