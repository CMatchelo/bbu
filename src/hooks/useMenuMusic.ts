import { useEffect, useRef } from "react";
import { Howl } from "howler";
import { useAudio } from "../Context/AudioContext";

const MENU_TRACKS = [
  "/audio/menu/menu01_song01.mp3",
  "/audio/menu/menu02_song02.mp3",
  "/audio/menu/menu03_song03.mp3",
];

export function useMenuMusic(enabled = true) {
  const { isAudioOn } = useAudio();
  const currentRef = useRef<Howl | null>(null);
  const activeRef = useRef(false);

  useEffect(() => {
    if (!isAudioOn || !enabled) {
      activeRef.current = false;
      currentRef.current?.stop();
      currentRef.current?.unload();
      currentRef.current = null;
      return;
    }

    activeRef.current = true;
    let trackIndex = Math.floor(Math.random() * MENU_TRACKS.length);

    const playNext = () => {
      if (!activeRef.current) return;
      const howl = new Howl({
        src: [MENU_TRACKS[trackIndex % MENU_TRACKS.length]],
        html5: true,
        volume: 0.1,
        onend: () => {
          trackIndex = (trackIndex + 1) % MENU_TRACKS.length;
          playNext();
        },
      });
      currentRef.current = howl;
      howl.play();
    };

    playNext();

    return () => {
      activeRef.current = false;
      currentRef.current?.stop();
      currentRef.current?.unload();
      currentRef.current = null;
    };
  }, [isAudioOn]);
}
