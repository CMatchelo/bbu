import { useTranslation } from "react-i18next";
import { Match } from "../../../types/Match";
import { Player } from "../../../types/Player";
import { University } from "../../../types/University";
import {
  DEFENSIVE_PLAY_LABELS,
  OFFENSIVE_PLAY_LABELS,
} from "../../../types/PlaySystem";
import { getTopPlays } from "../../../utils/playSystemStats";
import { getStatLeader, SeasonStatKey } from "../../../utils/seasonStats";
import { createDefaultOffensivePlaySystem, createDefaultDefensivePlaySystem } from "../../../utils/createPlaySystem";

interface OpponentInfoCardProps {
  opponent: University | null;
  opponentPlayers: Player[];
  currentSeason: number;
  headToHead: Match[];
  userUniversityId: string;
}

const LEADER_KEYS: SeasonStatKey[] = [
  "points",
  "steals",
  "blocks",
  "tpm",
  "turnovers",
  "rebounds",
];

function CardHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2.5 px-5 py-3.5 bg-cardbg border-b border-highlights1/25">
      <div className="w-1.5 h-1.5 rounded-full bg-highlights1 shrink-0" />
      <span className="text-[13px] font-medium tracking-widest uppercase text-text2">
        {title}
      </span>
    </div>
  );
}

export const OpponentInfoCard = ({
  opponent,
  opponentPlayers,
  currentSeason,
  headToHead,
  userUniversityId,
}: OpponentInfoCardProps) => {
  const { t } = useTranslation();

  if (!opponent) {
    return (
      <div className="rounded-xl overflow-hidden border border-highlights1/15 bg-mainbg flex-1 h-full flex flex-col">
        <CardHeader title={t("generalLocale.opponent")} />
        <div className="flex-1 flex items-center justify-center p-4">
          <span className="text-[12px] text-text2">Nenhuma partida agendada</span>
        </div>
      </div>
    );
  }

  const seasonStats = opponent.stats[currentSeason];
  const matches = seasonStats?.matches ?? 0;
  const wins = seasonStats?.wins ?? 0;
  const losses = matches - wins;
  const ppg = matches ? (seasonStats!.points / matches).toFixed(1) : "—";
  const oppPpg = matches ? (seasonStats!.pointsAllowed / matches).toFixed(1) : "—";

  const offSystem = opponent.offensive ?? createDefaultOffensivePlaySystem();
  const defSystem = opponent.defensive ?? createDefaultDefensivePlaySystem();
  const topOffense = getTopPlays(offSystem, OFFENSIVE_PLAY_LABELS, 2);
  const topDefense = getTopPlays(defSystem, DEFENSIVE_PLAY_LABELS, 2);

  const leaders = LEADER_KEYS.map((key) => ({
    key,
    label: t(`inGame.${key}`),
    result: getStatLeader(opponentPlayers, currentSeason, key),
  }));

  return (
    <div className="rounded-xl overflow-hidden border border-highlights1/15 bg-mainbg flex-1 h-full flex flex-col">
      <CardHeader title={t("generalLocale.opponent")} />

      <div className="flex-1 min-h-0 overflow-auto">
        <div className="px-4 py-3 flex flex-col gap-1 border-b border-highlights1/10">
          <span className="text-[13px] font-medium text-text1">{opponent.name}</span>
          <span className="text-[11px] text-text2">{opponent.nickname}</span>
          <div className="flex items-center gap-3 mt-1 text-[11px] text-text2">
            <span>
              {wins}-{losses}
            </span>
            <span>{ppg} PPG</span>
            <span>{oppPpg} PPG sofridos</span>
          </div>
        </div>

        <div className="px-4 py-3 border-b border-highlights1/10 grid grid-cols-2 gap-x-3 gap-y-1.5">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase tracking-widest text-text2">
              {t("generalLocale.offense")}
            </span>
            {topOffense.map((play) => (
              <div key={play.key} className="flex items-center justify-between gap-1 text-[11px]">
                <span className="text-text1 truncate">{play.label}</span>
                <span className="text-highlights2 shrink-0">{play.familiarity}%</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] uppercase tracking-widest text-text2">
              {t("generalLocale.defense")}
            </span>
            {topDefense.map((play) => (
              <div key={play.key} className="flex items-center justify-between gap-1 text-[11px]">
                <span className="text-text1 truncate">{play.label}</span>
                <span className="text-highlights2 shrink-0">{play.familiarity}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 py-3 border-b border-highlights1/10 flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-widest text-text2">
            {t("generalLocale.highlights")}
          </span>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
            {leaders.map(({ key, label, result }) => (
              <div key={key} className="flex items-center gap-1.5 text-[11px] min-w-0">
                <span className="text-[9px] text-text2/70 w-6 shrink-0">{label}</span>
                <span className="text-[9px] font-medium border rounded px-1 py-0.5 text-highlights2 bg-highlights2/10 border-highlights2/25 shrink-0">
                  {result?.player.inCourtPosition ?? "—"}
                </span>
                <span className="text-text1 truncate flex-1 min-w-0">
                  {result ? `${result.player.firstName} ${result.player.lastName}` : "—"}
                </span>
                <span className="text-text2 shrink-0">
                  {result ? result.value.toFixed(1) : "—"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 py-3 flex flex-col gap-1.5">
          <span className="text-[10px] uppercase tracking-widest text-text2">
            {t("generalLocale.seasonMatchups")}
          </span>
          {headToHead.length === 0 ? (
            <span className="text-[11px] text-text2">
              {t("generalLocale.firstMatchupOfSeason")}
            </span>
          ) : (
            headToHead.map((match) => {
              const userIsHome = match.home === userUniversityId;
              const userScore = userIsHome
                ? match.result!.homeScore
                : match.result!.awayScore;
              const oppScore = userIsHome
                ? match.result!.awayScore
                : match.result!.homeScore;
              const won = userScore > oppScore;
              return (
                <div
                  key={match.id}
                  className="flex items-center justify-between text-[11px]"
                >
                  <span className={won ? "text-highlights1" : "text-red-400"}>
                    {won ? "V" : "D"}
                  </span>
                  <span className="text-text1">
                    {userScore} - {oppScore}
                  </span>
                  <span className="text-text2">Sem {match.week}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
