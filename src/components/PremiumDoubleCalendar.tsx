"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';

interface PremiumDoubleCalendarProps {
  checkIn: string; // Format: 'YYYY-MM-DD'
  checkOut: string; // Format: 'YYYY-MM-DD'
  onChange: (checkIn: string, checkOut: string) => void;
  isOpen: boolean;
  onClose?: () => void;
  initialSelection?: 'in' | 'out';
}

interface FestivalEvent {
  date: string; // Format: 'YYYY-MM-DD'
  label: string; // Short label like 'Akshaya', 'Braj'
  fullName: string;
}

export default function PremiumDoubleCalendar({
  checkIn,
  checkOut,
  onChange,
  isOpen,
  onClose,
  initialSelection = 'in'
}: PremiumDoubleCalendarProps) {
  // Convert standard date string to Date objects
  const parseDateStr = (str: string) => {
    if (!str) return new Date();
    const [y, m, d] = str.split('-').map(Number);
    return new Date(y, m - 1, d);
  };

  const checkInDate = parseDateStr(checkIn);
  const checkOutDate = parseDateStr(checkOut);

  // Active sub-selection state: 'in' or 'out'
  const [activeSelection, setActiveSelection] = useState<'in' | 'out'>(initialSelection);

  // Reset to initialSelection each time the calendar opens
  useEffect(() => {
    if (isOpen) setActiveSelection(initialSelection);
  }, [isOpen, initialSelection]);
  
  // Left-most visible month and year in side-by-side view (Defaults to checkInDate's month)
  const [currentMonth, setCurrentMonth] = useState(checkInDate.getMonth());
  const [currentYear, setCurrentYear] = useState(checkInDate.getFullYear());

  // Keep calendar view in sync when checkIn changes externally
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const d = parseDateStr(checkIn);
      setCurrentMonth(d.getMonth());
      setCurrentYear(d.getFullYear());
    });
    return () => window.cancelAnimationFrame(frame);
  }, [checkIn]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        const trigger = containerRef.current.closest('.mmt-date-trigger') || document.querySelector('.block-trigger-wrapper');
        if (trigger && trigger.contains(event.target as Node)) {
          return;
        }
        if (onClose) {
          onClose();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('touchstart', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Custom Vrindavan & Spiritual Holy Festivals (Removed per user request to clear underlines/highlights)
  const festivals: FestivalEvent[] = [];

  // Helper date parsing and formatting
  const formatDateParts = (d: Date) => {
    const day = d.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const yrStr = d.getFullYear().toString().slice(-2);
    return {
      day,
      month: months[d.getMonth()],
      year: yrStr
    };
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const isBetweenDays = (dayDate: Date, start: Date, end: Date) => {
    const dayTime = dayDate.getTime();
    const startTime = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
    const endTime = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
    return dayTime > startTime && dayTime < endTime;
  };

  // Build dates for specific month
  const generateMonthGrid = (monthIndex: number, year: number) => {
    const daysInMonth = getDaysInMonth(monthIndex, year);
    const firstDay = getFirstDayOfMonth(monthIndex, year);
    const gridDays = [];

    // Push empty placeholders for preceding days
    for (let i = 0; i < firstDay; i++) {
      gridDays.push(null);
    }

    // Push actual day numbers
    for (let d = 1; d <= daysInMonth; d++) {
      gridDays.push(new Date(year, monthIndex, d));
    }

    return gridDays;
  };

  // Navigate side-by-side months
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Click on date cell logic
  const handleDateClick = (dayDate: Date) => {
    const y = dayDate.getFullYear();
    const m = String(dayDate.getMonth() + 1).padStart(2, '0');
    const d = String(dayDate.getDate()).padStart(2, '0');
    const formattedStr = `${y}-${m}-${d}`;

    if (activeSelection === 'in') {
      // Set Check-in date. If check-out is before this date, reset check-out to check-in + 1 day
      const newCheckOut = dayDate.getTime() >= checkOutDate.getTime() 
        ? new Date(dayDate.getTime() + 86400000) 
        : checkOutDate;
      
      const outY = newCheckOut.getFullYear();
      const outM = String(newCheckOut.getMonth() + 1).padStart(2, '0');
      const outD = String(newCheckOut.getDate()).padStart(2, '0');
      
      onChange(formattedStr, `${outY}-${outM}-${outD}`);
      setActiveSelection('out'); // Switch selection underline to Check-out
    } else {
      // Set Check-out date
      if (dayDate.getTime() <= checkInDate.getTime()) {
        // If clicked date is before check-in, set it as check-in instead and select checkout
        onChange(formattedStr, checkOut);
        setActiveSelection('out');
      } else {
        onChange(checkIn, formattedStr);
        if (onClose) onClose(); // Close on complete selection
      }
    }
  };

  const leftMonth = currentMonth;
  const leftYear = currentYear;
  const rightMonth = (currentMonth + 1) % 12;
  const rightYear = currentMonth === 11 ? currentYear + 1 : currentYear;

  const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // Check if a cell has a festival event
  const getFestivalForDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;
    return festivals.find(f => f.date === dateStr);
  };

  return (
    <>
    <div className="mmt-cal-backdrop" onClick={onClose} />
    <div
      ref={containerRef}
      className="mmt-calendar-overlay animate-fadeIn"
      onClick={(e) => e.stopPropagation()}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -48%); }
          to { opacity: 1; transform: translate(-50%, -50%); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .mmt-calendar-overlay {
          background: #ffffff !important;
          border-radius: 20px;
          border: 1px solid rgba(0, 0, 0, 0.08) !important;
          box-shadow: 0 18px 60px rgba(0, 0, 0, 0.14) !important;
          box-sizing: border-box;
          width: min(650px, calc(100vw - 32px));
          max-width: none;
          padding: 18px 22px 20px;
          color: #1f2937 !important;
          font-family: 'Outfit', sans-serif;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 99999;
          user-select: none;
          max-height: 90vh;
          overflow-y: auto;
        }
        .mmt-calendar-overlay::before {
          display: none;
        }
        .mmt-cal-backdrop {
          display: block;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.45);
          z-index: 99998;
        }
        
        /* Premium date tabs at top matching MMT image */
        .mmt-cal-header-tabs {
          display: flex;
          align-items: center;
          border-bottom: 1.5px solid rgba(0, 0, 0, 0.06) !important;
          justify-content: space-between;
          padding-bottom: 14px;
          margin-bottom: 14px;
          gap: 18px;
        }
        .mmt-cal-tab {
          display: flex;
          align-items: center;
          cursor: pointer;
          padding: 4px 0;
          position: relative;
          transition: all 0.25s ease;
          min-width: 72px;
        }
        .mmt-cal-tab-icon {
          color: rgba(0, 0, 0, 0.3) !important;
          margin-right: 10px;
          transition: all 0.25s ease;
        }
        .mmt-cal-tab:last-of-type {
          justify-content: flex-end;
        }
        .mmt-cal-tab:last-of-type .mmt-cal-tab-icon {
          order: 2;
          margin-left: 10px;
          margin-right: 0;
        }
        .mmt-cal-tab.active .mmt-cal-tab-icon {
          color: #eab308 !important;
        }
        .mmt-cal-tab-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          line-height: 1.02;
        }
        .mmt-cal-tab:last-of-type .mmt-cal-tab-text {
          align-items: flex-end;
        }
        .mmt-cal-tab-date-top {
          font-size: 16px;
          font-weight: 800;
          color: #111827 !important;
          transition: all 0.25s ease;
        }
        .mmt-cal-tab-date-bottom {
          font-size: 16px;
          font-weight: 800;
          color: rgba(17, 24, 39, 0.62) !important;
          transition: all 0.25s ease;
        }
        .mmt-cal-tab.active .mmt-cal-tab-date-top {
          color: #1f2937 !important;
          font-weight: 800;
        }
        .mmt-cal-tab.active .mmt-cal-tab-date-bottom {
          color: rgba(0, 0, 0, 0.6) !important;
          font-weight: 700;
        }
        .mmt-cal-tab.active::after {
          content: '';
          position: absolute;
          bottom: -15.5px;
          left: 0;
          right: 0;
          height: 3px;
          background: #eab308 !important;
          border-radius: 2px 2px 0 0;
        }
        .mmt-cal-tab-dash {
          font-size: 16px;
          color: rgba(0, 0, 0, 0.2) !important;
          font-weight: 400;
          margin: 0 auto;
        }

        /* Two Columns side-by-side */
        .mmt-cal-dual-months {
          display: flex;
          gap: 24px;
          justify-content: space-between;
        }
        .mmt-cal-month-col {
          width: calc(50% - 12px);
        }
        
        /* Month Title paginator styling */
        .mmt-cal-month-title-row {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 32px;
          position: relative;
          margin-bottom: 14px;
        }
        .mmt-cal-month-name {
          font-size: 16px;
          font-weight: 800;
          color: #1f2937 !important;
          letter-spacing: 0;
        }
        .mmt-cal-month-name span {
          display: block;
          font-weight: 400;
          margin-left: 0;
          margin-top: 3px;
          color: rgba(0, 0, 0, 0.4) !important;
          font-size: 13px;
          text-align: center;
        }
        .mmt-cal-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #b45309 !important;
          border: 1px solid rgba(180, 83, 9, 0.15) !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .mmt-cal-arrow:hover {
          background: rgba(180, 83, 9, 0.08) !important;
          border-color: #b45309 !important;
          color: #b45309 !important;
        }
        .mmt-cal-arrow.left {
          left: -2px;
        }
        .mmt-cal-arrow.right {
          right: -2px;
        }
        /* Days layout */
        .mmt-cal-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          margin-bottom: 10px;
        }
        .mmt-cal-weekday {
          font-size: 11px;
          font-weight: 600;
          color: rgba(0, 0, 0, 0.4) !important;
          height: 20px;
        }
        
        .mmt-cal-days-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          row-gap: 5px;
        }
        
        .mmt-cal-day-cell {
          height: 34px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 15px;
          font-weight: 500;
          color: #1f2937 !important;
          border-radius: 4px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .mmt-cal-day-cell:hover:not(.empty):not(.past) {
          background: rgba(234, 179, 8, 0.12) !important;
          color: #b45309 !important;
        }
        
        /* Selected Range styles */
        .mmt-cal-day-cell.selected-start {
          background: #eab308 !important;
          color: #111827 !important;
          border-radius: 4px 0 0 4px !important;
          font-weight: 500;
        }
        
        .mmt-cal-day-cell.selected-end {
          background: #eab308 !important;
          color: #111827 !important;
          border-radius: 0 4px 4px 0 !important;
          font-weight: 500;
        }
        
        .mmt-cal-day-cell.selected-start.selected-end {
          border-radius: 4px !important;
        }
        
        .mmt-cal-day-cell.in-range {
          background: rgba(234, 179, 8, 0.12) !important;
          color: #b45309 !important;
          border-radius: 0 !important;
        }
        
        .mmt-cal-day-cell.empty {
          cursor: default;
          pointer-events: none;
        }
        
        .mmt-cal-day-cell.past {
          color: rgba(0, 0, 0, 0.2) !important;
          cursor: default;
          pointer-events: none;
        }
        
        .mmt-day-num {
          z-index: 10;
          font-weight: inherit;
          margin-top: 0;
        }
        
        /* Hide arrows on opposite cols to make it look exactly like image */
        .mmt-cal-month-col:first-of-type .mmt-cal-arrow.right {
          display: none;
        }
        .mmt-cal-month-col:last-of-type .mmt-cal-arrow.left {
          display: none;
        }
        
        @media (max-width: 767px) {
          .mmt-calendar-overlay {
            width: 92vw !important;
            max-width: 380px !important;
            padding: 16px !important;
          }
          .mmt-cal-header-tabs {
            gap: 12px;
            margin-bottom: 16px;
            padding-bottom: 14px;
          }
          .mmt-cal-tab-date-top {
            font-size: 15px;
          }
          .mmt-cal-tab-date-bottom {
            font-size: 15px;
          }
          .mmt-cal-tab.active::after {
            bottom: -15.5px;
          }
          .mmt-cal-dual-months {
            flex-direction: column;
            gap: 16px;
          }
          .mmt-cal-month-col {
            width: 100% !important;
          }
          .mmt-cal-day-cell {
            font-size: 16px;
            height: 38px;
          }
          .mmt-cal-month-col:first-of-type .mmt-cal-arrow.right {
            display: flex;
          }
          .mmt-cal-month-col:last-of-type {
            display: none;
          }
        }
        `
      }} />

      {/* 1. Header Date Tabs Panel */}
      <div className="mmt-cal-header-tabs">
        <div 
          className={`mmt-cal-tab ${activeSelection === 'in' ? 'active' : ''}`}
          onClick={() => setActiveSelection('in')}
        >
          <CalendarIcon size={16} className="mmt-cal-tab-icon" />
          <div className="mmt-cal-tab-text">
            <span className="mmt-cal-tab-date-top">{formatDateParts(checkInDate).day}</span>
            <span className="mmt-cal-tab-date-top">{formatDateParts(checkInDate).month}</span>
            <span className="mmt-cal-tab-date-bottom">{formatDateParts(checkInDate).year}</span>
          </div>
        </div>
        
        <span className="mmt-cal-tab-dash">-</span>
        
        <div 
          className={`mmt-cal-tab ${activeSelection === 'out' ? 'active' : ''}`}
          onClick={() => setActiveSelection('out')}
        >
          <CalendarIcon size={16} className="mmt-cal-tab-icon" />
          <div className="mmt-cal-tab-text">
            <span className="mmt-cal-tab-date-top">{formatDateParts(checkOutDate).day}</span>
            <span className="mmt-cal-tab-date-top">{formatDateParts(checkOutDate).month}</span>
            <span className="mmt-cal-tab-date-bottom">{formatDateParts(checkOutDate).year}</span>
          </div>
        </div>
      </div>

      {/* 2. Side-by-Side Dual-Month Calendar Grids */}
      <div className="mmt-cal-dual-months">
        
        {/* Left Column - Month A */}
        <div className="mmt-cal-month-col">
          <div className="mmt-cal-month-title-row">
            <div className="mmt-cal-arrow left" onClick={handlePrevMonth} title="Previous Month">
              {/* Premium sleek arrow matching image */}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15m0 0l6.75-6.75M4.5 12l6.75 6.75" />
              </svg>
            </div>
            <h3 className="mmt-cal-month-name">
              {monthsList[leftMonth]} <span>{leftYear.toString().slice(-2)}</span>
            </h3>
          </div>
          
          <div className="mmt-cal-weekdays">
            {weekdays.map(w => <div key={w} className="mmt-cal-weekday">{w}</div>)}
          </div>
          
          <div className="mmt-cal-days-grid">
            {generateMonthGrid(leftMonth, leftYear).map((day, idx) => {
              if (day === null) return <div key={`empty-left-${idx}`} className="mmt-cal-day-cell empty" />;
              
              const isStart = isSameDay(day, checkInDate);
              const isEnd = isSameDay(day, checkOutDate);
              const inRange = isBetweenDays(day, checkInDate, checkOutDate);
              const festival = getFestivalForDate(day);
              
              // Check for past days compared to actual current date
              const baseToday = new Date();
              baseToday.setHours(0, 0, 0, 0);
              const isPast = day.getTime() < baseToday.getTime();
              
              return (
                <div
                  key={`day-left-${day.getDate()}`}
                  onClick={() => !isPast && handleDateClick(day)}
                  className={`mmt-cal-day-cell 
                    ${isStart ? 'selected-start' : ''} 
                    ${isEnd ? 'selected-end' : ''} 
                    ${inRange ? 'in-range' : ''}
                    ${festival ? 'has-festival' : ''}
                    ${isPast ? 'past' : ''}
                  `}
                  title={festival ? festival.fullName : undefined}
                >
                  {festival && festival.label && (
                    <span className="mmt-festival-label">{festival.label}</span>
                  )}
                  <span className="mmt-day-num">{day.getDate()}</span>
                  {festival && <span className="mmt-day-line" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column - Month B */}
        <div className="mmt-cal-month-col">
          <div className="mmt-cal-month-title-row">
            <h3 className="mmt-cal-month-name">
              {monthsList[rightMonth]} <span>{rightYear.toString().slice(-2)}</span>
            </h3>
            <div className="mmt-cal-arrow right" onClick={handleNextMonth} title="Next Month">
              {/* Premium sleek arrow matching image */}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
              </svg>
            </div>
          </div>
          
          <div className="mmt-cal-weekdays">
            {weekdays.map(w => <div key={w} className="mmt-cal-weekday">{w}</div>)}
          </div>
          
          <div className="mmt-cal-days-grid">
            {generateMonthGrid(rightMonth, rightYear).map((day, idx) => {
              if (day === null) return <div key={`empty-right-${idx}`} className="mmt-cal-day-cell empty" />;
              
              const isStart = isSameDay(day, checkInDate);
              const isEnd = isSameDay(day, checkOutDate);
              const inRange = isBetweenDays(day, checkInDate, checkOutDate);
              const festival = getFestivalForDate(day);
              
              // Check for past days compared to actual current date
              const baseToday = new Date();
              baseToday.setHours(0, 0, 0, 0);
              const isPast = day.getTime() < baseToday.getTime();
              
              return (
                <div
                  key={`day-right-${day.getDate()}`}
                  onClick={() => !isPast && handleDateClick(day)}
                  className={`mmt-cal-day-cell 
                    ${isStart ? 'selected-start' : ''} 
                    ${isEnd ? 'selected-end' : ''} 
                    ${inRange ? 'in-range' : ''}
                    ${festival ? 'has-festival' : ''}
                    ${isPast ? 'past' : ''}
                  `}
                  title={festival ? festival.fullName : undefined}
                >
                  {festival && festival.label && (
                    <span className="mmt-festival-label">{festival.label}</span>
                  )}
                  <span className="mmt-day-num">{day.getDate()}</span>
                  {festival && <span className="mmt-day-line" />}
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
    </>
  );
}
