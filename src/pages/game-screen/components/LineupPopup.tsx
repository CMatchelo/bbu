import { useEffect, useRef } from "react";
import { PlayerSelection } from "../../team-selection/components/PlayersSelection";
import { PlayTypeSelection } from "../../team-selection/components/PlayTypeSelection";
import { MIN_STARTERS } from "../../../constants/game.constants";
import { PlayerGameStats } from "../../../types/PlayerGameStats";

interface LineupPopupProps {
  isOpen: boolean;
  canClose: boolean;
  onClose: () => void;
  playerStats?: Record<string, PlayerGameStats>;
}

export function LineupPopup({ isOpen, canClose, onClose, playerStats }: LineupPopupProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus the close button when popup opens, for keyboard accessibility
  useEffect(() => {
    if (isOpen && canClose) {
      closeButtonRef.current?.focus();
    }
  }, [isOpen, canClose]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && canClose) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, canClose, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Lineup selection"
      className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20"
    >
      <div className="h-11/12 w-1/2 max-h-170 flex flex-col gap-4 items-center p-4 rounded-xl shadow-2xl bg-mainbgdark">
        <PlayTypeSelection />
        <PlayerSelection playerStats={playerStats} />

        <div className="flex flex-col items-center gap-1 w-full">
          <button
            ref={closeButtonRef}
            onClick={onClose}
            disabled={!canClose}
            aria-disabled={!canClose}
            className="
              bg-highlights2 text-gray-700
              p-2 rounded-2xl
              hover:bg-highlights2light
              transition-colors duration-300 ease-out
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            Return to game
          </button>

          {!canClose && (
            <p className="text-xs text-red-400 mt-1" role="alert">
              Select at least {MIN_STARTERS} players to continue.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
