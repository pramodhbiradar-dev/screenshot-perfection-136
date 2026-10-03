import { useCallback, useEffect, useState } from "react";

export function usePlayer<T>(frames: T[], delay: number) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => { setIndex(0); setPlaying(false); }, [frames]);

  useEffect(() => {
    if (!playing) return;
    if (index >= frames.length - 1) { setPlaying(false); return; }
    const t = setTimeout(() => setIndex((i) => Math.min(i + 1, frames.length - 1)), delay);
    return () => clearTimeout(t);
  }, [playing, index, frames.length, delay]);

  const step = useCallback(() => { setPlaying(false); setIndex((i) => Math.min(i + 1, frames.length - 1)); }, [frames.length]);
  const reset = useCallback(() => { setPlaying(false); setIndex(0); }, []);

  return {
    frame: frames[Math.min(index, frames.length - 1)] as T,
    index,
    total: frames.length,
    playing,
    done: index >= frames.length - 1,
    started: index > 0,
    play: () => setPlaying(true),
    pause: () => setPlaying(false),
    step,
    reset,
  };
}

export const SPEEDS = { Slow: 900, Normal: 400, Fast: 90 } as const;
