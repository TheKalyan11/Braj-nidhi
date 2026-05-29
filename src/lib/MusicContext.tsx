"use client";

import { createContext, useContext, useRef, useState, useEffect, useCallback } from "react";

interface MusicContextValue {
  isPlaying: boolean;
  togglePlay: () => void;
}

const MusicContext = createContext<MusicContextValue>({
  isPlaying: false,
  togglePlay: () => {},
});

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
    }
  }, [isPlaying]);

  return (
    <MusicContext.Provider value={{ isPlaying, togglePlay }}>
      {/* Hidden audio element — lives in the layout so it never unmounts on page navigation */}
      <audio
        ref={audioRef}
        src="/hare-krishna-original.mp3"
        loop
        preload="auto"
        style={{ display: "none" }}
      />
      {children}
    </MusicContext.Provider>
  );
}

export const useMusic = () => useContext(MusicContext);
