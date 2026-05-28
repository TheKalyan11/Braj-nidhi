"use client";
import React from 'react';

interface BookNowButtonProps {
  href?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  className?: string;
  label?: string;
}

export default function BookNowButton({
  href = '/guesthouse#rooms-suites',
  onClick,
  style,
  className = '',
  label = 'Book Now',
}: BookNowButtonProps) {
  return (
    <>
      <style>{`
        .bnb-btn {
          all: unset;
          position: relative;
          display: inline-flex;
          height: 3.2rem;
          align-items: center;
          border-radius: 9999px;
          padding-left: 1.8rem;
          padding-right: 1.8rem;
          font-family: 'Outfit', 'Segoe UI', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: #1d1d1f;
          letter-spacing: 0.01em;
          cursor: pointer;
          text-decoration: none;
          white-space: nowrap;
          box-sizing: border-box;
        }
        .bnb-bg {
          overflow: hidden;
          border-radius: 9999px;
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          background-color: rgba(255, 208, 116);
          border: 2px solid rgba(255, 208, 116);
          transform: scale(1);
          transition: transform 1.8s cubic-bezier(0.19, 1, 0.22, 1);
          display: block;
        }
        .bnb-layers {
          display: block;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: -60%;
          aspect-ratio: 1 / 1;
          width: max(200%, 10rem);
        }
        .bnb-layer {
          border-radius: 9999px;
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          transform: scale(0);
          display: block;
        }
        .bnb-layer-1 { background-color: rgba(163, 116, 255); }
        .bnb-layer-2 { background-color: rgba(23, 241, 209); }
        .bnb-layer-3 { background-color: rgba(255, 208, 116); }

        .bnb-inner {
          pointer-events: none;
          display: block;
          position: relative;
        }
        .bnb-static,
        .bnb-hover {
          pointer-events: none;
          display: block;
        }
        .bnb-hover {
          position: absolute;
          top: 0; left: 0;
          opacity: 0;
          transform: translateY(70%);
        }

        /* Hover transitions */
        .bnb-btn:hover .bnb-static {
          opacity: 0;
          transform: translateY(-70%);
          transition: transform 1.4s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.3s linear;
        }
        .bnb-btn:hover .bnb-hover {
          opacity: 1;
          transform: translateY(0);
          transition: transform 1.4s cubic-bezier(0.19, 1, 0.22, 1), opacity 1.4s cubic-bezier(0.19, 1, 0.22, 1);
        }
        .bnb-btn:hover .bnb-layer {
          transition: transform 1.3s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.3s linear;
        }
        .bnb-btn:hover .bnb-layer-1 { transform: scale(1); }
        .bnb-btn:hover .bnb-layer-2 { transform: scale(1); transition-delay: 0.1s; }
        .bnb-btn:hover .bnb-layer-3 { transform: scale(1); transition-delay: 0.2s; }
      `}</style>

      <a
        href={href}
        onClick={onClick}
        className={`bnb-btn ${className}`.trim()}
        style={style}
      >
        <span className="bnb-bg">
          <span className="bnb-layers">
            <span className="bnb-layer bnb-layer-1" />
            <span className="bnb-layer bnb-layer-2" />
            <span className="bnb-layer bnb-layer-3" />
          </span>
        </span>
        <span className="bnb-inner">
          <span className="bnb-static">{label}</span>
          <span className="bnb-hover">{label} →</span>
        </span>
      </a>
    </>
  );
}
