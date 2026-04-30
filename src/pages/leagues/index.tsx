import { useSelector } from "react-redux";
import { selectAllMatchesByLeague } from "../../selectors/data.scheduleSelector";
import { MatchesTable } from "../../Components/MatchesTable";
import { ParentSecion } from "../../Components/ParentSection";
import { useEffect, useState } from "react";
import { RootState } from "../../store";
import { useUser } from "../../Context/UserContext";
import { useTranslation } from "react-i18next";
import { StandingsTable } from "../../Components/StandingsTable";

const LEAGUES = [
  { value: "ne_league", label: "NE League" },
  { value: "n_league", label: "N League" },
  { value: "cw_league", label: "CW League" },
  { value: "se_league", label: "SE League" },
  { value: "s_league", label: "S League" },
] as const;

export const Leagues = () => {
  const { t } = useTranslation();
  const { user } = useUser();
  const [leagueId, setLeagueId] = useState(
    user?.currentUniversity?.leagueId || "ne_league",
  );

  const schedule = useSelector((state: RootState) =>
    selectAllMatchesByLeague(state, leagueId),
  );

  useEffect(() => {
    setLeagueId(user?.currentUniversity?.leagueId || "ne_league");
  }, [user?.currentUniversity?.leagueId]);
  return (
    <ParentSecion>
      <div className="flex self-center bg-cardbg border border-highlights1/20 rounded-lg w-fit">
        {LEAGUES.map((league, i) => (
          <button
            key={league.value}
            onClick={() => setLeagueId(league.value)}
            className={`px-4 py-2 text-[12px] font-medium whitespace-nowrap transition-all
        ${
          leagueId === league.value
            ? "bg-highlights1/12 text-highlights1"
            : "text-text2 hover:bg-highlights1/6 hover:text-text1"
        }`}
          >
            {t(`championshipLocale.${league.value}`)}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-4 p-4 overflow-auto">
        <StandingsTable leagueId={leagueId} />
        <MatchesTable schedule={schedule} />
      </div>
    </ParentSecion>
  );
};
