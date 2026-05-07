import { t } from "i18next";
import { TeamGameStats } from "../../../types/TeamGameStats";

interface TeamStateProps {
  stats: TeamGameStats;
  isAway?: boolean;
}

export const TeamStats = ({ stats, isAway }: TeamStateProps) => {
  const items = [
    { label: t("inGame.fgm"), value: stats.fgm },
    { label: t("inGame.fga"), value: stats.fga },
    { label: t("inGame.tpm"), value: stats.tpm },
    { label: t("inGame.tpa"), value: stats.tpa },
    { label: t("inGame.blocks"), value: stats.blocks },
    { label: t("inGame.rebounds"), value: stats.rebounds },
    { label: t("inGame.steals"), value: stats.steals },
    { label: t("inGame.turnovers"), value: stats.turnovers },
  ];
  return (
    <div className="flex flex-col text-sm bg-cardbgdark h-fit p-2 shadow-2xl">
      {items.map(({ label, value }) => (
        <div
          key={label}
          className={`grid grid-cols-2 gap-2 ${isAway ? "text-right" : ""}`}
        >
          {isAway ? (
            <>
              <span className="font-semibold text-left">{value}</span>
              <span className="text-gray-500 text-right">{label}</span>
            </>
          ) : (
            <>
              <span className="text-gray-500 text-left">{label}</span>
              <span className="font-semibold text-right">{value}</span>
            </>
          )}
        </div>
      ))}
    </div>
  );
};
