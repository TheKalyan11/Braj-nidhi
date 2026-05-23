"use client";

import React, { useState, useRef } from "react";
import { BRAJ_NIDHI_KNOWLEDGE } from "@/lib/aiKnowledge";
import { TextWidget } from "@livechat/widget-react";

export default function FloatingWidgets() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        if (audio.readyState < 2) {
          audio.load();
        }
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn("Primary audio source failed, trying fallback:", err);
        audio.src = "/hare-krishna-original.mp3";
        audio.load();
        try {
          await audio.play();
          setIsPlaying(true);
        } catch (fallbackErr) {
          console.error("Fallback audio also failed:", fallbackErr);
          setIsPlaying(false);
        }
      }
    }
  };

  const handleAudioEnd = () => setIsPlaying(false);
  const handleAudioPause = () => setIsPlaying(false);
  const handleAudioPlay = () => setIsPlaying(true);

  return (
    <>
      {/* LiveChat widget integration */}
      <TextWidget organizationId="d660a390-44db-41ba-88da-1c8924abb9bb" />

      {/* Left Floating Social Stack: Instagram (top) → WhatsApp (middle) → Music (bottom) */}
      <div className="float-social-stack">
        <a
          href="https://www.instagram.com/braj.nidhi_/"
          target="_blank"
          rel="noopener noreferrer"
          className="float-btn float-instagram"
          title="Follow us on Instagram"
        >
          <i className="fab fa-instagram"></i>
        </a>
        <a
          href="#"
          className="float-btn float-whatsapp"
          title="WhatsApp Chat (Coming Soon)"
        >
          <i className="fab fa-whatsapp"></i>
        </a>
      </div>

      {/* Music Player — Hare Krishna Mahamantra */}
      <div className="premium-music-player" id="musicPlayer">
        <div className="player-glass" title="Hare Krishna Mahamantra">
          <button
            className={`play-btn ${isPlaying ? "playing" : ""}`}
            onClick={toggleMusic}
          >
            <i className={`fas ${isPlaying ? "fa-pause" : "fa-play"}`}></i>
          </button>
          <div className="liquid-shine"></div>
        </div>
        <audio
          ref={audioRef}
          id="bgMusic"
          loop
          preload="auto"
          onEnded={handleAudioEnd}
          onPause={handleAudioPause}
          onPlay={handleAudioPlay}
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
      </div>
    </>
  );
}