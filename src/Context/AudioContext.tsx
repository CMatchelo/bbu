import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Howl } from "howler";

interface AudioContextValue {
  isAudioOn: boolean;
  setAudioOn: (on: boolean) => void;
  playClick: () => void;
}

const AudioCtx = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isAudioOn, setIsAudioOnState] = useState<boolean>(() => {
    const stored = localStorage.getItem("audioOn");
    return stored === null ? true : stored === "true";
  });

  const clickRef = useRef<Howl | null>(null);

  useEffect(() => {
    clickRef.current = new Howl({ src: ["/audio/effects/click01.wav"], html5: true, volume: 0.8 });
    return () => { clickRef.current?.unload(); };
  }, []);

  const setAudioOn = (on: boolean) => {
    localStorage.setItem("audioOn", String(on));
    setIsAudioOnState(on);
  };

  const playClick = () => {
    if (!isAudioOn) return;
    clickRef.current?.play();
  };

  return (
    <AudioCtx.Provider value={{ isAudioOn, setAudioOn, playClick }}>
      {children}
    </AudioCtx.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useAudio must be used within AudioProvider");
  return ctx;
}
