import { useEffect, useRef } from "react";
import { Howl } from "howler";
import { useAudio } from "../Context/AudioContext";

const IN_GAME_TRACKS = [
  "/audio/inGame/inGame02_crowd01.m4a",
  "/audio/inGame/inGame03_crowd02.m4a.m4a",
  "/audio/inGame/inGame04_crowd03.m4a",
];

const FADE_MS = 2500;
const TARGET_VOLUME = 0.25;

export function useInGameMusic() {
  const { isAudioOn } = useAudio();
  const currentRef = useRef<Howl | null>(null);
  const activeRef = useRef(false);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isAudioOn) {
      activeRef.current = false;
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      if (currentRef.current) {
        const h = currentRef.current;
        h.fade(h.volume() as number, 0, FADE_MS);
        setTimeout(() => { h.stop(); h.unload(); }, FADE_MS);
        currentRef.current = null;
      }
      return;
    }

    activeRef.current = true;
    const trackIndex = Math.floor(Math.random() * IN_GAME_TRACKS.length);

    const playNext = (index: number) => {
      if (!activeRef.current) return;

      const howl = new Howl({
        src: [IN_GAME_TRACKS[index]],
        format: ["m4a"],
        html5: true,
        volume: 0,
        onload: () => {
          if (!activeRef.current) return;

          // Fade in
          howl.fade(0, TARGET_VOLUME, FADE_MS);

          // Schedule crossfade before track ends
          const durationMs = howl.duration() * 1000;
          const crossfadeAt = Math.max(0, durationMs - FADE_MS);

          fadeTimerRef.current = setTimeout(() => {
            if (!activeRef.current || currentRef.current !== howl) return;
            howl.fade(TARGET_VOLUME, 0, FADE_MS);
            const nextIndex = (index + 1) % IN_GAME_TRACKS.length;
            playNext(nextIndex);
          }, crossfadeAt);
        },
        onloaderror: (_id, err) => console.warn("Audio load error:", err),
      });

      currentRef.current = howl;
      howl.play();
    };

    playNext(trackIndex);

    return () => {
      activeRef.current = false;
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      if (currentRef.current) {
        const h = currentRef.current;
        h.fade(h.volume() as number, 0, FADE_MS);
        setTimeout(() => { h.stop(); h.unload(); }, FADE_MS);
        currentRef.current = null;
      }
    };
  }, [isAudioOn]);
}
