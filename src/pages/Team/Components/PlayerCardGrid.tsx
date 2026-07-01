import { useMemo, useState } from "react";
import { Player, Position } from "../../../types/Player";
import { PlayerCard } from "./PlayerCard";
import { playerAverage } from "../../../game/skillsAverage";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { updatePlayer } from "../../../store/slices/dataSlice";
import { savePlayers } from "../../../utils/saveGame";
import { useAuthUser } from "../../../hooks/useAuthUser";
import { TUTORING_QTY } from "../../../constants/game.constants";

type SortKey = "overall" | "potential" | "position" | "name";

const POSITIONS: Position[] = ["PG", "SG", "SF", "PF", "C"];

const SORT_OPTIONS: [SortKey, string][] = [
  ["position", "POS"],
  ["overall", "OVR"],
  ["potential", "POT"],
  ["name", "Name"],
];

interface PlayerCardGridProps {
  players: Player[];
  flipped: boolean;
  currentSeason: number;
  universityName: string;
}

export function PlayerCardGrid({
  players,
  flipped,
  currentSeason,
  universityName,
}: PlayerCardGridProps) {
  const dispatch = useAppDispatch();
  const user = useAuthUser();
  const [sortKey, setSortKey] = useState<SortKey>("position");
  const [posFilter, setPosFilter] = useState<Position | null>(null);

  const qtyTutor = players.filter((p) => p.tutoring).length;

  const handleTutoringChange = (playerId: string, checked: boolean) => {
    dispatch(updatePlayer({ id: playerId, changes: { tutoring: checked } }));
    savePlayers(`${user.name}_${user.id}`);
  };

  const sorted = useMemo(() => {
    const filtered = posFilter
      ? players.filter((p) => p.inCourtPosition === posFilter)
      : players;

    return [...filtered].sort((a, b) => {
      switch (sortKey) {
        case "overall":
          return playerAverage(b) - playerAverage(a);
        case "potential":
          return b.maxPotential - a.maxPotential;
        case "position":
          return a.inCourtPosition.localeCompare(b.inCourtPosition);
        case "name":
          return a.lastName.localeCompare(b.lastName);
        default:
          return 0;
      }
    });
  }, [players, sortKey, posFilter]);

  const tutoringFull = qtyTutor >= TUTORING_QTY;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 bg-cardbg/75 border border-highlights1/10 rounded-lg p-1">
          <FilterBtn
            active={posFilter === null}
            onClick={() => setPosFilter(null)}
          >
            ALL
          </FilterBtn>
          {POSITIONS.map((pos) => (
            <FilterBtn
              key={pos}
              active={posFilter === pos}
              onClick={() => setPosFilter(posFilter === pos ? null : pos)}
            >
              {pos}
            </FilterBtn>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-cardbg/75 border border-highlights1/10 rounded-lg p-1 ml-auto">
          <span className="text-[10px] text-text2 uppercase tracking-wider px-1.5">
            Sort
          </span>
          {SORT_OPTIONS.map(([key, label]) => (
            <SortBtn
              key={key}
              active={sortKey === key}
              onClick={() => setSortKey(key)}
            >
              {label}
            </SortBtn>
          ))}
        </div>

        <span
          className={`text-[10px] font-semibold px-2 py-1 rounded border ${
            tutoringFull
              ? "text-highlights2 border-highlights2/30 bg-highlights2/10"
              : "text-text2 border-white/10 bg-white/5"
          }`}
        >
          Tutoring {qtyTutor}/{TUTORING_QTY}
        </span>
      </div>

      <div
        className="grid gap-3 justify-center"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 380px))",
        }}
      >
        {sorted.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            flipped={flipped}
            currentSeason={currentSeason}
            universityName={universityName}
            qtyTutor={qtyTutor}
            onTutoringChange={handleTutoringChange}
          />
        ))}
      </div>
    </div>
  );
}

function FilterBtn({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${
        active
          ? "bg-highlights1 text-mainbgdark"
          : "text-text2 hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}

function SortBtn({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${
        active
          ? "bg-highlights2 text-mainbgdark"
          : "text-text2 hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}
