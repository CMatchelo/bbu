import { useDraggable } from "@dnd-kit/core";
import { playerAverage } from "../../../game/skillsAverage";
import { Player } from "../../../types/Player";
import { Icons } from "../../../utils/icons";
import { PlayerAvatar } from "../../../Components/PlayerAvatar";

interface PlayerBenchCardProps {
  player: Player;
  isPlaced: boolean;
}

export const PlayerBenchCard = ({ player, isPlaced }: PlayerBenchCardProps) => {
  const disabled = player.injured || !player.available;
  const avg = playerAverage(player);

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `bench:${player.id}`,
    data: { type: "bench", playerId: player.id },
    disabled: disabled || isPlaced,
  });

  return (
    <div
      ref={setNodeRef}
      {...(disabled || isPlaced ? {} : listeners)}
      {...attributes}
      className={`flex flex-col items-center justify-center gap-1 h-full px-2 py-2.5 rounded-lg border text-center select-none touch-none
        ${isDragging ? "opacity-0" : ""}
        ${
          disabled
            ? "bg-red-500/20 border-red-500/30 cursor-not-allowed"
            : isPlaced
              ? "opacity-40 border-white/8 bg-white/2 cursor-default"
              : "bg-white/2 border-white/[0.07] cursor-grab active:cursor-grabbing hover:bg-white/5 hover:border-white/15"
        }
      `}
    >
      <PlayerAvatar seed={player.id} size={48} />
      <span className="text-[10px] font-medium text-highlights2">
        {player.inCourtPosition}
      </span>
      <span className="text-[11px] text-text1 truncate w-full">
        {player.firstName} {player.lastName}
      </span>
      {disabled && (
        <span className="flex items-center gap-1 text-[9px] text-red-400 [&_svg]:w-3 [&_svg]:h-3">
          {player.injured ? Icons.MedicalSymbol : Icons.AcademicWarning}
          {player.injured ? "Lesionado" : "Inelegível"}
        </span>
      )}
      <span className="text-[12px] text-text2">{avg}</span>
    </div>
  );
};
