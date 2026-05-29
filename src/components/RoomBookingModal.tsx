"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import PremiumDoubleCalendar from './PremiumDoubleCalendar';

interface RoomBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomType: 'deluxe2' | 'deluxe3' | 'deluxe4';
  roomName: string;
  price: number;
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function fmt(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function fmtDisplay(dateStr: string) {
  if (!dateStr) return '—';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const dows = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  return `${d} ${MONTHS[m-1].slice(0,3)} '${String(y).slice(2)} · ${dows[date.getDay()]}`;
}

export default function RoomBookingModal({ isOpen, onClose, roomType, roomName, price }: RoomBookingModalProps) {
  const router = useRouter();

  const todayDate = new Date(); todayDate.setHours(0,0,0,0);
  const tomorrowDate = new Date(todayDate); tomorrowDate.setDate(todayDate.getDate() + 1);

  const [checkIn, setCheckIn] = useState(fmt(todayDate));
  const [checkOut, setCheckOut] = useState(fmt(tomorrowDate));
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarInitialSelection, setCalendarInitialSelection] = useState<'in'|'out'>('in');

  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [showGuests, setShowGuests] = useState(false);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      const t = new Date(); t.setHours(0,0,0,0);
      const tm = new Date(t); tm.setDate(t.getDate() + 1);
      setCheckIn(fmt(t));
      setCheckOut(fmt(tm));
      setRooms(1); setAdults(2); setChildren(0);
      setIsCalendarOpen(false); setShowGuests(false);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handle = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const nights = Math.round(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000
  );
  const totalGuests = adults + children;
  const guestsLabel = `${rooms} Room${rooms>1?'s':''}, ${totalGuests} Guest${totalGuests>1?'s':''}`;

  const handleProceed = () => {
    const params = new URLSearchParams({
      roomType,
      checkin: checkIn,
      checkout: checkOut,
      rooms: String(rooms),
      adults: String(adults),
      children: String(children),
      guests: guestsLabel,
    });
    onClose();
    router.push(`/booking?${params.toString()}`);
  };

  const roomColors: Record<string, string> = {
    deluxe2: '#1a56db',
    deluxe3: '#7c3aed',
    deluxe4: '#C89B3C',
  };
  const accentColor = roomColors[roomType] || '#C89B3C';

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.55)',
          zIndex: 199998,
          backdropFilter: 'blur(2px)',
        }}
        onClick={() => { if (!isCalendarOpen && !showGuests) onClose(); }}
      />

      {/* Modal card */}
      <div style={{
        position: 'fixed',
        top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        zIndex: 199999,
        background: '#fff',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
        width: 'min(520px, calc(100vw - 24px))',
        maxHeight: '96vh',
        overflowY: 'auto',
        fontFamily: "'Outfit', sans-serif",
        animation: 'rbmFade 0.2s ease forwards',
      }}>
        <style>{`
          @keyframes rbmFade {
            from { opacity:0; transform:translate(-50%,-47%); }
            to   { opacity:1; transform:translate(-50%,-50%); }
          }
          .rbm-row {
            display:flex; align-items:center; justify-content:space-between;
            padding:18px 26px; cursor:pointer; transition:background 0.15s;
            position:relative;
          }
          .rbm-row:hover { background:#fafafa; }
          .rbm-row + .rbm-row { border-top:1px solid #f0f0f0; }
          .rbm-row-label {
            font-size:11px; font-weight:700; letter-spacing:1.3px;
            text-transform:uppercase; color:#9ca3af; margin-bottom:5px;
          }
          .rbm-row-value {
            font-size:17px; font-weight:700; color:#111;
          }
          .rbm-badge {
            font-size:11px; font-weight:600; color:#fff;
            padding:3px 10px; border-radius:20px; white-space:nowrap;
          }
          .rbm-counter-row {
            display:flex; align-items:center; justify-content:space-between;
            padding:0 0 16px;
          }
          .rbm-counter-label { font-size:15px; font-weight:600; color:#2c2520; }
          .rbm-counter-sub { font-size:12px; color:#9ca3af; margin-top:2px; }
          .rbm-counter-ctrl {
            display:flex; align-items:center;
            border:1px solid #efe8df; border-radius:12px;
            padding:7px 14px; gap:20px; width:120px; justify-content:space-between;
          }
          .rbm-counter-btn {
            background:none; border:none; font-size:20px; cursor:pointer;
            color:#2c2520; font-weight:500; padding:0; line-height:1;
          }
          .rbm-counter-btn:disabled { color:#ccc; cursor:default; }
          .rbm-counter-num { font-size:17px; font-weight:700; color:#2c2520; min-width:18px; text-align:center; }
        `}</style>

        {/* Header */}
        <div style={{
          padding: '26px 26px 20px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1.4px', textTransform: 'uppercase', color: '#9ca3af', marginBottom: 6 }}>
              Book Room
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#111', lineHeight: 1.2 }}>{roomName}</div>
            <div style={{ fontSize: 16, color: accentColor, fontWeight: 700, marginTop: 6 }}>
              ₹{price.toLocaleString()} <span style={{ fontSize: 13, color: '#9ca3af', fontWeight: 400 }}>per night</span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#f3f4f6', border: 'none', borderRadius: '50%',
              width: 32, height: 32, cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              fontSize: 16, color: '#374151',
            }}
          >✕</button>
        </div>

        {/* Date rows */}
        <div style={{ borderBottom: '1px solid #f0f0f0', position: 'relative' }}>
          {/* Check-In row */}
          <div
            className="rbm-row"
            style={{ borderLeft: `3px solid ${calendarInitialSelection==='in' && isCalendarOpen ? accentColor : 'transparent'}` }}
            onClick={() => {
              setShowGuests(false);
              if (isCalendarOpen && calendarInitialSelection === 'in') {
                setIsCalendarOpen(false);
              } else {
                setCalendarInitialSelection('in');
                setIsCalendarOpen(true);
              }
            }}
          >
            <div>
              <div className="rbm-row-label">Check-in</div>
              <div className="rbm-row-value">{fmtDisplay(checkIn)}</div>
            </div>
            <span className="rbm-badge" style={{ background: isCalendarOpen && calendarInitialSelection==='in' ? accentColor : '#f3f4f6', color: isCalendarOpen && calendarInitialSelection==='in' ? '#fff' : '#9ca3af' }}>
              {isCalendarOpen && calendarInitialSelection==='in' ? 'Selecting' : 'Tap to change'}
            </span>
          </div>

          {/* Check-Out row */}
          <div
            className="rbm-row"
            style={{ borderLeft: `3px solid ${calendarInitialSelection==='out' && isCalendarOpen ? accentColor : 'transparent'}` }}
            onClick={() => {
              setShowGuests(false);
              if (isCalendarOpen && calendarInitialSelection === 'out') {
                setIsCalendarOpen(false);
              } else {
                setCalendarInitialSelection('out');
                setIsCalendarOpen(true);
              }
            }}
          >
            <div>
              <div className="rbm-row-label">Check-out</div>
              <div className="rbm-row-value">{fmtDisplay(checkOut)}</div>
            </div>
            <span className="rbm-badge" style={{ background: isCalendarOpen && calendarInitialSelection==='out' ? accentColor : '#f3f4f6', color: isCalendarOpen && calendarInitialSelection==='out' ? '#fff' : '#9ca3af' }}>
              {isCalendarOpen && calendarInitialSelection==='out' ? 'Selecting' : 'Tap to change'}
            </span>
          </div>

          {/* Calendar — sits here, positions absolute above */}
          <div style={{ position: 'relative' }}>
            <PremiumDoubleCalendar
              checkIn={checkIn}
              checkOut={checkOut}
              isOpen={isCalendarOpen}
              initialSelection={calendarInitialSelection}
              onChange={(cin, cout) => { setCheckIn(cin); setCheckOut(cout); }}
              onClose={() => setIsCalendarOpen(false)}
              forceFixed
            />
          </div>
        </div>

        {/* Rooms & Guests row */}
        <div style={{ borderBottom: '1px solid #f0f0f0' }}>
          <div
            className="rbm-row"
            style={{ borderLeft: `3px solid ${showGuests ? accentColor : 'transparent'}` }}
            onClick={() => { setIsCalendarOpen(false); setShowGuests(s => !s); }}
          >
            <div>
              <div className="rbm-row-label">Rooms &amp; Guests</div>
              <div className="rbm-row-value">{guestsLabel}</div>
            </div>
            <span className="rbm-badge" style={{ background: showGuests ? accentColor : '#f3f4f6', color: showGuests ? '#fff' : '#9ca3af' }}>
              {showGuests ? 'Selecting' : 'Tap to change'}
            </span>
          </div>

          {showGuests && (
            <div style={{ padding: '20px 26px', borderTop: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Rooms */}
              <div className="rbm-counter-row">
                <div><div className="rbm-counter-label">Rooms</div></div>
                <div className="rbm-counter-ctrl">
                  <button className="rbm-counter-btn" disabled={rooms<=1} onClick={()=>setRooms(r=>Math.max(1,r-1))}>−</button>
                  <span className="rbm-counter-num">{rooms}</span>
                  <button className="rbm-counter-btn" disabled={rooms>=9} onClick={()=>setRooms(r=>Math.min(9,r+1))}>+</button>
                </div>
              </div>
              {/* Adults */}
              <div className="rbm-counter-row">
                <div><div className="rbm-counter-label">Adults</div></div>
                <div className="rbm-counter-ctrl">
                  <button className="rbm-counter-btn" disabled={adults<=1} onClick={()=>setAdults(a=>Math.max(1,a-1))}>−</button>
                  <span className="rbm-counter-num">{adults}</span>
                  <button className="rbm-counter-btn" disabled={adults>=9} onClick={()=>setAdults(a=>Math.min(9,a+1))}>+</button>
                </div>
              </div>
              {/* Children */}
              <div className="rbm-counter-row">
                <div>
                  <div className="rbm-counter-label">Children</div>
                  <div className="rbm-counter-sub">0–17 Years Old</div>
                </div>
                <div className="rbm-counter-ctrl">
                  <button className="rbm-counter-btn" disabled={children<=0} onClick={()=>setChildren(c=>Math.max(0,c-1))}>−</button>
                  <span className="rbm-counter-num">{children}</span>
                  <button className="rbm-counter-btn" disabled={children>=9} onClick={()=>setChildren(c=>Math.min(9,c+1))}>+</button>
                </div>
              </div>
              <button
                onClick={() => setShowGuests(false)}
                style={{
                  alignSelf: 'flex-end', background: accentColor, color: '#fff',
                  border: 'none', borderRadius: '50px', padding: '8px 22px',
                  fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >Apply</button>
            </div>
          )}
        </div>

        {/* Summary + CTA */}
        <div style={{ padding: '20px 26px 28px' }}>
          {nights > 0 && (
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 14 }}>
              <strong style={{ color: '#111' }}>{nights} night{nights!==1?'s':''}</strong>
              {' · '}₹{(price * nights * rooms).toLocaleString()} total est.
            </div>
          )}
          <button
            onClick={handleProceed}
            style={{
              width: '100%',
              background: accentColor,
              color: '#fff',
              border: 'none',
              borderRadius: '50px',
              padding: '16px 28px',
              fontSize: 17,
              fontWeight: 800,
              cursor: 'pointer',
              fontFamily: 'inherit',
              letterSpacing: '0.5px',
              transition: 'opacity 0.15s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
            onMouseOver={e => (e.currentTarget.style.opacity='0.9')}
            onMouseOut={e => (e.currentTarget.style.opacity='1')}
          >
            Proceed to Book
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
