"use client";
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  BedDouble, Users, Calendar, Star, MapPin, ShieldCheck, Wifi, Coffee,
  Leaf, ArrowRight, Check, Clock, Info, Menu, X, ChevronDown, ChevronUp, Moon
} from 'lucide-react';
import LoginModal from '@/components/LoginModal';
import BookNowButton from '@/components/BookNowButton';
import LoginJoinButton from '@/components/LoginJoinButton';

interface RoomOption {
  key: 'deluxe2' | 'deluxe3' | 'deluxe4';
  title: string;
  shortName: string;
  beds: string;
  maxGuests: number;
  pricePerNight: number;
  mrpPrice: number;
  image: string;
  sqft: string;
  amenities: string[];
  tag: string;
}

const ROOMS: RoomOption[] = [
  {
    key: 'deluxe2',
    title: 'Deluxe 2 – Twin Bedded Room',
    shortName: 'Deluxe 2',
    beds: 'Twin Beds',
    maxGuests: 2,
    pricePerNight: 3500,
    mrpPrice: 5000,
    image: '/DSC05818-HDR.webp',
    sqft: '280 sq.ft',
    amenities: ['Free High-Speed Wi-Fi', 'Tea & Coffee Maker', 'Air Conditioning', 'Sattvic Dining Access'],
    tag: 'Best Value'
  },
  {
    key: 'deluxe3',
    title: 'Deluxe 3 – 3 Bedded Room',
    shortName: 'Deluxe 3',
    beds: '3 Single Beds',
    maxGuests: 3,
    pricePerNight: 4500,
    mrpPrice: 6500,
    image: '/d3.webp',
    sqft: '340 sq.ft',
    amenities: ['Free High-Speed Wi-Fi', 'Tea & Coffee Maker', 'Living Lounge Area', 'Sattvic Dining Access'],
    tag: 'Most Popular'
  },
  {
    key: 'deluxe4',
    title: 'Deluxe 4 – 4 Bedded Room',
    shortName: 'Deluxe 4',
    beds: '4-Poster Beds',
    maxGuests: 4,
    pricePerNight: 4999,
    mrpPrice: 7200,
    image: '/DSC05963-HDR.webp',
    sqft: '420 sq.ft',
    amenities: ['Free High-Speed Wi-Fi', 'Tea & Coffee Maker', 'Bathtub Suite', 'Sattvic Dining Access'],
    tag: 'Premium Suite'
  }
];

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${d} ${months[m - 1]} '${String(y).slice(-2)}`;
  } catch { return dateStr; }
}

function getNights(checkIn: string, checkOut: string): number {
  try {
    const diff = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000);
    return diff > 0 ? diff : 1;
  } catch { return 1; }
}

function RoomsComboContent() {
  const searchParams = useSearchParams();
  const checkIn  = searchParams.get('checkin')  || '';
  const checkOut = searchParams.get('checkout') || '';
  const roomsCount = Math.max(1, parseInt(searchParams.get('rooms')    || '1'));
  const adults     = Math.max(1, parseInt(searchParams.get('adults')   || '2'));
  const children   = Math.max(0, parseInt(searchParams.get('children') || '0'));
  const guestsStr  = searchParams.get('guests') || `${adults} Adults`;
  const nights     = getNights(checkIn, checkOut);
  const totalGuests = adults + children;

  const [selectedRoom, setSelectedRoom] = useState<RoomOption | null>(null);
  const [expandedRoom, setExpandedRoom] = useState<string | null>('deluxe2');
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    setUserName(localStorage.getItem('userName') || '');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    window.location.reload();
  };

  const getUserInitials = (name: string) => {
    const parts = name.split(' ');
    return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : (parts[0]?.[0] || 'U').toUpperCase();
  };

  const bookingUrl = (room: RoomOption) =>
    `/booking?roomType=${room.key}&checkin=${checkIn}&checkout=${checkOut}&rooms=${roomsCount}&adults=${adults}&children=${children}&guests=${encodeURIComponent(guestsStr)}`;

  return (
    <div className="rcp">
      <style dangerouslySetInnerHTML={{ __html: `
        *{box-sizing:border-box;}
        .rcp{background:#f4f0e8;min-height:100vh;font-family:'Outfit',sans-serif;color:#111;padding-top:88px;}
        .rcp *{font-family:'Outfit',sans-serif;}
        .rcp h1,.rcp h2,.rcp h3,.rcp h4{font-family:'Bebas Neue',cursive!important;font-weight:400!important;letter-spacing:.5px;color:#111;}

        /* ── Header: solid white when not scrolled, normal pill when scrolled ── */
        .rcp #main-header:not(.scrolled) {
          background: rgba(255,255,255,0.97);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(229,231,235,0.85);
        }
        /* Restore Bebas Neue for nav links (overridden by .rcp * rule) */
        .rcp #main-header nav ul li a {
          font-family: 'Bebas Neue', cursive !important;
          font-size: 1.25rem !important;
          font-weight: 400 !important;
          letter-spacing: 0.05em !important;
          color: #1a1a1a !important;
        }
        .rcp #main-header nav ul li a:hover { color: #C89B3C !important; }
        .rcp #main-header:not(.scrolled) .mobile-menu-btn { color: #1a1a1a !important; }
        /* Login/Join button: visible on white header background */
        .rcp #main-header:not(.scrolled) .btn-login {
          color: #111 !important;
          border: 1px solid rgba(0,0,0,0.22) !important;
          background: rgba(0,0,0,0.04) !important;
          box-shadow: none !important;
        }

        /* ── Breadcrumb ── */
        .rcp-crumb{background:#fff;border-bottom:1px solid #e5e7eb;padding:12px 5%;display:flex;align-items:center;gap:8px;font-size:15px;color:#6B7280;}
        .rcp-crumb a{color:#6B7280;text-decoration:none;}.rcp-crumb a:hover{color:#C89B3C;}
        .rcp-crumb .cur{color:#C89B3C;font-weight:600;}

        /* ── Search summary strip ── */
        .rcp-search-strip{background:#fff;border-bottom:1px solid #e5e7eb;padding:18px 5%;display:flex;align-items:center;gap:28px;flex-wrap:wrap;}
        .rcp-strip-item{display:flex;align-items:center;gap:9px;font-size:16px;color:#374151;}
        .rcp-strip-item svg{color:#C89B3C;flex-shrink:0;}
        .rcp-strip-item strong{color:#111;font-weight:700;}
        .rcp-strip-sep{width:1px;height:24px;background:#e5e7eb;}
        .rcp-strip-edit{font-size:15px;color:#1d6de5;font-weight:600;cursor:pointer;text-decoration:none;margin-left:auto;}
        .rcp-strip-edit:hover{text-decoration:underline;}

        /* ── Body ── */
        .rcp-body{max-width:1440px;margin:0 auto;padding:30px 28px 80px;display:grid;grid-template-columns:1fr 420px;gap:28px;align-items:start;}

        /* ── Hotel card ── */
        .rcp-hotel-card{background:#fff;border-radius:18px;border:1px solid #e5e7eb;overflow:hidden;box-shadow:0 2px 14px rgba(0,0,0,.06);margin-bottom:24px;}
        .rcp-hotel-head{padding:26px 30px 20px;display:flex;align-items:flex-start;justify-content:space-between;gap:16px;}
        .rcp-hotel-name h1{font-size:34px;color:#111;margin:0 0 8px;}
        .rcp-hotel-stars{display:flex;align-items:center;gap:4px;margin-bottom:8px;}
        .rcp-hotel-loc{display:flex;align-items:center;gap:6px;font-size:15px;color:#6B7280;}
        .rcp-hotel-loc svg{color:#C89B3C;}
        .rcp-rating-box{display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0;}
        .rcp-score{width:52px;height:52px;background:linear-gradient(135deg,#1d6de5,#1557c0);border-radius:10px 10px 10px 0;display:flex;align-items:center;justify-content:center;color:#fff;font-size:20px;font-weight:800;}
        .rcp-rating-lbl{font-size:14px;font-weight:700;color:#1d6de5;}
        .rcp-rating-cnt{font-size:13px;color:#9CA3AF;}
        .rcp-photos{display:grid;grid-template-columns:1.7fr 1fr;grid-template-rows:250px 250px;gap:4px;margin:0 30px 30px;border-radius:14px;overflow:hidden;}
        .rcp-photo-main{grid-row:1/3;overflow:hidden;position:relative;}
        .rcp-photo-main img,.rcp-photo-thumb img{width:100%;height:100%;object-fit:cover;transition:transform .4s;}
        .rcp-photo-main:hover img,.rcp-photo-thumb:hover img{transform:scale(1.04);}
        .rcp-photo-thumb{overflow:hidden;position:relative;}
        .rcp-photo-pill{position:absolute;bottom:14px;right:14px;background:rgba(0,0,0,.65);color:#fff;font-size:13px;font-weight:600;padding:6px 14px;border-radius:18px;backdrop-filter:blur(6px);cursor:pointer;}

        /* ── Rooms section ── */
        .rcp-rooms-label{font-size:15px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:.6px;margin-bottom:18px;padding-bottom:12px;border-bottom:1px solid #e5e7eb;}

        /* ── Room card ── */
        .rcp-room-card{background:#fff;border:1.5px solid #e5e7eb;border-radius:16px;overflow:hidden;margin-bottom:18px;box-shadow:0 2px 10px rgba(0,0,0,.05);transition:border-color .25s,box-shadow .25s;}
        .rcp-room-card:hover{border-color:#C89B3C;box-shadow:0 8px 24px rgba(200,155,60,.12);}
        .rcp-room-card.selected{border-color:#1d6de5;box-shadow:0 6px 20px rgba(29,109,229,.14);}

        .rcp-room-header{display:flex;align-items:center;justify-content:space-between;padding:20px 26px;cursor:pointer;gap:16px;}
        .rcp-room-header-left{display:flex;align-items:center;gap:18px;}
        .rcp-room-thumb{width:100px;height:76px;border-radius:10px;overflow:hidden;flex-shrink:0;}
        .rcp-room-thumb img{width:100%;height:100%;object-fit:cover;}
        .rcp-room-name h3{font-size:21px;color:#111;margin:0 0 6px;}
        .rcp-room-meta{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
        .rcp-meta-pill{background:#f4f0e8;border-radius:20px;padding:4px 13px;font-size:13px;font-weight:600;color:#6B7280;}
        .rcp-tag{font-size:13px;font-weight:700;padding:4px 13px;border-radius:20px;}
        .rcp-tag.green{background:#dcfce7;color:#166534;}
        .rcp-tag.gold{background:#fef3c7;color:#92400e;}
        .rcp-tag.blue{background:#dbeafe;color:#1e40af;}
        .rcp-room-header-right{display:flex;align-items:center;gap:18px;flex-shrink:0;}
        .rcp-price-block{text-align:right;}
        .rcp-price-mrp{font-size:14px;color:#9CA3AF;text-decoration:line-through;}
        .rcp-price-main{font-size:26px;font-weight:800;color:#111;}
        .rcp-price-night{font-size:13px;color:#6B7280;}
        .rcp-price-save{font-size:13px;font-weight:700;color:#16a34a;margin-top:2px;}
        .rcp-chevron{color:#9CA3AF;transition:transform .3s;}
        .rcp-chevron.open{transform:rotate(180deg);}

        /* ── Room expanded body ── */
        .rcp-room-body{border-top:1px solid #f3f4f6;padding:26px;}
        .rcp-room-body-grid{display:grid;grid-template-columns:280px 1fr;gap:26px;align-items:start;}
        .rcp-room-img{width:100%;height:210px;border-radius:12px;overflow:hidden;}
        .rcp-room-img img{width:100%;height:100%;object-fit:cover;}
        .rcp-room-amenities{display:flex;flex-direction:column;gap:10px;margin-bottom:18px;}
        .rcp-amenity{display:flex;align-items:center;gap:10px;font-size:15px;color:#374151;}
        .rcp-amenity svg{color:#16a34a;flex-shrink:0;}
        .rcp-free-cancel{display:flex;align-items:center;gap:8px;font-size:15px;font-weight:600;color:#16a34a;margin-bottom:18px;}
        .rcp-free-cancel svg{flex-shrink:0;}
        .rcp-room-actions{display:flex;align-items:center;gap:14px;margin-top:6px;}
        .btn-select-room{padding:14px 34px;background:linear-gradient(135deg,#1d6de5,#1557c0);color:#fff;font-size:16px;font-weight:700;font-family:'Outfit',sans-serif;border:none;border-radius:10px;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;gap:9px;transition:all .25s;}
        .btn-select-room:hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(29,109,229,.32);}
        .rcp-room-card.selected .btn-select-room{background:linear-gradient(135deg,#16a34a,#15803d);}
        .rcp-room-card.selected .btn-select-room:hover{box-shadow:0 10px 24px rgba(22,163,74,.32);}
        .btn-view-details{padding:14px 24px;background:#fff;border:1.5px solid #e5e7eb;border-radius:10px;font-size:15px;font-weight:600;color:#374151;cursor:pointer;transition:all .2s;}
        .btn-view-details:hover{border-color:#C89B3C;color:#C89B3C;}

        /* ── Right sidebar ── */
        .rcp-sidebar{position:sticky;top:112px;}
        .rcp-side-card{background:#fff;border-radius:16px;border:1px solid #e5e7eb;box-shadow:0 2px 12px rgba(0,0,0,.06);padding:28px;margin-bottom:18px;}
        .rcp-side-card h4{font-family:'Bebas Neue',cursive!important;font-size:22px;color:#111;margin:0 0 20px;font-weight:400!important;letter-spacing:.4px;}

        .rcp-dates-row{display:flex;align-items:center;gap:12px;margin-bottom:16px;}
        .rcp-date-box{flex:1;background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:12px 14px;}
        .rcp-date-box .lbl{font-size:12px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px;}
        .rcp-date-box .val{font-size:16px;font-weight:800;color:#111;}
        .rcp-nights-box{background:#fef3c7;border:1px solid rgba(200,155,60,.3);border-radius:10px;padding:12px 14px;text-align:center;flex-shrink:0;}
        .rcp-nights-box .num{font-size:22px;font-weight:900;color:#C89B3C;}
        .rcp-nights-box .lbl{font-size:12px;color:#92400e;font-weight:600;}

        .rcp-guests-row{display:flex;align-items:center;gap:10px;padding:13px 16px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;margin-bottom:18px;}
        .rcp-guests-row svg{color:#C89B3C;}
        .rcp-guests-info .main{font-size:16px;font-weight:700;color:#111;}
        .rcp-guests-info .sub{font-size:13px;color:#6B7280;}

        .rcp-selected-summary{background:#f0f7ff;border:1.5px solid #bfdbfe;border-radius:12px;padding:18px;margin-bottom:18px;}
        .rcp-sel-label{font-size:13px;font-weight:700;color:#1d4ed8;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px;}
        .rcp-sel-name{font-size:17px;font-weight:800;color:#111;margin-bottom:5px;}
        .rcp-sel-price{font-size:26px;font-weight:900;color:#1d6de5;}
        .rcp-sel-sub{font-size:13px;color:#6B7280;margin-top:3px;}
        .rcp-sel-total{font-size:15px;color:#374151;margin-top:10px;padding-top:10px;border-top:1px solid #bfdbfe;}
        .rcp-sel-total strong{color:#111;}
        .btn-book-now{width:100%;padding:17px;background:linear-gradient(135deg,#1d6de5,#1557c0);color:#fff;font-size:17px;font-weight:700;font-family:'Outfit',sans-serif;border:none;border-radius:12px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:10px;text-decoration:none;transition:all .25s;margin-bottom:12px;}
        .btn-book-now:hover{transform:translateY(-2px);box-shadow:0 12px 30px rgba(29,109,229,.38);}
        .rcp-secure{display:flex;align-items:center;gap:7px;font-size:14px;color:#6B7280;justify-content:center;}
        .rcp-secure svg{color:#16a34a;}
        .rcp-no-select{text-align:center;padding:20px;font-size:15px;color:#9CA3AF;border:1.5px dashed #e5e7eb;border-radius:12px;margin-bottom:16px;}

        .rcp-policy-card{background:#fff;border-radius:16px;border:1px solid #e5e7eb;padding:22px 26px;}
        .rcp-policy-card h4{font-family:'Bebas Neue',cursive!important;font-size:20px;color:#111;margin:0 0 16px;font-weight:400!important;}
        .rcp-policy-item{display:flex;align-items:flex-start;gap:10px;margin-bottom:12px;font-size:15px;color:#374151;}
        .rcp-policy-item svg{color:#C89B3C;flex-shrink:0;margin-top:2px;}

        /* Responsive */
        @media(max-width:1100px){
          .rcp-body{grid-template-columns:1fr 380px;}
        }
        @media(max-width:900px){
          .rcp-body{grid-template-columns:1fr;}
          .rcp-sidebar{position:static;}
          .rcp-photos{grid-template-rows:220px 160px;}
        }
        @media(max-width:600px){
          .rcp-body{padding:16px 14px 50px;}
          .rcp-hotel-head{flex-direction:column;}
          .rcp-photos{grid-template-columns:1fr;grid-template-rows:260px;}
          .rcp-photo-thumb{display:none;}
          .rcp-photo-main{grid-row:1/2;}
          .rcp-room-body-grid{grid-template-columns:1fr;}
          .rcp-room-img{height:220px;}
          .rcp-search-strip{gap:14px;}
          /* Room card header — compact on mobile */
          .rcp-room-header{padding:12px 14px;gap:8px;}
          .rcp-room-header-left{gap:10px;}
          .rcp-room-thumb{width:70px;height:54px;}
          .rcp-room-name h3{font-size:15px;margin-bottom:4px;}
          .rcp-room-header-right{gap:8px;}
          .rcp-price-mrp{font-size:12px;}
          .rcp-price-main{font-size:20px;}
          .rcp-price-label{font-size:11px;}
          .rcp-discount{font-size:11px;}
          /* Action buttons */
          .rcp-room-actions{flex-direction:column;gap:8px;}
          .btn-select-room,.btn-view-details{width:100%;justify-content:center;padding:12px 16px;font-size:14px;}
          /* Amenities + body padding */
          .rcp-room-body{padding:14px;}
          .rcp-amenity-item{font-size:13px;}
        }
        @media(max-width:400px){
          .rcp-room-name h3{font-size:13px;}
          .rcp-price-main{font-size:18px;}
          .rcp-room-thumb{width:58px;height:46px;}
        }
      `}} />

      {/* Header */}
      <header id="main-header" className={scrolled ? 'scrolled' : ''}>
        <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/LOGO1.jpg" alt="Vrindavan Chandrodaya Mandir" style={{ height: '55px', width: 'auto', borderRadius: '6px', display: 'block' }} />
            <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.3)' }} />
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <img src="/Braj_nidhi_.png" alt="Braj Nidhi Logo" style={{ height: '55px', width: 'auto', display: 'block' }} />
            </Link>
            <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.3)' }} />
            <img src="/sp logo.png" alt="Srila Prabhupada" style={{ height: '60px', width: 'auto', display: 'block', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.2))' }} />
          </div>
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
          {isLoggedIn ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginRight: '10px' }}>
                <div className="user-info-text">
                  <span className="user-label">Braj Club Member</span>
                  <span className="user-name">{userName}</span>
                </div>
                <div className="user-profile-badge">{getUserInitials(userName)}</div>
              </div>
              <LoginJoinButton onClick={handleLogout} label="Logout" />
            </>
          ) : (
            <LoginJoinButton onClick={() => setIsLoginModalOpen(true)} />
          )}
          <BookNowButton href="/guesthouse#rooms-suites" />
        </div>
        <div className="mobile-header-actions">
          {isLoggedIn ? (
            <button onClick={handleLogout} className="mobile-logout-btn">Logout</button>
          ) : (
            <button onClick={() => setIsLoginModalOpen(true)} className="mobile-login-join">Login / Join</button>
          )}
          <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="mobile-menu-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <img src="/Braj_nidhi_.png" alt="Braj Nidhi Logo" style={{ height: '45px', width: 'auto' }} />
              <button className="mobile-menu-close" onClick={() => setIsMobileMenuOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="mobile-nav-links">
              <ul>
                <li><a href="/guesthouse" onClick={() => setIsMobileMenuOpen(false)}>Guesthouse</a></li>
                <li><a href="/weddings" onClick={() => setIsMobileMenuOpen(false)}>Weddings</a></li>
                <li><a href="/corporate" onClick={() => setIsMobileMenuOpen(false)}>Corporate</a></li>
                <li><a href="/braj-yatra" onClick={() => setIsMobileMenuOpen(false)}>Braj Yatra</a></li>
                <li><a href="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</a></li>
              </ul>
            </div>
            <div className="mobile-menu-footer">
              {isLoggedIn ? (
                <div className="mobile-user-profile">
                  <span className="user-label">Braj Club Member</span>
                  <span className="user-name" style={{ fontSize: '15px', fontWeight: '800', color: '#8b0000' }}>{userName}</span>
                  <LoginJoinButton onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} label="Logout" className="mobile-ljb" />
                </div>
              ) : (
                <LoginJoinButton onClick={() => { setIsLoginModalOpen(true); setIsMobileMenuOpen(false); }} label="Login / Create Account" className="mobile-ljb" />
              )}
              <BookNowButton href="/guesthouse#rooms-suites" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'block', textAlign: 'center', marginTop: '4px' }} />
            </div>
          </div>
        </div>
      )}

      {/* ── Breadcrumb ── */}
      <div className="rcp-crumb">
        <Link href="/">Home</Link>
        <span>›</span>
        <Link href="/guesthouse">Guesthouse</Link>
        <span>›</span>
        <span className="cur">Select Your Room</span>
      </div>

      {/* ── Search summary strip ── */}
      <div className="rcp-search-strip">
        <div className="rcp-strip-item">
          <Calendar size={15}/>
          <span><strong>{checkIn ? formatDate(checkIn) : '—'}</strong> → <strong>{checkOut ? formatDate(checkOut) : '—'}</strong></span>
        </div>
        <div className="rcp-strip-sep"/>
        <div className="rcp-strip-item">
          <Moon size={15}/>
          <span><strong>{nights}</strong> Night{nights > 1 ? 's' : ''}</span>
        </div>
        <div className="rcp-strip-sep"/>
        <div className="rcp-strip-item">
          <Users size={15}/>
          <span><strong>{roomsCount}</strong> Room{roomsCount > 1 ? 's' : ''}, <strong>{totalGuests}</strong> Guest{totalGuests > 1 ? 's' : ''}</span>
        </div>
        <Link href="/" className="rcp-strip-edit">Modify Search ›</Link>
      </div>

      {/* ── Body ── */}
      <div className="rcp-body">

        {/* ─── Left column ─── */}
        <div>

          {/* Hotel card */}
          <div className="rcp-hotel-card">
            <div className="rcp-hotel-head">
              <div className="rcp-hotel-name">
                <h1>Braj Nidhi Guesthouse</h1>
                <div className="rcp-hotel-stars">
                  {[1,2,3,4].map(i => <Star key={i} size={14} fill="#f59e0b" stroke="none"/>)}
                  <Star size={14} stroke="#f59e0b" fill="none"/>
                </div>
                <div className="rcp-hotel-loc">
                  <MapPin size={13}/>
                  Chattikara Road, Vrindavan · 0.7 km from Prem Mandir
                </div>
              </div>
              <div className="rcp-rating-box">
                <div className="rcp-score">4.8</div>
                <div className="rcp-rating-lbl">Excellent</div>
                <div className="rcp-rating-cnt">2,400+ ratings</div>
              </div>
            </div>
            <div className="rcp-photos">
              <div className="rcp-photo-main">
                <img src="/hero.webp" alt="Braj Nidhi main view"/>
              </div>
              <div className="rcp-photo-thumb">
                <img src="/DSC09652.webp" alt="Property view"/>
              </div>
              <div className="rcp-photo-thumb">
                <img src="/DSC05818-HDR.webp" alt="Room view"/>
                <span className="rcp-photo-pill">View All Photos</span>
              </div>
            </div>
          </div>

          {/* Rooms section */}
          <div className="rcp-rooms-label">Available Rooms & Suites — Select to Continue</div>

          {ROOMS.map((room) => {
            const discountPct = Math.round((1 - room.pricePerNight / room.mrpPrice) * 100);
            const isExpanded  = expandedRoom === room.key;
            const isSelected  = selectedRoom?.key === room.key;

            return (
              <div key={room.key} className={`rcp-room-card${isSelected ? ' selected' : ''}`}>

                {/* Collapsible header row */}
                <div className="rcp-room-header" onClick={() => setExpandedRoom(isExpanded ? null : room.key)}>
                  <div className="rcp-room-header-left">
                    <div className="rcp-room-thumb">
                      <img src={room.image} alt={room.shortName}/>
                    </div>
                    <div className="rcp-room-name">
                      <h3>{room.shortName}</h3>
                      <div className="rcp-room-meta">
                        <span className="rcp-meta-pill">{room.beds}</span>
                        <span className="rcp-meta-pill">{room.sqft}</span>
                        <span className="rcp-meta-pill">Up to {room.maxGuests} guests</span>
                        <span className={`rcp-tag ${room.key === 'deluxe2' ? 'green' : room.key === 'deluxe3' ? 'gold' : 'blue'}`}>
                          {room.tag}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="rcp-room-header-right">
                    <div className="rcp-price-block">
                      <div className="rcp-price-mrp">₹{room.mrpPrice.toLocaleString('en-IN')}</div>
                      <div className="rcp-price-main">₹{room.pricePerNight.toLocaleString('en-IN')}</div>
                      <div className="rcp-price-night">Per Room / Night</div>
                      <div className="rcp-price-save">{discountPct}% off MRP</div>
                    </div>
                    <div className={`rcp-chevron${isExpanded ? ' open' : ''}`}>
                      {isExpanded ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                    </div>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="rcp-room-body">
                    <div className="rcp-room-body-grid">
                      <div className="rcp-room-img">
                        <img src={room.image} alt={room.title}/>
                      </div>
                      <div>
                        <div className="rcp-room-amenities">
                          {room.amenities.map((a, i) => (
                            <div key={i} className="rcp-amenity">
                              <Check size={14}/>
                              {a}
                            </div>
                          ))}
                        </div>
                        <div className="rcp-free-cancel">
                          <ShieldCheck size={15}/>
                          Free Cancellation up to 48 hrs before check-in
                        </div>
                        <div className="rcp-room-actions">
                          <button
                            className="btn-select-room"
                            onClick={() => {
                              setSelectedRoom(room);
                              document.getElementById('rcp-sidebar-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }}
                          >
                            {selectedRoom?.key === room.key ? <><Check size={15}/> Selected</> : <>Select Room <ArrowRight size={15}/></>}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Property info strip */}
          <div style={{background:'#fff',borderRadius:'12px',padding:'14px 18px',border:'1px solid #e5e7eb',display:'flex',alignItems:'center',gap:'9px',fontSize:'13px',color:'#374151',marginTop:'6px'}}>
            <Clock size={14} style={{color:'#C89B3C',flexShrink:0}}/>
            <span><strong style={{color:'#111'}}>Check-in:</strong> 2:00 PM &nbsp;·&nbsp; <strong style={{color:'#111'}}>Check-out:</strong> 11:00 AM &nbsp;·&nbsp; <Leaf size={12} style={{color:'#16a34a',display:'inline',verticalAlign:'middle'}}/> Pure Sattvic Vegetarian Property</span>
          </div>
        </div>

        {/* ─── Right sidebar ─── */}
        <div className="rcp-sidebar">
          <div className="rcp-side-card" id="rcp-sidebar-card">
            <h4>Your Stay Details</h4>

            {/* Dates */}
            <div className="rcp-dates-row">
              <div className="rcp-date-box">
                <div className="lbl">Check-in</div>
                <div className="val">{checkIn ? formatDate(checkIn) : '—'}</div>
              </div>
              <div className="rcp-nights-box">
                <div className="num">{nights}</div>
                <div className="lbl">Night{nights>1?'s':''}</div>
              </div>
              <div className="rcp-date-box">
                <div className="lbl">Check-out</div>
                <div className="val">{checkOut ? formatDate(checkOut) : '—'}</div>
              </div>
            </div>

            {/* Guests */}
            <div className="rcp-guests-row">
              <Users size={16}/>
              <div className="rcp-guests-info">
                <div className="main">{roomsCount} Room{roomsCount>1?'s':''}, {totalGuests} Guest{totalGuests>1?'s':''}</div>
                <div className="sub">Braj Nidhi Guesthouse, Vrindavan</div>
              </div>
            </div>

            {/* Selected room or prompt */}
            {selectedRoom ? (
              <div className="rcp-selected-summary">
                <div className="rcp-sel-label">Selected Room</div>
                <div className="rcp-sel-name">{selectedRoom.title}</div>
                <div className="rcp-sel-price">₹{selectedRoom.pricePerNight.toLocaleString('en-IN')}</div>
                <div className="rcp-sel-sub">Per room / night (excl. taxes)</div>
                <div className="rcp-sel-total">
                  Total for {nights} night{nights>1?'s':''} × {roomsCount} room{roomsCount>1?'s':''}:{' '}
                  <strong>₹{(selectedRoom.pricePerNight * nights * roomsCount).toLocaleString('en-IN')}</strong>
                  <span style={{fontSize:'11px',color:'#9CA3AF',marginLeft:'4px'}}>+ taxes</span>
                </div>
              </div>
            ) : (
              <div className="rcp-no-select">
                ← Select a room to see pricing &amp; proceed
              </div>
            )}

            {selectedRoom ? (
              <Link href={bookingUrl(selectedRoom)} className="btn-book-now">
                Proceed to Book <ArrowRight size={16}/>
              </Link>
            ) : (
              <div style={{width:'100%',padding:'15px',background:'#e5e7eb',color:'#9CA3AF',fontSize:'15px',fontWeight:700,borderRadius:'10px',textAlign:'center',marginBottom:'10px',cursor:'not-allowed'}}>
                Proceed to Book
              </div>
            )}
            <div className="rcp-secure">
              <ShieldCheck size={13}/>
              Secure checkout · Instant confirmation
            </div>
          </div>

          {/* Policies */}
          <div className="rcp-policy-card">
            <h4>Property Policies</h4>
            <div className="rcp-policy-item"><Clock size={14}/><span>Check-in 2:00 PM · Check-out 11:00 AM</span></div>
            <div className="rcp-policy-item"><Leaf size={14}/><span>Pure Sattvic vegetarian — no meat, alcohol or tobacco</span></div>
            <div className="rcp-policy-item"><ShieldCheck size={14}/><span>Free cancellation up to 48 hrs before arrival</span></div>
            <div className="rcp-policy-item"><Wifi size={14}/><span>Complimentary high-speed Wi-Fi in all rooms</span></div>
            <div className="rcp-policy-item"><Info size={14}/><span>Prices inclusive of 12% GST</span></div>
          </div>
        </div>

      </div>

      {isLoginModalOpen && (
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onLoginSuccess={(name) => { setIsLoggedIn(true); setUserName(name); setIsLoginModalOpen(false); }}
        />
      )}
    </div>
  );
}

export default function RoomsComboPage() {
  return (
    <Suspense fallback={
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#f4f0e8',fontFamily:'Outfit,sans-serif'}}>
        <div style={{textAlign:'center',color:'#C89B3C'}}>
          <div style={{fontSize:28,marginBottom:10}}>✦</div>
          <div style={{fontWeight:700}}>Finding available rooms…</div>
        </div>
      </div>
    }>
      <RoomsComboContent/>
    </Suspense>
  );
}
