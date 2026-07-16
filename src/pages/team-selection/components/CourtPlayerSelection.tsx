import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useAppDispatch, useAppSelector } from "../../../hooks/useAppDispatch";
import { useAuthUser } from "../../../hooks/useAuthUser";
import { selectPlayersFromUniversity } from "../../../selectors/data.selectors";
import { selectHeadToHeadMatches } from "../../../selectors/data.scheduleSelector";
import { selectGameContext } from "../../../selectors/inGameTeam.selector";
import { RootState } from "../../../store";
import { setStarters } from "../../../store/slices/gameSettingsSlice";
import { playerAverage } from "../../../game/skillsAverage";
import { Player } from "../../../types/Player";
import { PlayerAvatar } from "../../../Components/PlayerAvatar";
import { CourtImage } from "./CourtImage";
import { PlayerBenchList } from "./PlayerBenchList";
import { PlayTypeSelection } from "./PlayTypeSelection";
import { OpponentInfoCard } from "./OpponentInfoCard";
import { COURT_SLOTS } from "./courtSlots";

type DragData =
  | { type: "bench"; playerId: string }
  | { type: "slot"; slotId: number; playerId?: string };

function buildInitialSlots(starters: Player[]): (Player | null)[] {
  const slots: (Player | null)[] = COURT_SLOTS.map(() => null);
  starters.slice(0, COURT_SLOTS.length).forEach((player, index) => {
    slots[index] = player;
  });
  return slots;
}

export const CourtPlayerSelection = () => {
  const user = useAuthUser();
  const dispatch = useAppDispatch();

  const starters = useAppSelector((state: RootState) => state.gameSettings.starters);
  const players = useSelector((state: RootState) =>
    selectPlayersFromUniversity(state, user.currentUniversity.id).sort((a, b) =>
      a.inCourtPosition.localeCompare(b.inCourtPosition),
    ),
  );

  const gameContext = useSelector((state: RootState) =>
    selectGameContext(state, user.currentUniversity.id),
  );
  const cpuUniversity = gameContext?.cpuUniversity ?? null;

  const opponentPlayers = useSelector((state: RootState) =>
    cpuUniversity ? selectPlayersFromUniversity(state, cpuUniversity.id) : [],
  );
  const headToHead = useSelector((state: RootState) =>
    cpuUniversity
      ? selectHeadToHeadMatches(user.currentUniversity.id, cpuUniversity.id)(state)
      : [],
  );

  const [slotted, setSlotted] = useState<(Player | null)[]>(() => buildInitialSlots(starters));
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor),
  );

  useEffect(() => {
    return () => {
      document.body.style.cursor = "";
    };
  }, []);

  const commit = (next: (Player | null)[]) => {
    setSlotted(next);
    dispatch(setStarters(next.filter((player): player is Player => player !== null)));
  };

  const handleAutoSelect = () => {
    const next = COURT_SLOTS.map((slot) => {
      const candidates = players.filter((p) => p.inCourtPosition === slot.position);
      if (candidates.length === 0) return null;
      return candidates.reduce((best, p) =>
        playerAverage(p) > playerAverage(best) ? p : best,
      );
    });
    commit(next);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
    document.body.style.cursor = "none";
  };

  const handleDragCancel = () => {
    setActiveId(null);
    document.body.style.cursor = "";
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    document.body.style.cursor = "";
    const { active, over } = event;
    const activeData = active.data.current as DragData;

    if (over && String(over.id).startsWith("slot:")) {
      const targetIndex = Number(String(over.id).split(":")[1]);
      const next = [...slotted];

      if (activeData.type === "bench") {
        const player = players.find((p) => p.id === activeData.playerId);
        if (!player) return;
        next[targetIndex] = player;
      } else {
        const fromIndex = activeData.slotId;
        if (fromIndex === targetIndex) return;
        const occupant = next[targetIndex];
        next[targetIndex] = next[fromIndex];
        next[fromIndex] = occupant;
      }
      commit(next);
    } else if (activeData.type === "slot") {
      const next = [...slotted];
      next[activeData.slotId] = null;
      commit(next);
    }
  };

  const activePlayer = (() => {
    if (!activeId) return null;
    const [type, id] = activeId.split(":");
    if (type === "bench") return players.find((p) => p.id === id) ?? null;
    if (type === "slot") return slotted[Number(id)] ?? null;
    return null;
  })();

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex flex-col gap-3 min-h-0 flex-1">
        <div className="grid grid-cols-3 gap-3 items-stretch">
          <div className="min-w-0">
            <CourtImage slotted={slotted} />
          </div>
          <div className="col-span-2 min-w-0 h-full">
            <PlayerBenchList players={players} slotted={slotted} onAutoSelect={handleAutoSelect} />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3 items-stretch">
          <div className="min-w-0">
            <PlayTypeSelection direction="column" show="offensive" />
          </div>
          <div className="min-w-0">
            <PlayTypeSelection direction="column" show="defensive" />
          </div>
          <div className="min-w-0">
            <OpponentInfoCard
              opponent={cpuUniversity}
              opponentPlayers={opponentPlayers}
              currentSeason={user.currentSeason}
              headToHead={headToHead}
              userUniversityId={user.currentUniversity.id}
            />
          </div>
        </div>
      </div>
    
      <DragOverlay>
        {activePlayer ? (
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-cardbg border border-highlights1/40 shadow-lg">
            <PlayerAvatar seed={activePlayer.id} size={32} />
            <span className="text-[11px] text-text1 whitespace-nowrap">
              {activePlayer.firstName} {activePlayer.lastName}
            </span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
