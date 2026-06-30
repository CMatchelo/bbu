import { Player } from "../../../types/Player";
import { COURT_SLOTS } from "./courtSlots";
import { CourtSlot } from "./CourtSlot";

interface CourtImageProps {
  slotted: (Player | null)[];
}

export const CourtImage = ({ slotted }: CourtImageProps) => {
  return (
    <div className="relative w-full aspect-21/16 rounded-xl overflow-hidden border border-highlights1/15">
      <img
        src="/halfCourtTopDown.png"
        alt="Meia quadra"
        className="w-full h-full object-cover block"
        draggable={false}
      />
      {COURT_SLOTS.map((slot, index) => (
        <CourtSlot
          key={slot.position}
          index={index}
          position={slot.position}
          x={slot.x}
          y={slot.y}
          player={slotted[index] ?? null}
        />
      ))}
    </div>
  );
};
