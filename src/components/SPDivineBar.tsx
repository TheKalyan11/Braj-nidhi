"use client";

import { useState, useEffect } from "react";

export default function SPDivineBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        height: "88px",
        pointerEvents: "none",
        opacity: scrolled ? 0 : 1,
        transform: scrolled ? "translateY(-20px) scale(0.94)" : "translateY(0) scale(1)",
        transition: "opacity 0.35s ease, transform 0.35s ease",
        background: scrolled
          ? "transparent"
          : "linear-gradient(180deg, rgba(255,252,245,0.96) 55%, transparent 100%)",
      }}
    >
      <img
        src="/sp logo.png"
        alt="His Divine Grace Srila Prabhupada"
        style={{
          height: "110px",
          width: "auto",
          objectFit: "contain",
          filter: "drop-shadow(0 4px 16px rgba(139,0,0,0.20))",
          marginTop: "-3px",
        }}
      />
    </div>
  );
}
