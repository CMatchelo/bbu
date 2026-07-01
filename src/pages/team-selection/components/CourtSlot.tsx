import { useDraggable, useDroppable } from "@dnd-kit/core";
import { Player, Position } from "../../../types/Player";
import { PlayerAvatar } from "../../../Components/PlayerAvatar";

interface CourtSlotProps {
  index: number;
  position: Position;
  x: number;
  y: number;
  player: Player | null;
}

export const CourtSlot = ({ index, position, x, y, player }: CourtSlotProps) => {
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `slot:${index}`,
  });
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    isDragging,
  } = useDraggable({
    id: `slot:${index}`,
    data: { type: "slot", slotId: index, playerId: player?.id },
    disabled: !player,
  });

  const setRefs = (node: HTMLElement | null) => {
    setDropRef(node);
    setDragRef(node);
  };

  return (
    <div
      ref={setRefs}
      {...(player ? listeners : {})}
      {...attributes}
      style={{ left: `${x}%`, top: `${y}%` }}
      className={`absolute flex flex-col items-center gap-0.5 -translate-x-1/2 -translate-y-1/2 transition-transform touch-none
        ${isOver ? "scale-110" : ""}
        ${player ? "cursor-grab active:cursor-grabbing" : "cursor-default"}
        ${isDragging ? "opacity-30" : ""}
      `}
    >
      {player ? (
        <>
          <PlayerAvatar seed={player.id} size={44} className="ring-2 ring-highlights1/60" />
          <span className="text-[9px] bg-mainbgdark/80 text-text1 px-1 rounded">
            {player.inCourtPosition}
          </span>
        </>
      ) : (
        <div
          aria-label={position}
          className={`w-11 h-11 rounded-full border-2 border-dashed transition-colors ${
            isOver ? "border-highlights1 bg-highlights1/10" : "border-white/25 bg-black/20"
          }`}
        />
      )}
    </div>
  );
};
