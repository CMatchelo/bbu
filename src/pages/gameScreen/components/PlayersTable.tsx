import { Player } from "../../../types/Player";
import { PlayerGameStats } from "../../../types/PlayerGameStats";

interface PlayerTableProps {
  players: Player[];
  playerStats: Record<string, PlayerGameStats> | null;
}

const PlayerLine = ({
  children,
  classname,
}: {
  children: React.ReactNode;
  classname?: string;
}) => {
  return (
    <span
      className={`
    col-span-1  py-1 ${classname}
    `}
    >
      {children}
    </span>
  );
};

export const PlayerTable = ({ players, playerStats }: PlayerTableProps) => {
  const getStats = (playerId: string) =>
    playerStats ? playerStats[playerId] : null;

  return (
    <div className="shadow-2xl">
      <div className="grid grid-cols-13 gap-2 bg-highlights2 text-gray-700">
        <PlayerLine classname="col-span-3">Player</PlayerLine>
        <PlayerLine>PTS</PlayerLine>
        <PlayerLine>REB</PlayerLine>
        <PlayerLine>ASS</PlayerLine>
        <PlayerLine>BLK</PlayerLine>
        <PlayerLine>STL</PlayerLine>
        <PlayerLine>FGM</PlayerLine>
        <PlayerLine>FGA</PlayerLine>
        <PlayerLine>3PM</PlayerLine>
        <PlayerLine>3PA</PlayerLine>
        <PlayerLine>TO</PlayerLine>
      </div>
      <div>
        {players.map((p, i) => {
          const stats = getStats(p.id);
          return (
            <div
              key={i}
              className={`
                grid grid-cols-13
                ${i % 2 === 0 ? "bg-cardbg" : "bg-cardbgdark"}
              `}
            >
              <PlayerLine classname="col-span-3">
                {p.firstName.slice(0, 1)}. {p.lastName}
              </PlayerLine>
              <PlayerLine>{stats?.points}</PlayerLine>
              <PlayerLine>{stats?.rebounds}</PlayerLine>
              <PlayerLine>{stats?.assists}</PlayerLine>
              <PlayerLine>{stats?.blocks}</PlayerLine>
              <PlayerLine>{stats?.steals}</PlayerLine>
              <PlayerLine>{stats?.fgm}</PlayerLine>
              <PlayerLine>{stats?.fga}</PlayerLine>
              <PlayerLine>{stats?.tpm}</PlayerLine>
              <PlayerLine>{stats?.tpa}</PlayerLine>
              <PlayerLine>{stats?.turnovers}</PlayerLine>
            </div>
          );
        })}
      </div>
    </div>
  );
};
