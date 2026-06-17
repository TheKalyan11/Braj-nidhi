"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import BookNowButton from '@/components/BookNowButton';

export default function SharedHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* ── Srila Prabhupada Divine Bar ─────────────────────────────────────── */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1002,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          height: '88px',
          pointerEvents: 'none',
          opacity: scrolled ? 0 : 1,
          transform: scrolled ? 'translateY(-18px) scale(0.95)' : 'translateY(0) scale(1)',
          transition: 'opacity 0.35s ease, transform 0.35s ease',
          background: scrolled
            ? 'transparent'
            : 'linear-gradient(180deg, rgba(255,252,245,0.92) 60%, transparent 100%)',
        }}
      >
        <img
          src="/sp logo.png"
          alt="His Divine Grace Srila Prabhupada"
          style={{
            height: '108px',
            width: 'auto',
            objectFit: 'contain',
            filter: 'drop-shadow(0 4px 14px rgba(139,0,0,0.18))',
            marginTop: '-4px',
          }}
        />
      </div>

      {/* ── Main Header — pushed below SP bar when visible ───────────────────── */}
      <header
        id="main-header"
        className={scrolled ? 'scrolled' : ''}
        style={{ top: scrolled ? undefined : '82px' }}
      >
        <Link href="/" className="logo" style={{ textDecoration: 'none' }}>
          <img src="/Braj_nidhi_.png" alt="Braj Nidhi Logo" style={{ height: '60px', width: 'auto' }} />
        </Link>

        <nav>
          <ul>
            <li><a href="/guesthouse">Guesthouse</a></li>
            <li><a href="/weddings">Weddings</a></li>
            <li><a href="/corporate">Corporate</a></li>
            <li><a href="/braj-yatra">Braj Yatra</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>

        <div className="nav-btns">
          <BookNowButton href="/guesthouse#rooms-suites" />
        </div>

        {/* Mobile actions */}
        <div className="mobile-header-actions">
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mobile-menu-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center' }}>
                <img src="/Braj_nidhi_.png" alt="Braj Nidhi Logo" style={{ height: '45px', width: 'auto' }} />
              </Link>
              <button className="mobile-menu-close" onClick={() => setIsMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="mobile-nav-links">
              <ul>
                <li><a href="/guesthouse" onClick={() => setIsMobileMenuOpen(false)}>Guesthouse</a></li>
                <li><a href="/weddings"   onClick={() => setIsMobileMenuOpen(false)}>Weddings</a></li>
                <li><a href="/corporate" onClick={() => setIsMobileMenuOpen(false)}>Corporate</a></li>
                <li><a href="/braj-yatra" onClick={() => setIsMobileMenuOpen(false)}>Braj Yatra</a></li>
                <li><a href="/contact"   onClick={() => setIsMobileMenuOpen(false)}>Contact</a></li>
              </ul>
            </div>
            <div className="mobile-menu-footer">
              <BookNowButton
                href="/guesthouse#rooms-suites"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ display: 'block', textAlign: 'center', marginTop: '4px' }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
