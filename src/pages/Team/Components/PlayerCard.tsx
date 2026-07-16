import { Player } from "../../../types/Player";
import { PlayerAvatar } from "../../../Components/PlayerAvatar";
import { playerAverage } from "../../../game/skillsAverage";
import { useTranslation } from "react-i18next";
import { TUTORING_QTY } from "../../../constants/game.constants";

const SKILLS = [
  { label: "DEF", key: "defense" },
  { label: "DRI", key: "ballHandling" },
  { label: "PAS", key: "pass" },
  { label: "AGL", key: "speedWithBall" },
  { label: "BLK", key: "block" },
  { label: "STL", key: "steal" },
  { label: "REB", key: "rebound" },
  { label: "LAY", key: "layup" },
  { label: "3PT", key: "threept" },
  { label: "2PT", key: "twopt" },
] as const;

function skillColor(value: number) {
  if (value >= 80) return "text-highlights1";
  if (value >= 65) return "text-text1";
  return "text-text2";
}

interface PlayerCardProps {
  player: Player;
  flipped: boolean;
  currentSeason: number;
  universityName: string;
  qtyTutor: number;
  onTutoringChange: (playerId: string, checked: boolean) => void;
}

export function PlayerCard({
  player,
  flipped,
  currentSeason,
  universityName,
  qtyTutor,
  onTutoringChange,
}: PlayerCardProps) {
  const { t } = useTranslation();
  const overall = playerAverage(player);
  const stat = player.stats[currentSeason];
  const matches = stat?.matches || 1;

  const f = (val: number) => (isNaN(val) ? "—" : (val / matches).toFixed(1));

  return (
    <div className="relative h-52" style={{ perspective: "1000px" }}>
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-3d ${
          flipped ? "transform-[rotateY(180deg)]" : ""
        }`}
      >
        <div className="absolute inset-0 backface-hidden rounded-xl overflow-hidden border border-white/10 bg-cardbg flex flex-col">
          <div className="bg-highlights1/15 border-b border-highlights1/20 px-3 py-1.5 flex items-center justify-between shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-widest text-highlights1">
              {universityName}
            </span>
            <span className="text-[9px] text-text2 uppercase tracking-wider">
              Student ID
            </span>
          </div>

          <div className="flex flex-1 gap-3 p-3 min-h-0 overflow-hidden">
            <div className="shrink-0 flex items-start">
              <PlayerAvatar seed={player.id} size={80} className="rounded-lg!" />
            </div>

            <div className="flex flex-col justify-between flex-1 min-w-0 py-0.5">
              <div className="flex flex-col gap-1">
                <p className="text-[14px] font-bold text-text1 leading-tight truncate">
                  {player.firstName} {player.lastName}
                </p>
                <div className="flex flex-col items-start gap-0.5">
                    <span className="text-[11px] text-text2">
                      {t("generalLocale.grades")}:{" "}
                      <span
                        className={`font-semibold ${
                          player.grades < 70
                            ? "text-red-400"
                            : player.grades < 75
                              ? "text-highlights2"
                              : "text-text1"
                        }`}
                      >
                        {player.grades.toFixed(1)}
                      </span>
                    </span>
                    <span className="text-[11px] text-text2">
                      {t("generalLocale.yearToGraduate")}:{" "}
                      <span className={`font-semibold
                        ${
                          player.yearsToGraduate <= 1
                            ? "text-red-400"
                            : "text-text1"
                        }
                        `}>
                        {player.yearsToGraduate}y
                      </span>
                    </span>
                  <span className="text-[11px] text-text2 truncate">
                    {t("generalLocale.course")}:{" "}
                    <span className="font-semibold text-text1">
                      {t(`courseLocale.${player.course}`)}
                    </span>
                  </span>
                </div>
              </div>

              <label className="flex items-center gap-1.5 cursor-pointer w-fit mt-1">
                <input
                  type="checkbox"
                  checked={player.tutoring}
                  disabled={qtyTutor >= TUTORING_QTY && !player.tutoring}
                  onChange={(e) => onTutoringChange(player.id, e.target.checked)}
                  className="accent-highlights1 w-3.5 h-3.5 cursor-pointer disabled:cursor-not-allowed"
                />
                <span className="text-[11px] text-text2">
                  {t("generalLocale.tutoring")}
                </span>
              </label>
            </div>
          </div>

          <div className="border-t border-white/8 px-3 py-2 flex items-center gap-2 bg-cardbglight shrink-0">
            <span className="text-[10px] font-semibold text-text2 bg-white/4 border border-white/8 px-1.5 py-0.5 rounded">
              {player.inCourtPosition}
            </span>
            <span className="text-[12px] text-highlights1 font-bold">
              OVR {overall}
            </span>
            <span className="text-[11px] text-highlights2 font-medium">
              POT {player.minPotential}–{player.maxPotential}
            </span>
            <div className="grid grid-cols-5 gap-x-2 gap-y-1 ml-auto">
              {SKILLS.map(({ label, key }) => (
                <span
                  key={key}
                  className={`text-[9px] font-medium ${skillColor(player.skills[key])}`}
                >
                  {label} {Math.floor(player.skills[key])}
                </span>
              ))}
            </div>
          </div>
        </div>


        <div className="absolute inset-0 backface-hidden transform-[rotateY(180deg)] rounded-xl overflow-hidden border border-white/10 bg-cardbg flex flex-col">
          <div className="bg-highlights1/15 border-b border-highlights1/20 px-3 py-1.5 flex items-center justify-between shrink-0">
            <span className="text-[13px] font-bold text-text1 truncate">
              {player.firstName} {player.lastName}
            </span>
            <span className="text-[10px] font-semibold text-text2 bg-white/4 border border-white/8 px-1.5 py-0.5 rounded ml-2 shrink-0">
              {player.inCourtPosition}
            </span>
          </div>

          <div className="flex flex-1 gap-0 min-h-0 overflow-hidden">
            <div className="flex flex-col justify-center items-center border-r border-white/8 px-4 shrink-0">
              <span className="text-[9px] text-text2 uppercase tracking-wider">OVR</span>
              <span className="text-[32px] font-black text-highlights1">
                {overall}
              </span>
              <span className="text-[9px] text-text2 uppercase tracking-wider">POT</span>
              <span className="text-[10px] text-highlights2 mt-1">
                {player.minPotential}–{player.maxPotential}
              </span>
            </div>

            {stat ? (
              <div className="grid grid-cols-3 gap-x-2 gap-y-2 content-center flex-1 px-3 py-2">
                {(
                  [
                    { label: "PPG", value: f(stat.points) },
                    { label: "AST", value: f(stat.assists) },
                    { label: "REB", value: f(stat.rebounds) },
                    { label: "BLK", value: f(stat.blocks) },
                    { label: "STL", value: f(stat.steals) },
                    { label: "TO", value: f(stat.turnovers) },
                    { label: "FGM", value: f(stat.fgm) },
                    { label: "FGA", value: f(stat.fga) },
                    { label: "3PM", value: f(stat.tpm) },
                    { label: "3PA", value: f(stat.tpa) },
                    { label: "+-", value: f(stat.teamPoints - stat.teamPointsAllowed) },
                  ] as const
                ).map(({ label, value }) => (
                  <div key={label} className="flex flex-col items-center">
                    <span className="text-[9px] text-text2 uppercase tracking-wide">
                      {label}
                    </span>
                    <span className="text-[13px] font-semibold text-text1">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center">
                <span className="text-[12px] text-text2">No stats yet</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
