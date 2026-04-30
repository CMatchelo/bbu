import { useState, useCallback } from "react";
import { useAppSelector } from "../../../hooks/useAppDispatch";
import { RootState } from "../../../store";
import { MIN_STARTERS } from "../../../constants/game.constants";

interface UseLineupPopupReturn {
  isOpen: boolean;
  canClose: boolean;
  open: () => void;
  close: () => void;
}

export function useLineupPopup(): UseLineupPopupReturn {
  const [isOpen, setIsOpen] = useState(false);

  const starters = useAppSelector(
    (state: RootState) => state.gameSettings.starters,
  );

  const canClose = starters.length >= MIN_STARTERS;

  const open = useCallback(() => setIsOpen(true), []);

  const close = useCallback(() => {
    if (!canClose) return;
    setIsOpen(false);
  }, [canClose]);

  return { isOpen, canClose, open, close };
}
