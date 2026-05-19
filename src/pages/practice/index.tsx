import { useSelector } from "react-redux";
import { ParentSecion } from "../../Components/ParentSection";
import { useAuthUser } from "../../hooks/useAuthUser";
import { selectPlayersFromUniversity } from "../../selectors/data.selectors";
import { Pill } from "../../Components/Pill";
import { Skill } from "../../types/Skill";
import { useState } from "react";
import { Player } from "../../types/Player";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { updatePlayers } from "../../store/slices/dataSlice";
import { savePlayers } from "../../utils/saveGame";
import { useTranslation } from "react-i18next";
import { Icons } from "../../utils/icons";
import { RootState } from "../../store";
import { playerAverage } from "../../game/skillsAverage";

const SKILLS: { abbr: string; key: keyof Skill }[] = [
  { abbr: "LAY", key: "layup" },
  { abbr: "2PT", key: "twopt" },
  { abbr: "3PT", key: "threept" },
  { abbr: "PAS", key: "pass" },
  { abbr: "DRI", key: "ballHandling" },
  { abbr: "AGL", key: "speedWithBall" },
  { abbr: "REB", key: "rebound" },
  { abbr: "DEF", key: "defense" },
  { abbr: "STL", key: "steal" },
  { abbr: "BLK", key: "block" },
];

export default function Practice() {
  const user = useAuthUser();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const players = useSelector((state: RootState) =>
    selectPlayersFromUniversity(state, user.currentUniversity.id),
  );

  const [pendingUpdates, setPendingUpdates] = useState<
    { id: string; changes: Partial<Player> }[]
  >([]);

  const updatePractice = (key: keyof Skill, id: string) => {
    setPendingUpdates((prev) => {
      const existing = prev.find((p) => p.id === id);
      if (existing) {
        existing.changes.practicing = key;
        return [...prev];
      }
      return [...prev, { id, changes: { practicing: key } }];
    });
  };

  const savePractice = async () => {
    dispatch(updatePlayers(pendingUpdates));
    setPendingUpdates([]);
    const folderName = `${user.name}_${user.id}`;
    await savePlayers(folderName);
  };

  return (
    <ParentSecion backgroundImg="/practiceBg.png">
      <div className="absolute inset-0 overflow-y-auto p-4 flex flex-col gap-4">
        <div className="flex items-center">
          <button
            onClick={savePractice}
            disabled={pendingUpdates.length === 0}
            className="ml-auto px-4 py-1.5 rounded-lg text-[12px] font-semibold uppercase tracking-wider bg-highlights1 text-mainbgdark hover:bg-highlights1light transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {t("systemGeneral.savePractice")}
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {players.map((player) => {
            const pending = pendingUpdates.find((p) => p.id === player.id);
            const hasPendingChange = !!pending;
            const currentPracticing = (pending?.changes.practicing ?? player.practicing) as
              | keyof Skill
              | null
              | undefined;
            const selectedSkillRaw = currentPracticing
              ? player.skills[currentPracticing]
              : undefined;

            return (
              <div
                key={player.id}
                className={`flex gap-3 px-4 py-3 rounded-xl bg-cardbg/75 border border-highlights1/10 transition-all ${
                  hasPendingChange ? "border-l-[3px] border-l-highlights1" : ""
                }`}
              >
                <div className="flex items-center gap-2 w-60">
                  <Pill variant="muted">{player.inCourtPosition}</Pill>
                  <span className="text-[13px] text-left font-semibold text-text1">
                    {player.firstName} {player.lastName}
                  </span>
                  <span className="text-[12px] text-text2/60">({playerAverage(player)})</span>
                  {player.injured && <span className="w-4 h-4 shrink-0">{Icons.MedicalSymbol}</span>}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {SKILLS.map(({ abbr, key }) => {
                    const rawVal = player.skills[key];
                    const flooredVal = Math.floor(rawVal);
                    const startVal = player.skillsStartSeason?.[key];
                    const hasEvolution =
                      startVal !== undefined && Math.floor(rawVal) > Math.floor(startVal);
                    const isSelected = currentPracticing === key;

                    return (
                      <button
                        key={key}
                        onClick={() => updatePractice(key, player.id)}
                        className={`flex flex-col items-center px-2.5 py-1.5 rounded-lg min-w-11 transition-colors ${
                          isSelected
                            ? "bg-highlights1 text-mainbgdark"
                            : "bg-cardbglight/70 text-text2 hover:bg-highlights1/20 hover:text-text1"
                        }`}
                      >
                        <span className="text-[9px] uppercase tracking-widest font-bold leading-tight">
                          {abbr}
                        </span>
                        <span className="text-[13px] font-black tabular-nums leading-tight">
                          {flooredVal}
                        </span>
                        {hasEvolution && (
                          <span
                            className={`text-[9px] leading-tight ${
                              isSelected ? "text-mainbgdark/60" : "text-highlights1/70"
                            }`}
                          >
                            {Math.floor(startVal!)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {selectedSkillRaw !== undefined && (
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-[10px] text-text2/50 uppercase tracking-wide shrink-0">
                      Next pt
                    </span>
                    <div className="flex-1 h-1.5 rounded-full bg-highlights1/15">
                      <div
                        className="h-full rounded-full bg-highlights1 transition-all"
                        style={{ width: `${(selectedSkillRaw % 1) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-text2/50 tabular-nums">
                      {Math.floor(selectedSkillRaw)}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </ParentSecion>
  );
}
