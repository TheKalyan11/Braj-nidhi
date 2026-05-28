"use client";

import React, { useState, useEffect, useRef } from 'react';

interface PremiumDoubleCalendarProps {
  checkIn: string;
  checkOut: string;
  onChange: (checkIn: string, checkOut: string) => void;
  isOpen: boolean;
  onClose?: () => void;
  initialSelection?: 'in' | 'out';
}

export default function PremiumDoubleCalendar({
  checkIn,
  checkOut,
  onChange,
  isOpen,
  onClose,
  initialSelection = 'in'
}: PremiumDoubleCalendarProps) {
  const parseDateStr = (str: string) => {
    if (!str) return new Date();
    const [y, m, d] = str.split('-').map(Number);
    return new Date(y, m - 1, d);
  };

  const fmtStr = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const checkInDate = parseDateStr(checkIn);
  const checkOutDate = parseDateStr(checkOut);

  const [activeSelection, setActiveSelection] = useState<'in' | 'out'>(initialSelection);
  const [leftMonth, setLeftMonth] = useState(checkInDate.getMonth());
  const [leftYear, setLeftYear] = useState(checkInDate.getFullYear());
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveSelection(initialSelection);
      const d = parseDateStr(checkIn);
      setLeftMonth(d.getMonth());
      setLeftYear(d.getFullYear());
    }
  }, [isOpen, initialSelection]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handle = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        const t = e.target as Element;
        if (t.closest('.mmt-date-trigger') || t.closest('.search-block')) return;
        if (onClose) onClose();
      }
    };
    document.addEventListener('mousedown', handle, true);
    document.addEventListener('touchstart', handle, true);
    return () => {
      document.removeEventListener('mousedown', handle, true);
      document.removeEventListener('touchstart', handle, true);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const WEEKDAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  const today = new Date(); today.setHours(0,0,0,0);

  // Right month is always left+1
  const rightMonth = (leftMonth + 1) % 12;
  const rightYear = leftMonth === 11 ? leftYear + 1 : leftYear;

  const prevMonth = () => {
    if (leftMonth === 0) { setLeftMonth(11); setLeftYear(leftYear - 1); }
    else setLeftMonth(leftMonth - 1);
  };
  const nextMonth = () => {
    if (leftMonth === 11) { setLeftMonth(0); setLeftYear(leftYear + 1); }
    else setLeftMonth(leftMonth + 1);
  };

  const buildGrid = (month: number, year: number) => {
    const firstDow = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < firstDow; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    return cells;
  };

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const handleDayClick = (day: Date) => {
    if (day < today) return;
    const val = fmtStr(day);
    if (activeSelection === 'in') {
      const newOut = day >= checkOutDate ? fmtStr(new Date(day.getTime() + 86400000)) : checkOut;
      onChange(val, newOut);
      setActiveSelection('out');
    } else {
      if (day <= checkInDate) {
        onChange(val, checkOut);
        setActiveSelection('out');
      } else {
        onChange(checkIn, val);
        setHoverDate(null);
      }
    }
  };

  const fmtDisplay = (dateStr: string) => {
    const d = parseDateStr(dateStr);
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    return {
      day: d.getDate(),
      month: MONTHS[d.getMonth()].slice(0, 3),
      year: d.getFullYear(),
      dow: days[d.getDay()]
    };
  };

  const ci = fmtDisplay(checkIn);
  const co = fmtDisplay(checkOut);

  const getDayState = (day: Date | null) => {
    if (!day) return {};
    const isPast = day < today;
    const isStart = sameDay(day, checkInDate);
    const isEnd = sameDay(day, checkOutDate);
    const effectiveEnd = (activeSelection === 'out' && hoverDate && hoverDate > checkInDate) ? hoverDate : checkOutDate;
    const inRange = day > checkInDate && day < effectiveEnd && !isStart && !isEnd;
    const isToday = sameDay(day, today);
    return { isPast, isStart, isEnd, inRange, isToday };
  };

  const renderGrid = (month: number, year: number, isMobileHidden = false) => {
    const cells = buildGrid(month, year);
    return (
      <div className={`sky-month-col${isMobileHidden ? ' sky-mobile-hide' : ''}`}>
        <div className="sky-month-nav">
          {!isMobileHidden && (
            <button className="sky-nav-btn" onClick={prevMonth} aria-label="Previous month">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
          )}
          <span className="sky-month-label">{MONTHS[month]} {year}</span>
          {isMobileHidden ? null : (
            <button className="sky-nav-btn sky-nav-right" onClick={nextMonth} aria-label="Next month">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          )}
          {isMobileHidden && (
            <button className="sky-nav-btn sky-nav-right" onClick={nextMonth} aria-label="Next month">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          )}
        </div>
        <div className="sky-weekdays">
          {WEEKDAYS.map(w => <div key={w} className="sky-wd">{w}</div>)}
        </div>
        <div className="sky-days-grid">
          {cells.map((day, idx) => {
            if (!day) return <div key={`e-${idx}`} className="sky-day-cell sky-empty" />;
            const { isPast, isStart, isEnd, inRange, isToday } = getDayState(day);
            const isRangeStart = isStart && !sameDay(checkInDate, checkOutDate);
            const isRangeEnd = isEnd && !sameDay(checkInDate, checkOutDate);
            return (
              <div
                key={`d-${day.getDate()}`}
                className={[
                  'sky-day-cell',
                  isPast ? 'sky-past' : '',
                  isStart ? 'sky-start' : '',
                  isEnd ? 'sky-end' : '',
                  inRange ? 'sky-in-range' : '',
                  isToday && !isStart && !isEnd ? 'sky-today' : '',
                  isRangeStart ? 'sky-range-start' : '',
                  isRangeEnd ? 'sky-range-end' : '',
                ].filter(Boolean).join(' ')}
                onClick={() => !isPast && handleDayClick(day)}
                onMouseEnter={() => !isPast && activeSelection === 'out' && setHoverDate(day)}
                onMouseLeave={() => setHoverDate(null)}
              >
                <div className="sky-day-bg" />
                <span className="sky-day-num">{day.getDate()}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div className="sky-backdrop" onClick={onClose} />

      {/* Calendar panel */}
      <div ref={containerRef} className="sky-cal-panel" onClick={e => e.stopPropagation()}>
        <style dangerouslySetInnerHTML={{ __html: `
          /* ── Skyscanner-style calendar ── */
          .sky-backdrop {
            position: fixed; inset: 0;
            background: rgba(0,0,0,0.45);
            z-index: 99998;
          }
          .sky-cal-panel {
            position: fixed;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            z-index: 99999;
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 24px 64px rgba(0,0,0,0.18);
            width: min(740px, calc(100vw - 24px));
            max-height: 90vh;
            overflow-y: auto;
            font-family: 'Outfit', sans-serif;
            animation: skyFadeIn 0.2s ease forwards;
            display: flex;
            flex-direction: column;
          }
          @keyframes skyFadeIn {
            from { opacity: 0; transform: translate(-50%, -47%); }
            to   { opacity: 1; transform: translate(-50%, -50%); }
          }

          /* ── Header tabs ── */
          .sky-header {
            display: flex;
            border-bottom: 1px solid #e8e8e8;
            position: relative;
          }
          .sky-tab {
            flex: 1;
            padding: 18px 24px 14px;
            cursor: pointer;
            position: relative;
            transition: background 0.15s;
          }
          .sky-tab:first-child { border-right: 1px solid #e8e8e8; }
          .sky-tab:hover { background: #f7f7f7; }
          .sky-tab-label {
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
            color: #6b7280;
            margin-bottom: 4px;
          }
          .sky-tab-date {
            font-size: 20px;
            font-weight: 700;
            color: #111;
            line-height: 1.1;
          }
          .sky-tab-sub {
            font-size: 12px;
            color: #9ca3af;
            margin-top: 2px;
          }
          .sky-tab.sky-tab-active::after {
            content: '';
            position: absolute;
            bottom: -1px; left: 0; right: 0;
            height: 3px;
            background: #C89B3C;
            border-radius: 2px 2px 0 0;
          }
          .sky-tab.sky-tab-active .sky-tab-label { color: #C89B3C; }
          .sky-tab.sky-tab-active .sky-tab-date { color: #111; }
          .sky-close-btn {
            position: absolute;
            top: 14px; right: 14px;
            width: 32px; height: 32px;
            border-radius: 50%;
            border: none;
            background: #f3f4f6;
            cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            color: #6b7280;
            transition: background 0.15s;
          }
          .sky-close-btn:hover { background: #e5e7eb; color: #111; }

          /* ── Month columns ── */
          .sky-months-wrap {
            display: flex;
            gap: 0;
            padding: 20px 24px 10px;
            flex: 1;
          }
          .sky-month-col {
            flex: 1;
            min-width: 0;
          }
          .sky-month-col + .sky-month-col {
            padding-left: 24px;
            border-left: 1px solid #f0f0f0;
            margin-left: 24px;
          }
          .sky-month-nav {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 14px;
          }
          .sky-month-label {
            font-size: 15px;
            font-weight: 700;
            color: #111;
            text-align: center;
            flex: 1;
          }
          .sky-nav-btn {
            width: 32px; height: 32px;
            border-radius: 50%;
            border: 1px solid #e5e7eb;
            background: #fff;
            cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            color: #6b7280;
            transition: all 0.15s;
            flex-shrink: 0;
          }
          .sky-nav-btn:hover { border-color: #C89B3C; color: #C89B3C; background: #fdf8ef; }

          /* ── Weekdays ── */
          .sky-weekdays {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            margin-bottom: 6px;
          }
          .sky-wd {
            text-align: center;
            font-size: 11px;
            font-weight: 600;
            color: #9ca3af;
            padding: 4px 0;
          }

          /* ── Day cells ── */
          .sky-days-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            row-gap: 2px;
          }
          .sky-day-cell {
            position: relative;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            user-select: none;
          }
          .sky-day-bg {
            position: absolute;
            inset: 0;
            z-index: 0;
          }
          .sky-day-num {
            position: relative;
            z-index: 2;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            font-size: 14px;
            font-weight: 500;
            color: #111;
            transition: background 0.15s, color 0.15s;
          }
          .sky-day-cell:hover:not(.sky-past):not(.sky-start):not(.sky-end) .sky-day-num {
            background: #f5edda;
            color: #C89B3C;
          }
          /* Past */
          .sky-past { cursor: default; }
          .sky-past .sky-day-num { color: #d1d5db; }
          /* Today */
          .sky-today .sky-day-num { font-weight: 700; text-decoration: underline; text-decoration-color: #C89B3C; }
          /* In-range background (full width strip) */
          .sky-in-range .sky-day-bg { background: #fdf3dc; }
          /* Range-start: right half strip */
          .sky-range-start .sky-day-bg { background: linear-gradient(to right, transparent 50%, #fdf3dc 50%); }
          /* Range-end: left half strip */
          .sky-range-end .sky-day-bg { background: linear-gradient(to left, transparent 50%, #fdf3dc 50%); }
          /* Start/end circles */
          .sky-start .sky-day-num, .sky-end .sky-day-num {
            background: #C89B3C;
            color: #fff;
            font-weight: 700;
          }

          /* ── Footer ── */
          .sky-footer {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding: 14px 24px 18px;
            border-top: 1px solid #f0f0f0;
            gap: 12px;
          }
          .sky-nights-badge {
            font-size: 13px;
            color: #6b7280;
            margin-right: auto;
          }
          .sky-nights-badge strong { color: #111; }
          .sky-clear-btn {
            padding: 10px 20px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            background: #fff;
            font-size: 14px;
            font-weight: 600;
            color: #6b7280;
            cursor: pointer;
            transition: all 0.15s;
            font-family: 'Outfit', sans-serif;
          }
          .sky-clear-btn:hover { border-color: #C89B3C; color: #C89B3C; }
          .sky-done-btn {
            padding: 10px 28px;
            border: none;
            border-radius: 8px;
            background: #C89B3C;
            font-size: 14px;
            font-weight: 700;
            color: #fff;
            cursor: pointer;
            transition: all 0.15s;
            font-family: 'Outfit', sans-serif;
          }
          .sky-done-btn:hover { background: #b08a32; }

          /* ── Mobile ── */
          @media (max-width: 640px) {
            .sky-cal-panel {
              width: 95vw;
              max-height: 92vh;
              border-radius: 14px;
            }
            .sky-tab { padding: 14px 16px 12px; }
            .sky-tab-date { font-size: 17px; }
            .sky-months-wrap { padding: 16px 16px 8px; }
            .sky-mobile-hide { display: none; }
            .sky-month-col + .sky-month-col { display: none; }
            .sky-footer { padding: 12px 16px 16px; }
            .sky-day-cell { height: 44px; }
            .sky-day-num { width: 40px; height: 40px; font-size: 15px; }
          }
        `}} />

        {/* Header */}
        <div className="sky-header">
          <div
            className={`sky-tab${activeSelection === 'in' ? ' sky-tab-active' : ''}`}
            onClick={() => setActiveSelection('in')}
          >
            <div className="sky-tab-label">Check-in</div>
            <div className="sky-tab-date">{ci.day} {ci.month} {ci.year}</div>
            <div className="sky-tab-sub">{ci.dow}</div>
          </div>
          <div
            className={`sky-tab${activeSelection === 'out' ? ' sky-tab-active' : ''}`}
            onClick={() => setActiveSelection('out')}
          >
            <div className="sky-tab-label">Check-out</div>
            <div className="sky-tab-date">{co.day} {co.month} {co.year}</div>
            <div className="sky-tab-sub">{co.dow}</div>
          </div>
          <button className="sky-close-btn" onClick={onClose} aria-label="Close calendar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Months */}
        <div className="sky-months-wrap">
          {renderGrid(leftMonth, leftYear, false)}
          {renderGrid(rightMonth, rightYear, true)}
        </div>

        {/* Footer */}
        <div className="sky-footer">
          {(() => {
            const ci2 = parseDateStr(checkIn);
            const co2 = parseDateStr(checkOut);
            const nights = Math.round((co2.getTime() - ci2.getTime()) / 86400000);
            return nights > 0 ? (
              <span className="sky-nights-badge"><strong>{nights} night{nights > 1 ? 's' : ''}</strong> selected</span>
            ) : null;
          })()}
          <button className="sky-clear-btn" onClick={() => {
            const t = fmtStr(today);
            const t2 = fmtStr(new Date(today.getTime() + 86400000));
            onChange(t, t2);
            setActiveSelection('in');
          }}>Clear</button>
          <button className="sky-done-btn" onClick={onClose}>Done</button>
        </div>
      </div>
    </>
  );
}
