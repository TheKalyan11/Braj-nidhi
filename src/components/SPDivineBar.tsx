"use client";

/**
 * Srila Prabhupada medallion — sits centered inside the fixed header bar,
 * exactly like the Vrindavan Chandrodaya Mandir website reference.
 *
 * • position: fixed, horizontally centered, vertically aligned to the header
 * • Shrinks slightly when the header scrolls into pill mode
 * • z-index 1050 — above header (1000) but below mobile drawer (9999)
 */

import { useState, useEffect } from "react";

export default function SPDivineBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        /* vertically: header has padding 20px top + ~60px logo → ~100px tall.
           We nudge up by 4px so the medallion peeks slightly above the bar. */
        top: scrolled ? "2px" : "0px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1050,
        pointerEvents: "none",
        transition: "top 0.35s ease, transform 0.35s ease",
      }}
    >
      <img
        src="/sp logo.png"
        alt="His Divine Grace Srila Prabhupada"
        style={{
          /* matches the reference — small enough to sit inside the header */
          height: scrolled ? "72px" : "90px",
          width: "auto",
          objectFit: "contain",
          display: "block",
          filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.18))",
          transition: "height 0.35s ease",
        }}
      />
    </div>
  );
}
