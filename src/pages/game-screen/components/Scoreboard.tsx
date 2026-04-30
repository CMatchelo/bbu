import formatTime from "../../../utils/formatTime";

interface ScoreboardProps {
  quarter: number;
  timeLeft: number;
  homeNickname: string;
  awayNickname: string;
  homePoints: number;
  awayPoints: number;
}

export function Scoreboard({
  quarter,
  timeLeft,
  homeNickname,
  awayNickname,
  homePoints,
  awayPoints,
}: ScoreboardProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <h2 className="text-lg font-semibold tracking-wide text-gray-300">
        Q{quarter} –{" "}
        <span className="font-mono text-white">{formatTime(timeLeft)}</span>
      </h2>

      <div className="grid grid-cols-7 gap-3 items-center w-full rounded-xl border border-highlights1 bg-white/5 px-6 py-4 shadow-md">
        <div className="col-span-3 text-right">
          <h1 className="text-xl font-bold tracking-wide">{homeNickname}</h1>
        </div>

        <div className="col-span-1 text-center">
          <h2 className="text-2xl font-extrabold text-white">
            {homePoints}
            <span className="mx-1 text-gray-400">x</span>
            {awayPoints}
          </h2>
        </div>

        <div className="col-span-3 text-left">
          <h1 className="text-xl font-bold tracking-wide">{awayNickname}</h1>
        </div>
      </div>
    </div>
  );
}
