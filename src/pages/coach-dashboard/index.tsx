import { useMemo } from "react";
import { useSelector } from "react-redux";
import { ParentSecion } from "../../Components/ParentSection";
import { StandingsTable } from "../../Components/StandingsTable";
import { BracketMatchup } from "../playoffs/components/BracketMatchup";
import { useUser } from "../../Context/UserContext";
import { useAuthUser } from "../../hooks/useAuthUser";
import { RootState } from "../../store";
import {
  selectPlayersFromUniversity,
  selectUniversityById,
  selectAllUniversities,
} from "../../selectors/data.selectors";
import { computeSeriesStates } from "../../utils/playoffsUtils";
import { REGULAR_SEASON_WEEKS } from "../../constants/game.constants";
import { CoachCard } from "./components/CoachCard";
import { NextMatchCard } from "./components/NextMatchCard";
import { LastMatchCard } from "./components/LastMatchCard";
import { UnavailableCard } from "./components/UnavailableCard";
import { StatLeadersCard } from "./components/StatLeadersCard";
import { DashboardCard } from "./components/DashboardCard";

const WINS_NEEDED: Record<number, number> = { 1: 2, 2: 3, 3: 4, 4: 4, 5: 4 };

export default function CoachDashboard() {
  const { user: rawUser } = useUser();
  const user = useAuthUser();

  const currentWeek = useSelector((state: RootState) => state.schedule.currentWeek);
  const matchesById = useSelector((state: RootState) => state.schedule.matchesById);

  const players = useSelector((state: RootState) =>
    selectPlayersFromUniversity(state, user.currentUniversity.id),
  );
  const university = useSelector(selectUniversityById(user.currentUniversity.id));
  const allUniversities = useSelector(selectAllUniversities);

  const isInPlayoffs = currentWeek > REGULAR_SEASON_WEEKS;
  const currentSeason = user.currentSeason;
  const uniId = user.currentUniversity.id;
  const seasonStats = university.stats[currentSeason];

  const uniById = useMemo(
    () => Object.fromEntries(allUniversities.map((u) => [u.id, u])),
    [allUniversities],
  );

  const { playedMatches, unplayedMatches } = useMemo(() => {
    const all = Object.values(matchesById).filter(
      (m) => m.home === uniId || m.away === uniId,
    );
    return {
      playedMatches: all.filter((m) => m.played).sort((a, b) => b.week - a.week),
      unplayedMatches: all.filter((m) => !m.played).sort((a, b) => a.week - b.week),
    };
  }, [matchesById, uniId]);

  const last5 = useMemo(
    () =>
      playedMatches.slice(0, 5).map((m): "W" | "L" => {
        const userIsHome = m.home === uniId;
        const userScore = userIsHome ? m.result!.homeScore : m.result!.awayScore;
        const oppScore = userIsHome ? m.result!.awayScore : m.result!.homeScore;
        return userScore > oppScore ? "W" : "L";
      }),
    [playedMatches, uniId],
  );

  const allSeries = useMemo(
    () => (isInPlayoffs ? computeSeriesStates(matchesById) : []),
    [isInPlayoffs, matchesById],
  );

  const userSeries = useMemo(
    () =>
      [...allSeries]
        .filter((s) => s.homeId === uniId || s.awayId === uniId)
        .sort((a, b) => b.round - a.round)[0] ?? null,
    [allSeries, uniId],
  );

  const userSeriesGames = useMemo(
    () =>
      userSeries
        ? Object.values(matchesById).filter(
            (m) => m.playoffMatchupId === userSeries.matchupId,
          )
        : [],
    [userSeries, matchesById],
  );

  if (!rawUser) return null;

  return (
    <ParentSecion backgroundImg="/practiceBg.png">
      <div className="absolute inset-0 overflow-y-auto p-4 flex flex-col gap-4">
        {/* Row 1: Coach | Next Match | Last Match */}
        <div className="grid grid-cols-3 gap-4">
          <CoachCard user={user} seasonStats={seasonStats} last5={last5} />
          <NextMatchCard
            match={unplayedMatches[0]}
            uniId={uniId}
            allUniversities={allUniversities}
            currentSeason={currentSeason}
            isInPlayoffs={isInPlayoffs}
          />
          <LastMatchCard
            match={playedMatches[0]}
            uniId={uniId}
            allUniversities={allUniversities}
          />
        </div>

        {/* Row 2: Unavailable | Stat Leaders */}
        <div className="grid grid-cols-3 gap-4">
          <UnavailableCard players={players} />
          <StatLeadersCard
            players={players}
            currentSeason={currentSeason}
            className="col-span-2"
          />
        </div>

        {/* Row 3: League Standings or Playoff Matchup */}
        {isInPlayoffs ? (
          <div className="grid grid-cols-3 gap-4">
            {userSeries ? (
              <div className="col-span-1">
                <p className="text-[10px] font-medium tracking-widest uppercase text-text2 mb-2">
                  Your Playoff Matchup
                </p>
                <BracketMatchup
                  series={userSeries}
                  uniById={uniById}
                  currentSeason={currentSeason}
                  userUniId={uniId}
                  games={userSeriesGames}
                  winsNeeded={WINS_NEEDED[userSeries.round] ?? 4}
                />
              </div>
            ) : (
              <DashboardCard title="Playoff Matchup" className="col-span-1">
                <p className="text-[12px] text-text2/50 italic">Not in playoffs.</p>
              </DashboardCard>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <StandingsTable leagueId={university.leagueId} />
          </div>
        )}
      </div>
    </ParentSecion>
  );
}
