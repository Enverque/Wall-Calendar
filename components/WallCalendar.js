'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import CalendarGrid from './CalendarGrid'
import NotesPanel from './NotesPanel'
import TimeTravelHeroFixed from './TimeTravelHeroFixed'
import YearTimeline from './YearTimeline'
import FestivalEffects from './FestivalEffects'
import { useCalendarData } from '../hooks/useCalendarData'

const MONTH_IMAGES = [
  'https://images.unsplash.com/photo-1551582045-6ec9c11d8697?w=900&q=80',
  'https://images.unsplash.com/photo-1643752722545-aad9a7384603?w=900&q=80',
  'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=900&q=80',
  'https://plus.unsplash.com/premium_photo-1775450651387-2a2085698dad?w=900&q=80',
  'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=900&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80',
  'https://images.unsplash.com/photo-1592906209472-a36b1f3782ef?w=900&q=80',
  'https://images.unsplash.com/photo-1659168497161-d21ce1bfc977?w=900&q=80',
  'https://images.unsplash.com/photo-1567790421672-259e131f9ac0?w=900&q=80',
  'https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?w=900&q=80',
  'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=900&q=80',
  'https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=900&q=80',
]

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

export default function WallCalendar() {
  const today = new Date()
  const { quotes, events, festivals } = useCalendarData()

  const [year, setYear]   = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [previewImage, setPreviewImage] = useState(null)
  const [showYearTimeline, setShowYearTimeline] = useState(false)
  const [festivalAnimationsEnabled, setFestivalAnimationsEnabled] = useState(true)
  const [festivalReplayToken, setFestivalReplayToken] = useState(0)
  const previewTimerRef = useRef(null)
  const flipSwapTimerRef = useRef(null)
  const flipResetTimerRef = useRef(null)

  // Direction: 'past' | 'future' | null — drives the hero transition
  const [transitioning, setTransitioning]   = useState(false)
  const [transDirection, setTransDirection] = useState(null)
  const [pageFlipPhase, setPageFlipPhase] = useState('idle')
  const [pageFlipDirection, setPageFlipDirection] = useState(null)

  // Range selection
  const [rangeStart, setRangeStart] = useState(null)
  const [rangeEnd, setRangeEnd]     = useState(null)
  const [selecting, setSelecting]   = useState(false)

  // Notes
  const [notes, setNotes] = useState({})
  const currentNote = rangeStart ? notes[`${rangeStart.y}-${rangeStart.m}-${rangeStart.d}`] || '' : ''

  const handleNoteChange = (text) => {
    if (!rangeStart) return
    const key = `${rangeStart.y}-${rangeStart.m}-${rangeStart.d}`
    setNotes(prev => ({ ...prev, [key]: text }))
  }

  useEffect(() => {
    if ([0, 2, 7, 10, 11].includes(month)) {
      setFestivalReplayToken((token) => token + 1)
    }
  }, [month, year])

  useEffect(() => {
    if (festivalAnimationsEnabled && [0, 2, 7, 10, 11].includes(month)) {
      setFestivalReplayToken((token) => token + 1)
    }
  }, [festivalAnimationsEnabled, month])

  const navigate = useCallback((direction) => {
    if (pageFlipPhase !== 'idle') return

    if (previewTimerRef.current) clearTimeout(previewTimerRef.current)
    if (flipSwapTimerRef.current) clearTimeout(flipSwapTimerRef.current)
    if (flipResetTimerRef.current) clearTimeout(flipResetTimerRef.current)

    setPreviewImage(null)
    setTransitioning(true)
    setTransDirection(direction)
    setPageFlipDirection(direction)
    setPageFlipPhase('out')

    flipSwapTimerRef.current = setTimeout(() => {
      if (direction === 'past') {
        if (month === 0) { setMonth(11); setYear((y) => y - 1) }
        else setMonth((m) => m - 1)
      } else {
        if (month === 11) { setMonth(0); setYear((y) => y + 1) }
        else setMonth((m) => m + 1)
      }
      setPageFlipPhase('in')
    }, 320)

    flipResetTimerRef.current = setTimeout(() => {
      setPageFlipPhase('idle')
      setTransitioning(false)
      setTransDirection(null)
      setPageFlipDirection(null)
    }, 760)
  }, [month, pageFlipPhase])

  const prevMonth = () => navigate('past')
  const nextMonth = () => navigate('future')

  const handleDayClick = useCallback((day) => {
    if (!day) return
    const clicked = { y: year, m: month, d: day }
    if (!selecting || !rangeStart) {
      setRangeStart(clicked); setRangeEnd(null); setSelecting(true)
    } else {
      const startTs = new Date(rangeStart.y, rangeStart.m, rangeStart.d)
      const endTs   = new Date(clicked.y, clicked.m, clicked.d)
      if (endTs < startTs) {
        setRangeStart(clicked); setRangeEnd(rangeStart)
      } else {
        setRangeEnd(clicked)
      }
      setSelecting(false)
    }
  }, [selecting, rangeStart, year, month])

  const clearRange = () => {
    setRangeStart(null); setRangeEnd(null); setSelecting(false)
  }

  const toggleYearTimeline = useCallback(() => {
    setShowYearTimeline((open) => !open)
  }, [])

  const handleSelectYear = useCallback((nextYear) => {
    setYear(nextYear)
    setShowYearTimeline(false)
  }, [])

  const handleDayHoverImage = useCallback((day) => {
    if (previewTimerRef.current) clearTimeout(previewTimerRef.current)

    if (!day) {
      setPreviewImage(null)
      return
    }

    const imageIndex = (day - 1) % MONTH_IMAGES.length
    previewTimerRef.current = setTimeout(() => {
      setPreviewImage(MONTH_IMAGES[imageIndex])
    }, 180)
  }, [])

  useEffect(() => {
    return () => {
      if (previewTimerRef.current) clearTimeout(previewTimerRef.current)
      if (flipSwapTimerRef.current) clearTimeout(flipSwapTimerRef.current)
      if (flipResetTimerRef.current) clearTimeout(flipResetTimerRef.current)
    }
  }, [])

  return (
    <div className="w-full max-w-5xl px-4 md:px-6 pt-10">
      <FestivalEffects
        month={month}
        replayToken={festivalReplayToken}
        enabled={festivalAnimationsEnabled}
      />

      {/* Spiral binding */}
      <div className="spiral">
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className="spiral-ring" />
        ))}
      </div>

      {/* Main calendar card */}
      <div
  className="rounded-b-2xl shadow-2xl overflow-hidden animate-in min-h-[780px] border border-slate-200/80"
  style={{
    background: 'linear-gradient(180deg, rgb(255, 255, 255) 0%, rgba(180, 188, 222, 0.71) 100%)',
  }}
>
        {}
        <TimeTravelHeroFixed
          src={MONTH_IMAGES[month]}
          previewSrc={previewImage}
          month={MONTH_NAMES[month]}
          year={year}
          isYearPickerOpen={showYearTimeline}
          onToggleYearPicker={toggleYearTimeline}
          onPrev={prevMonth}
          onNext={nextMonth}
          transitioning={transitioning}
          transDirection={transDirection}
        >
          <button
            onClick={() => setFestivalAnimationsEnabled((enabled) => !enabled)}
            aria-pressed={festivalAnimationsEnabled}
            style={{
              position: 'absolute',
              top: 12,
              right: 24,
              zIndex: 7,
              border: '1px solid rgba(255,255,255,0.18)',
              background: festivalAnimationsEnabled ? 'rgba(255,255,255,0.18)' : 'rgba(15,23,42,0.42)',
              color: 'white',
              borderRadius: 999,
              padding: '6px 12px',
              fontSize: '0.66rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
            }}
          >
            {festivalAnimationsEnabled ? 'Festive On' : 'Festive Off'}
          </button>
          {showYearTimeline && (
            <YearTimeline
              currentYear={year}
              onSelectYear={handleSelectYear}
              onClose={() => setShowYearTimeline(false)}
            />
          )}
        </TimeTravelHeroFixed>

        {}
        <div
          className={`calendar-page-shell ${
            pageFlipPhase !== 'idle' ? `page-flip-${pageFlipPhase} page-flip-${pageFlipDirection}` : ''
          }`}
        >
          <div className="calendar-page-shadow" />
          <div className="flex flex-col md:flex-row calendar-page-body">
            {/* Notes panel */}
            <NotesPanel
              note={currentNote}
              onChange={handleNoteChange}
              rangeStart={rangeStart}
              rangeEnd={rangeEnd}
              monthName={MONTH_NAMES[month]}
            />

            {}
            <div className="flex-1 p-5 md:p-8">
              <CalendarGrid
                year={year}
                month={month}
                today={today}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                onDayClick={handleDayClick}
                onDayHoverImage={handleDayHoverImage}
                quotes={quotes}
                events={events}
                festivals={festivals}
              />

              {(rangeStart || rangeEnd) && (
                <button
                  onClick={clearRange}
                  className="mt-3 text-xs text-black hover:text-red-400 transition-colors underline"
                >
                  Clear selection
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .spiral {
          display: flex;
          justify-content: center;
          gap: 18px;
          padding: 60px 28px 4px;
          position: relative;
          z-index: 10;
          margin-bottom: -2px;
          width: 100%;
          align-items: flex-end;
        }

        .spiral-ring {
          width: 18px;
          height: 28px;
          position: relative;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .spiral-ring::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 10px;
          height: 22px;
          border: 3px solid #94a3b8;
          border-bottom: none;
          border-radius: 999px 999px 8px 8px;
          background: transparent;
          box-shadow:
            inset 1px 0 0 rgba(255,255,255,0.5),
            0 1px 2px rgba(15,23,42,0.12);
        }

        .spiral-ring::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 50%;
          transform: translateX(-50%);
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: #eef2f7;
          box-shadow:
            0 0 0 2px rgba(203,213,225,0.95),
            inset 0 1px 0 rgba(255,255,255,0.95);
        }

        .spiral::before {
          content: '';
          position: absolute;
          left: 18px;
          right: 18px;
          bottom: -4px;
          height: 10px;
          border-radius: 999px 999px 0 0;
          background: linear-gradient(180deg, rgba(255,255,255,0.94), rgba(226,232,240,0.88));
          border-top: 1px solid rgba(203,213,225,0.9);
          z-index: -1;
        }

        .spiral::after {
          content: '';
          position: absolute;
          left: 24px;
          right: 24px;
          bottom: 1px;
          height: 1px;
          background: rgba(255,255,255,0.75);
          z-index: -1;
        }

        .spiral-ring:nth-child(7),
        .spiral-ring:nth-child(8) {
          margin-right: 0;
        }


        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .animate-in {
          animation: slideUp 0.35s ease forwards;
        }

        .calendar-page-shell {
          position: relative;
          perspective: 1800px;
          perspective-origin: center top;
          transform-style: preserve-3d;
          isolation: isolate;
        }

        .calendar-page-body {
          position: relative;
          z-index: 2;
          transform-origin: center top;
          transform-style: preserve-3d;
          backface-visibility: hidden;
          will-change: transform, opacity, filter;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.99) 0%, rgba(187, 193, 216, 0.98) 100%);
        }

        .calendar-page-shell::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 16px;
          z-index: 3;
          pointer-events: none;
          background: linear-gradient(180deg, rgba(15,23,42,0.09), rgba(15,23,42,0));
          opacity: 0.55;
        }

        .calendar-page-shadow {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          opacity: 0;
          background:
            radial-gradient(circle at 50% 0%, rgba(15,23,42,0.18), rgba(15,23,42,0) 58%),
            linear-gradient(180deg, rgba(15,23,42,0.09), rgba(15,23,42,0) 40%);
          transform-origin: center top;
          will-change: opacity, transform;
        }

        .page-flip-out .calendar-page-body,
        .page-flip-in .calendar-page-body {
          pointer-events: none;
        }

        .page-flip-out.page-flip-future .calendar-page-body {
          animation: pageFlipOutFuture 0.34s cubic-bezier(0.45, 0.04, 0.74, 0.94) forwards;
        }

        .page-flip-in.page-flip-future .calendar-page-body {
          animation: pageFlipInFuture 0.42s cubic-bezier(0.16, 0.84, 0.24, 1) forwards;
        }

        .page-flip-out.page-flip-past .calendar-page-body {
          animation: pageFlipOutPast 0.34s cubic-bezier(0.45, 0.04, 0.74, 0.94) forwards;
        }

        .page-flip-in.page-flip-past .calendar-page-body {
          animation: pageFlipInPast 0.42s cubic-bezier(0.16, 0.84, 0.24, 1) forwards;
        }

        .page-flip-out .calendar-page-shadow {
          animation: pageShadowOut 0.34s ease forwards;
        }

        .page-flip-in .calendar-page-shadow {
          animation: pageShadowIn 0.42s ease forwards;
        }

        @keyframes pageFlipOutFuture {
          0% {
            transform: rotateX(0deg) translateY(0) scaleY(1);
            opacity: 1;
            filter: brightness(1) saturate(1);
          }
          45% {
            transform: rotateX(-16deg) translateY(-8px) scaleY(0.995);
            opacity: 0.96;
            filter: brightness(0.98) saturate(0.98);
          }
          100% {
            transform: rotateX(-78deg) translateY(-28px) scaleY(0.98);
            opacity: 0.2;
            filter: brightness(0.88) saturate(0.92);
          }
        }

        @keyframes pageFlipInFuture {
          0% {
            transform: rotateX(82deg) translateY(24px) scaleY(0.97);
            opacity: 0.18;
            filter: brightness(0.84) saturate(0.9);
          }
          55% {
            transform: rotateX(-10deg) translateY(-4px) scaleY(1.01);
            opacity: 0.92;
            filter: brightness(1.02) saturate(1.02);
          }
          100% {
            transform: rotateX(0deg) translateY(0) scaleY(1);
            opacity: 1;
            filter: brightness(1) saturate(1);
          }
        }

        @keyframes pageFlipOutPast {
          0% {
            transform: rotateX(0deg) translateY(0) scaleY(1);
            opacity: 1;
            filter: brightness(1) saturate(1);
          }
          45% {
            transform: rotateX(14deg) translateY(8px) scaleY(0.995);
            opacity: 0.96;
            filter: brightness(0.98) saturate(0.98);
          }
          100% {
            transform: rotateX(76deg) translateY(30px) scaleY(0.98);
            opacity: 0.2;
            filter: brightness(0.88) saturate(0.92);
          }
        }

        @keyframes pageFlipInPast {
          0% {
            transform: rotateX(-82deg) translateY(-24px) scaleY(0.97);
            opacity: 0.18;
            filter: brightness(0.84) saturate(0.9);
          }
          55% {
            transform: rotateX(10deg) translateY(4px) scaleY(1.01);
            opacity: 0.92;
            filter: brightness(1.02) saturate(1.02);
          }
          100% {
            transform: rotateX(0deg) translateY(0) scaleY(1);
            opacity: 1;
            filter: brightness(1) saturate(1);
          }
        }

        @keyframes pageShadowOut {
          0% {
            opacity: 0;
            transform: translateY(0) scaleY(1);
          }
          100% {
            opacity: 1;
            transform: translateY(10px) scaleY(1.05);
          }
        }

        @keyframes pageShadowIn {
          0% {
            opacity: 1;
            transform: translateY(-8px) scaleY(1.03);
          }
          100% {
            opacity: 0;
            transform: translateY(0) scaleY(1);
          }
        }

        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 3px; }
      `}</style>
    </div>
  )
}
