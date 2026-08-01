import { useTranslation } from "react-i18next";
import { useUser } from "../../../Context/UserContext";
import { MatchWithTeams } from "../../../types/Match";
import { Pill } from "../../../Components/Pill";
import { useSelector } from "react-redux";
import { selectPlayersFromUniversity } from "../../../selectors/data.selectors";
import { RootState } from "../../../store";
import { PlayerStat } from "./PlayerStat";
import { getBestStat } from "../../../utils/getBestStat";

interface GameCardProps {
  match: MatchWithTeams;
}

function Barcode({ seed }: { seed: string }) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }

  const bars = Array.from({ length: 32 }, () => {
    h = (h * 1103515245 + 12345) >>> 0;
    return {
      width: (h % 3) + 1,
      tall: h % 5 !== 0,
    };
  });

  return (
    <div className="flex items-end gap-0.5 h-7 shrink-0">
      {bars.map((bar, i) => (
        <div
          key={i}
          className={`bg-text1/60 ${bar.tall ? "h-full" : "h-2/3"}`}
          style={{ width: `${bar.width}px` }}
        />
      ))}
    </div>
  );
}

function QrCode({ seed }: { seed: string }) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  }

  const size = 7;
  const cells = Array.from({ length: size * size }, () => {
    h = (h * 1103515245 + 12345) >>> 0;
    return h % 3 !== 0;
  });

  const isFinder = (row: number, col: number) =>
    (row < 3 && col < 3) || (row < 3 && col >= size - 3) || (row >= size - 3 && col < 3);

  return (
    <div
      className="grid gap-px shrink-0 bg-text1/60 p-1 rounded-[2px]"
      style={{ gridTemplateColumns: `repeat(${size}, 1fr)`, width: 28, height: 28 }}
    >
      {cells.map((on, i) => {
        const row = Math.floor(i / size);
        const col = i % size;
        const filled = isFinder(row, col) || on;
        return (
          <div key={i} className={filled ? "bg-cardbgdark" : "bg-transparent"} />
        );
      })}
    </div>
  );
}

export function GameCard({ match }: GameCardProps) {
  const { user } = useUser();
  const { t } = useTranslation();

  const isUserHome = match.home === user?.currentUniversity.id;
  const opponent = isUserHome ? match.awayTeam : match.homeTeam;
  const userTeam = isUserHome ? match.homeTeam : match.awayTeam;

  const userPlayers = useSelector((state: RootState) =>
    selectPlayersFromUniversity(state, user?.currentUniversity.id ?? ""),
  );
  const cpuPlayers = useSelector((state: RootState) =>
    selectPlayersFromUniversity(state, opponent.id),
  );

  if (!user) return null;

  const playerFg = getBestStat(userPlayers, "fgm", "fga", user.currentSeason);
  const cpuFg = getBestStat(cpuPlayers, "fgm", "fga", user.currentSeason);

  const playerTp = getBestStat(userPlayers, "tpm", "tpa", user.currentSeason);
  const cpuTp = getBestStat(cpuPlayers, "tpm", "tpa", user.currentSeason);

  const playerAssist = getBestStat(
    userPlayers,
    "assists",
    "matches",
    user.currentSeason,
  );
  const cpuAssist = getBestStat(
    cpuPlayers,
    "assists",
    "matches",
    user.currentSeason,
  );

  const userScore = isUserHome ? match.result?.homeScore : match.result?.awayScore;
  const oppScore = isUserHome ? match.result?.awayScore : match.result?.homeScore;
  const won =
    match.result != null && userScore != null && oppScore != null
      ? userScore > oppScore
      : null;

  return (
    <div
      className={`relative rounded-xl overflow-hidden border bg-linear-to-br from-cardbglight via-cardbg to-cardbgdark flex flex-row ${
        won ? "border-highlights1/40" : won === false ? "border-red-500/30" : "border-white/10"
      }`}
    >
      <div
        className="absolute inset-0 opacity-[0.50] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative flex flex-col items-center justify-center w-6 shrink-0 border-r border-dashed border-white/15 bg-black/10">
        <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-mainbgdark" />
        <div className="absolute -bottom-2 -right-2 w-4 h-4 rounded-full bg-mainbgdark" />
        <span className="[writing-mode:vertical-rl] rotate-180 text-[8px] font-bold uppercase tracking-[0.3em] text-text2/40 font-mono whitespace-nowrap">
          Admit One
        </span>
      </div>

      <div className="relative flex flex-col gap-1 flex-1 min-w-0">
        {match.result && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span
              className={`-rotate-18 border-4 rounded-lg px-6 py-1.5 text-3xl font-black uppercase tracking-widest ${
                won ? "border-highlights1/15 text-highlights1/15" : "border-red-400/15 text-red-400/15"
              }`}
            >
              Final
            </span>
          </div>
        )}

        <div className="bg-highlights1/15 border-b border-dashed border-highlights1/20 px-3 py-1.5 flex items-center justify-between shrink-0 font-mono">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-highlights1">
            {t("newsLocale.week")} {match.week}
          </span>
          <span className="text-[9px] uppercase tracking-[0.15em] text-text2/50">
            {isUserHome ? `${userTeam.city}, ${userTeam.state}` : `${opponent.city}, ${opponent.state}`}
          </span>
        </div>

        <div className="flex flex-row items-center justify-center gap-4 p-2">
          <div className="flex flex-col gap-1 basis-2/5 shrink-0 min-w-0 items-center">
            <span className="text-[13px] font-semibold text-text1 truncate">
              {userTeam.nickname}
            </span>
            <Pill rounded className="w-fit px-2">
              {userTeam.id.toUpperCase()}
            </Pill>
          </div>

          <div className="flex flex-col items-center gap-0.5 w-16 shrink-0">
            {match.result ? (
              <>
                <div className="flex items-center gap-1.5 tabular-nums leading-none">
                  <span
                    className={`text-[20px] font-black ${
                      won ? "text-highlights1" : "text-text2/60"
                    }`}
                  >
                    {userScore}
                  </span>
                  <span className="text-[12px] text-text2/40 font-medium">–</span>
                  <span
                    className={`text-[20px] font-black ${
                      won === false ? "text-highlights1" : "text-text2/60"
                    }`}
                  >
                    {oppScore}
                  </span>
                </div>
                <span
                  className={`text-[9px] font-bold uppercase tracking-widest ${
                    won ? "text-highlights1" : "text-red-400"
                  }`}
                >
                  {won ? "W" : "L"}
                </span>
              </>
            ) : (
              <span className="text-[13px] font-medium text-text2/60">
                {isUserHome ? "vs" : "@"}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1 basis-2/5 shrink-0 min-w-0 items-center">
            <span className="text-[13px] font-semibold text-text1 truncate">
              {opponent.nickname}
            </span>
            <Pill rounded className="w-fit px-2">
              {opponent.id.toUpperCase()}
            </Pill>
          </div>
        </div>

        <div className="flex flex-col gap-1 px-2 pb-2">
          <PlayerStat
            playerHome={playerFg}
            playerAway={cpuFg}
            label="%FG"
            currentSeason={user.currentSeason}
            made="fgm"
            attempted="fga"
          />

          <PlayerStat
            playerHome={playerTp}
            playerAway={cpuTp}
            label="%3P"
            currentSeason={user.currentSeason}
            made="tpm"
            attempted="tpa"
          />
        </div>

        <div className="relative mt-1 border-t border-dashed border-white/15">
          <div className="absolute -left-2 -top-2 w-4 h-4 rounded-full bg-mainbgdark" />
          <div className="absolute -right-2 -top-2 w-4 h-4 rounded-full bg-mainbgdark" />

          <div className="flex items-center justify-between px-3 py-2 gap-2">
            <Barcode seed={match.id} />
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[9px] tracking-widest text-text2/40 font-mono uppercase">
                {match.id.slice(0, 8)}
              </span>
              <QrCode seed={match.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
