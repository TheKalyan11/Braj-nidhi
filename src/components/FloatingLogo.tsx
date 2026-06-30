"use client";

import { useState } from "react";

export default function FloatingLogo() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "90px",
        right: "16px",
        zIndex: 9998,
      }}
    >
      <img loading="lazy" decoding="async" src="/LOGO1.jpg"
        alt="Vrindavan Chandrodaya Mandir"
        style={{
          height: "65px",
          width: "auto",
          display: "block",
          borderRadius: "10px",
        }} />
      {/* Dismiss button */}
      <button
        onClick={() => setVisible(false)}
        aria-label="Close"
        style={{
          position: "absolute",
          top: "-10px",
          right: "-10px",
          width: "26px",
          height: "26px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #ef4444, #b91c1c)",
          border: "2.5px solid white",
          color: "white",
          fontSize: "13px",
          fontWeight: "700",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px rgba(239,68,68,0.5)",
          lineHeight: 1,
          padding: 0,
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.15)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 12px rgba(239,68,68,0.7)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 8px rgba(239,68,68,0.5)";
        }}
      >
        ✕
      </button>
    </div>
  );
}
