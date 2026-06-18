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
        id="bgMusic"
        loop
        preload="auto"
        style={{ display: "none" }}
      >
        <source src="/hare-krishna-original.mp3" type="audio/mpeg" />
        <source
          src="https://ia601402.us.archive.org/19/items/melodic-hare-krishna/HareKrishnaMahamantra.mp3"
          type="audio/mpeg"
        />
        <source
          src="https://cdn.pixabay.com/audio/2022/02/22/audio_d0a13e6912.mp3"
          type="audio/mpeg"
        />
      </audio>
      {children}
    </MusicContext.Provider>
  );
}

export const useMusic = () => useContext(MusicContext);
