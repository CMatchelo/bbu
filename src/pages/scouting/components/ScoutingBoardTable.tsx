import { useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import { useVirtualizer } from "@tanstack/react-virtual";
import { TableCard } from "../../../Components/TableCard";
import { TableHead } from "../../../Components/TableHead";
import { Pill } from "../../../Components/Pill";
import { HighSchoolPlayer } from "../../../types/HighSchoolPlayer";
import { selectAllPlayers, selectAllUniversities } from "../../../selectors/data.selectors";
import { useUser } from "../../../Context/UserContext";
import { useTranslation } from "react-i18next";

interface ScoutingBoardTableProps {
  players: HighSchoolPlayer[];
  pendingScout?: Record<string, boolean>;
  pendingTutoring?: Record<string, boolean>;
  onScoutChange?: (id: string, value: boolean) => void;
  onTutoringChange?: (id: string, value: boolean) => void;
}

const COLUMNS = "50px minmax(200px,3fr) minmax(140px,2fr) 90px 70px 70px minmax(140px,1fr)";

export const ScoutingBoardTable = ({
  players,
  pendingScout = {},
  pendingTutoring = {},
  onScoutChange = () => {},
  onTutoringChange = () => {},
}: ScoutingBoardTableProps) => {
  const { t } = useTranslation();
  const { user } = useUser();
  const allPlayers = useSelector(selectAllPlayers);
  const universities = useSelector(selectAllUniversities);
  const parentRef = useRef<HTMLDivElement>(null);

  const userUni = universities.find((u) => u.id === user?.currentUniversity.id);

  const graduatingCount = allPlayers.filter(
    (p) => p.currentUniversity === userUni?.id && p.yearsToGraduate === 1,
  ).length;

  const signedCount = userUni?.signedPlayers?.length ?? 0;
  const allLettersDisabled = signedCount >= graduatingCount;

  const signedAnywhere = new Set(
    universities.flatMap((u) => u.signedPlayers ?? []),
  );

  const sorted = useMemo(
    () => players.slice().sort((a, b) => a.inCourtPosition.localeCompare(b.inCourtPosition)),
    [players],
  );

  const virtualizer = useVirtualizer({
    count: sorted.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 46,
    overscan: 10,
  });

  return (
    <TableCard title={t("scouting.board")} className="h-full">
      <div className="min-w-[860px]">
        <div className="grid bg-cardbglight/75 sticky top-0 z-10" style={{ gridTemplateColumns: COLUMNS }}>
          <TableHead className="text-center">{t("scouting.scout")}</TableHead>
          <TableHead align="left" className="pl-5">{t("generalLocale.player")}</TableHead>
          <TableHead align="left" className="pl-2">{t("scouting.interest")}</TableHead>
          <TableHead>{t("scouting.knowledge")}</TableHead>
          <TableHead>{t("scouting.grades")}</TableHead>
          <TableHead>{t("scouting.tutoring")}</TableHead>
          <TableHead>{t("scouting.letter")}</TableHead>
        </div>

        <div ref={parentRef} className="h-[600px] overflow-auto">
          <div className="relative" style={{ height: `${virtualizer.getTotalSize()}px` }}>
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const player = sorted[virtualRow.index];
              const effectiveScouted = pendingScout[player.id] ?? player.scouted;
              const effectiveTutoring = pendingTutoring[player.id] ?? player.tutoring;
              const isSigned = signedAnywhere.has(player.id);
              const letterDisabled =
                isSigned || allLettersDisabled || player.playerKnowledge < 50;

              return (
                <div
                  key={player.id}
                  className={`grid items-center border-b border-white/4 hover:bg-highlights1/5 transition-colors ${
                    virtualRow.index % 2 === 0 ? "bg-white/[0.018]" : ""
                  }`}
                  style={{
                    gridTemplateColumns: COLUMNS,
                    position: "absolute",
                    top: `${virtualRow.start}px`,
                    height: `${virtualRow.size}px`,
                    width: "100%",
                  }}
                >
                  <div className="flex justify-center">
                    <input
                      type="checkbox"
                      checked={effectiveScouted}
                      onChange={(e) => onScoutChange(player.id, e.target.checked)}
                      className="accent-highlights1 w-4 h-4 cursor-pointer"
                    />
                  </div>

                  <div className="pl-5 flex gap-2 items-center min-w-0">
                    <Pill variant="muted">{player.inCourtPosition}</Pill>
                    <span className="text-[13px] font-medium text-text1 truncate">
                      {player.firstName} {player.lastName}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 pl-2 py-1">
                    {player.universityInterest.map((uniId) => (
                      <Pill className="min-w-20" key={uniId} variant="muted">{uniId}</Pill>
                    ))}
                  </div>
                  <div className="text-center text-[12px] text-text2">
                    {player.playerKnowledge}
                  </div>
                  <div className="text-center text-[12px] text-text2">
                    {Math.round(player.grades)}
                  </div>

                  <div className="flex justify-center">
                    <input
                      type="checkbox"
                      checked={effectiveTutoring}
                      onChange={(e) => onTutoringChange(player.id, e.target.checked)}
                      className="accent-highlights1 w-4 h-4 cursor-pointer"
                    />
                  </div>

                  <div className="flex justify-center">
                    {player.signedWith ? (
                      <span className="text-[11px] font-semibold text-green-400/80 uppercase tracking-wider">
                        Signed · {player.signedWith}
                      </span>
                    ) : (
                      <button
                        disabled={letterDisabled}
                        onClick={() => console.log("Function called")}
                        className="
                          px-3 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider
                          bg-highlights1/10 border border-highlights1/30 text-highlights1
                          hover:bg-highlights1/20 transition-colors
                          disabled:opacity-30 disabled:cursor-not-allowed
                        "
                      >
                        {t("scouting.letterBtn")}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </TableCard>
  );
};
