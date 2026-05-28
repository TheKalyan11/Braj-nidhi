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

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
// Mon-first week
const WEEKDAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

function parseDateStr(str: string) {
  if (!str) return new Date();
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function fmtStr(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

export default function PremiumDoubleCalendar({
  checkIn, checkOut, onChange, isOpen, onClose, initialSelection = 'in'
}: PremiumDoubleCalendarProps) {
  const checkInDate = parseDateStr(checkIn);
  const checkOutDate = parseDateStr(checkOut);

  const [activeSelection, setActiveSelection] = useState<'in' | 'out'>(initialSelection);
  const [viewMonth, setViewMonth] = useState(checkInDate.getMonth());
  const [viewYear, setViewYear] = useState(checkInDate.getFullYear());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveSelection(initialSelection);
      const d = parseDateStr(initialSelection === 'out' ? checkOut : checkIn);
      setViewMonth(d.getMonth());
      setViewYear(d.getFullYear());
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

  const today = new Date(); today.setHours(0, 0, 0, 0);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
    setShowMonthPicker(false);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
    setShowMonthPicker(false);
  };

  const handleDayClick = (day: Date, isOverflow: boolean) => {
    if (day < today && !isOverflow) return;
    if (day < today) return;
    const val = fmtStr(day);
    if (activeSelection === 'in') {
      const newOut = day >= checkOutDate ? fmtStr(new Date(day.getTime() + 86400000)) : checkOut;
      onChange(val, newOut);
      setActiveSelection('out');
      // Navigate to check-out month if needed
      if (day.getMonth() !== viewMonth || day.getFullYear() !== viewYear) {
        setViewMonth(day.getMonth());
        setViewYear(day.getFullYear());
      }
    } else {
      if (day <= checkInDate) {
        onChange(val, checkOut);
        setActiveSelection('out');
      } else {
        onChange(checkIn, val);
        if (onClose) onClose(); // auto-close after check-out selected
      }
    }
  };

  // Build grid: Mon-first, show prev/next month overflow days
  const buildGrid = () => {
    const firstDay = new Date(viewYear, viewMonth, 1);
    // Mon=0 … Sun=6; JS: Sun=0 Mon=1 … Sat=6
    const firstDow = (firstDay.getDay() + 6) % 7; // Mon-first offset
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

    const cells: { date: Date; overflow: boolean }[] = [];

    // Prev month overflow
    for (let i = firstDow - 1; i >= 0; i--) {
      const m = viewMonth === 0 ? 11 : viewMonth - 1;
      const y = viewMonth === 0 ? viewYear - 1 : viewYear;
      cells.push({ date: new Date(y, m, prevMonthDays - i), overflow: true });
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ date: new Date(viewYear, viewMonth, d), overflow: false });
    }

    // Next month overflow — fill to complete rows (multiple of 7)
    let next = 1;
    while (cells.length % 7 !== 0) {
      const m = viewMonth === 11 ? 0 : viewMonth + 1;
      const y = viewMonth === 11 ? viewYear + 1 : viewYear;
      cells.push({ date: new Date(y, m, next++), overflow: true });
    }

    return cells;
  };

  const cells = buildGrid();
  const nights = Math.round((checkOutDate.getTime() - checkInDate.getTime()) / 86400000);

  const fmtDisplay = (dateStr: string) => {
    const d = parseDateStr(dateStr);
    const dows = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0,3)} ${d.getFullYear()} · ${dows[d.getDay()]}`;
  };

  // Dropdown month list: current month + 24 future months
  const monthOptions: { label: string; month: number; year: number }[] = [];
  for (let i = 0; i < 25; i++) {
    const m = (today.getMonth() + i) % 12;
    const y = today.getFullYear() + Math.floor((today.getMonth() + i) / 12);
    monthOptions.push({ label: `${MONTHS[m]} ${y}`, month: m, year: y });
  }

  return (
    <>
      <div className="sky-backdrop" onClick={onClose} />
      <div ref={containerRef} className="sky-cal-panel" onClick={e => e.stopPropagation()}>
        <style dangerouslySetInnerHTML={{ __html: `
          .sky-backdrop {
            position: fixed; inset: 0;
            background: rgba(0,0,0,0.4);
            z-index: 99998;
          }
          .sky-cal-panel {
            position: fixed;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            z-index: 99999;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 8px 40px rgba(0,0,0,0.18);
            width: min(460px, calc(100vw - 24px));
            max-height: 92vh;
            overflow-y: auto;
            font-family: 'Outfit', sans-serif;
            animation: skyFade 0.18s ease forwards;
          }
          @keyframes skyFade {
            from { opacity: 0; transform: translate(-50%,-48%); }
            to   { opacity: 1; transform: translate(-50%,-50%); }
          }

          /* Header tabs */
          .sky-tabs {
            display: flex;
            border-bottom: 1px solid #e8e8e8;
          }
          .sky-tab {
            flex: 1;
            padding: 16px 20px 12px;
            cursor: pointer;
            position: relative;
            transition: background 0.15s;
          }
          .sky-tab:first-child { border-right: 1px solid #e8e8e8; }
          .sky-tab:hover { background: #f9f9f9; }
          .sky-tab-label {
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 1.2px;
            text-transform: uppercase;
            color: #9ca3af;
            margin-bottom: 4px;
          }
          .sky-tab-value {
            font-size: 14px;
            font-weight: 600;
            color: #374151;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .sky-tab.active .sky-tab-label { color: #C89B3C; }
          .sky-tab.active .sky-tab-value { color: #111; font-weight: 700; }
          .sky-tab.active::after {
            content: '';
            position: absolute;
            bottom: -1px; left: 0; right: 0;
            height: 3px;
            background: #C89B3C;
            border-radius: 2px 2px 0 0;
          }

          /* Month nav */
          .sky-month-nav {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 14px 16px 10px;
            position: relative;
          }
          .sky-nav-arrow {
            width: 32px; height: 32px;
            border-radius: 50%;
            border: 1px solid #e5e7eb;
            background: #fff;
            cursor: pointer;
            display: flex; align-items: center; justify-content: center;
            color: #374151;
            transition: all 0.15s;
            flex-shrink: 0;
          }
          .sky-nav-arrow:hover { border-color: #C89B3C; color: #C89B3C; }
          .sky-month-title {
            display: flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
            padding: 6px 12px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            font-size: 15px;
            font-weight: 700;
            color: #111;
            user-select: none;
            transition: border-color 0.15s;
          }
          .sky-month-title:hover { border-color: #C89B3C; }
          .sky-month-title svg { color: #9ca3af; }
          .sky-month-picker {
            position: absolute;
            top: calc(100% - 4px);
            left: 50%;
            transform: translateX(-50%);
            background: #fff;
            border: 1px solid #e5e7eb;
            border-radius: 10px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.12);
            z-index: 10;
            max-height: 220px;
            overflow-y: auto;
            min-width: 180px;
            padding: 4px 0;
          }
          .sky-month-option {
            padding: 9px 18px;
            font-size: 14px;
            cursor: pointer;
            color: #374151;
            transition: background 0.1s;
          }
          .sky-month-option:hover { background: #fdf8ef; color: #C89B3C; }
          .sky-month-option.current { font-weight: 700; color: #C89B3C; }

          /* Weekday headers */
          .sky-weekdays {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            padding: 0 12px;
            margin-bottom: 4px;
          }
          .sky-wd {
            text-align: center;
            font-size: 12px;
            font-weight: 600;
            color: #9ca3af;
            padding: 4px 0;
          }

          /* Day grid */
          .sky-days-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            padding: 0 12px;
            row-gap: 2px;
          }
          .sky-day {
            position: relative;
            height: 42px;
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
            width: 38px; height: 38px;
            display: flex; align-items: center; justify-content: center;
            border-radius: 50%;
            font-size: 15px;
            font-weight: 500;
            color: #111;
            transition: background 0.12s, color 0.12s;
          }
          /* Overflow (prev/next month) */
          .sky-day.overflow .sky-day-num { color: #c8c8c8; }
          .sky-day.overflow { cursor: default; }
          /* Past */
          .sky-day.past { cursor: default; }
          .sky-day.past:not(.overflow) .sky-day-num { color: #c8c8c8; }
          /* Hover */
          .sky-day:not(.past):not(.overflow):not(.sel-start):not(.sel-end):hover .sky-day-num {
            background: #f0e8d4;
            color: #C89B3C;
          }
          /* In-range strip */
          .sky-day.in-range .sky-day-bg { background: #fdf0d8; }
          .sky-day.range-left .sky-day-bg { background: linear-gradient(to right, transparent 50%, #fdf0d8 50%); }
          .sky-day.range-right .sky-day-bg { background: linear-gradient(to left, transparent 50%, #fdf0d8 50%); }
          /* Selected start/end */
          .sky-day.sel-start .sky-day-num,
          .sky-day.sel-end .sky-day-num {
            background: #1a56db;
            color: #fff !important;
            font-weight: 700;
          }
          /* Today underline */
          .sky-day.is-today:not(.sel-start):not(.sel-end) .sky-day-num {
            text-decoration: underline;
            text-decoration-color: #C89B3C;
            font-weight: 700;
          }

          /* Footer */
          .sky-footer {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 20px 16px;
            border-top: 1px solid #f0f0f0;
            margin-top: 8px;
          }
          .sky-nights {
            font-size: 13px;
            color: #6b7280;
          }
          .sky-nights strong { color: #111; }
          .sky-close-link {
            font-size: 14px;
            font-weight: 600;
            color: #374151;
            cursor: pointer;
            text-decoration: underline;
            text-underline-offset: 3px;
            background: none; border: none;
            font-family: 'Outfit', sans-serif;
            padding: 0;
            transition: color 0.15s;
          }
          .sky-close-link:hover { color: #C89B3C; }

          /* Mobile */
          @media (max-width: 480px) {
            .sky-cal-panel { width: 96vw; border-radius: 10px; }
            .sky-tab { padding: 12px 14px 10px; }
            .sky-tab-value { font-size: 13px; }
            .sky-day { height: 46px; }
            .sky-day-num { width: 40px; height: 40px; font-size: 15px; }
            .sky-weekdays, .sky-days-grid { padding: 0 8px; }
          }
        `}} />

        {/* Tabs */}
        <div className="sky-tabs">
          <div className={`sky-tab${activeSelection === 'in' ? ' active' : ''}`} onClick={() => setActiveSelection('in')}>
            <div className="sky-tab-label">Check-in</div>
            <div className="sky-tab-value">{fmtDisplay(checkIn)}</div>
          </div>
          <div className={`sky-tab${activeSelection === 'out' ? ' active' : ''}`} onClick={() => setActiveSelection('out')}>
            <div className="sky-tab-label">Check-out</div>
            <div className="sky-tab-value">{fmtDisplay(checkOut)}</div>
          </div>
        </div>

        {/* Month navigation */}
        <div className="sky-month-nav">
          <button className="sky-nav-arrow" onClick={prevMonth} aria-label="Previous month">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          <div className="sky-month-title" onClick={() => setShowMonthPicker(!showMonthPicker)}>
            <span>{MONTHS[viewMonth]} {viewYear}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
          <button className="sky-nav-arrow" onClick={nextMonth} aria-label="Next month">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
            </svg>
          </button>

          {showMonthPicker && (
            <div className="sky-month-picker">
              {monthOptions.map((opt, i) => (
                <div
                  key={i}
                  className={`sky-month-option${opt.month === viewMonth && opt.year === viewYear ? ' current' : ''}`}
                  onClick={() => { setViewMonth(opt.month); setViewYear(opt.year); setShowMonthPicker(false); }}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Weekday headers */}
        <div className="sky-weekdays">
          {WEEKDAYS.map(w => <div key={w} className="sky-wd">{w}</div>)}
        </div>

        {/* Day grid */}
        <div className="sky-days-grid">
          {cells.map(({ date, overflow }, idx) => {
            const isPast = date < today;
            const isStart = !overflow && sameDay(date, checkInDate);
            const isEnd = !overflow && sameDay(date, checkOutDate);
            const isToday = !overflow && sameDay(date, today);
            const inRange = !overflow && date > checkInDate && date < checkOutDate;
            const rangeLeft = isStart && !sameDay(checkInDate, checkOutDate);
            const rangeRight = isEnd && !sameDay(checkInDate, checkOutDate);

            const cls = [
              'sky-day',
              overflow ? 'overflow' : '',
              !overflow && isPast ? 'past' : '',
              isStart ? 'sel-start' : '',
              isEnd ? 'sel-end' : '',
              inRange ? 'in-range' : '',
              rangeLeft ? 'range-left' : '',
              rangeRight ? 'range-right' : '',
              isToday ? 'is-today' : '',
            ].filter(Boolean).join(' ');

            return (
              <div
                key={idx}
                className={cls}
                onClick={() => !overflow && !isPast && handleDayClick(date, overflow)}
              >
                <div className="sky-day-bg" />
                <span className="sky-day-num">{date.getDate()}</span>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="sky-footer">
          <span className="sky-nights">
            {nights > 0 ? <><strong>{nights} night{nights !== 1 ? 's' : ''}</strong> selected</> : <span style={{color:'#9ca3af'}}>Select dates</span>}
          </span>
          <button className="sky-close-link" onClick={onClose}>Close</button>
        </div>
      </div>
    </>
  );
}
