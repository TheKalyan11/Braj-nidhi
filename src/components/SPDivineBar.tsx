"use client";

/**
 * Srila Prabhupada top bar — sits ABOVE the main header.
 * On scroll: slides up and disappears. Header then floats up as normal.
 */

import { useState, useEffect } from "react";

const BAR_HEIGHT = 80; // px — keep in sync with globals.css header top value

export default function SPDivineBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
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
        height: `${BAR_HEIGHT}px`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1050,
        pointerEvents: "none",
        /* Slide the whole bar upward on scroll */
        transform: scrolled ? `translateY(-${BAR_HEIGHT}px)` : "translateY(0)",
        transition: "transform 0.38s cubic-bezier(0.4,0,0.2,1)",
        /* Subtle warm gradient so logo has a readable background on all pages */
        background: "linear-gradient(180deg, rgba(20,10,5,0.55) 0%, rgba(20,10,5,0.0) 100%)",
      }}
    >
      <img
        src="/sp logo.png"
        alt="His Divine Grace Srila Prabhupada"
        style={{
          height: "96px",        // taller than bar so it peeks below into header
          width: "auto",
          objectFit: "contain",
          display: "block",
          filter: "drop-shadow(0 3px 12px rgba(0,0,0,0.30))",
          marginTop: "16px",     // push portrait downward so it overlaps header edge
        }}
      />
    </div>
  );
}
