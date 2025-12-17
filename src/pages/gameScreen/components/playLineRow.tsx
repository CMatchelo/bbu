import { PlayLog } from "../../../types/PlayLog";

interface PlayLineRowProps {
  play: PlayLog;
  team: "HOME" | "AWAY";
}

export const PlayLineRow = ({ play, team }: PlayLineRowProps) => {
  const isHome = play.team === "HOME";
  const isTeam = play.team === team;
  const isSuccess = play.result.success;

  const secondaryPlayer = isSuccess
    ? play.result.assistBy?.firstName
    : play.result.reboundWinnerPlayer?.firstName;

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
              {isSuccess ? "Assist by" : "Rebound by"} {secondaryPlayer}
            </span>
          )}

          <span className={`w-20 ${isHome ? "text-end" : "text-start"}`}>
            {play.result.selectedPlayer.firstName}
          </span>

          <div
            className={`h-full w-8 p-2 text-gray-800 ${
              isSuccess ? "bg-green-400" : "bg-red-400"
            }`}
          >
            {isSuccess ? play.result.points : "X"}
          </div>
        </div>
      )}
    </div>
  );
};
