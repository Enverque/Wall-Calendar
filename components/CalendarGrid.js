'use client'

import { useMemo, useState, useCallback, useRef, useEffect } from 'react'
import TodayDisc from './TodayDisc'
import QuoteTooltip from './QuoteTooltip'
import HistoryModal from './HistoryModal'
import FestivalTooltip from './FestivalTooltip'
import SpecialDayReminder from './SpecialDayReminder'

const DAY_HEADERS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']

function toTs(obj) {
  if (!obj) return null
  return new Date(obj.y, obj.m, obj.d).getTime()
}

function pad2(n) {
  return String(n).padStart(2, '0')
}

function getQuoteForDay(quotes, year, month, day) {
  if (!quotes || !quotes.length) return null
  const idx = Math.abs((year * 400 + month * 31 + day)) % quotes.length
  return quotes[idx]
}

// Special days (reminders) - MM-DD format
const SPECIAL_DAYS = {
  '01-01': { name: 'New Year', emoji: '🎉', color: '#ff6b6b' },
  '02-14': { name: 'Valentine\'s Day', emoji: '💝', color: '#ff69b4' },
  '03-17': { name: 'St. Patrick\'s Day', emoji: '🍀', color: '#2ecc71' },
  '04-22': { name: 'Earth Day', emoji: '🌍', color: '#27ae60' },
  '05-05': { name: 'Cinco de Mayo', emoji: '🎊', color: '#f39c12' },
  '07-04': { name: 'Independence Day', emoji: '🇺🇸', color: '#3498db' },
  '10-31': { name: 'Halloween', emoji: '👻', color: '#ff8c00' },
  '12-25': { name: 'Christmas', emoji: '🎄', color: '#e74c3c' },
  '08-15': { name: 'Independence Day (India)', emoji: '🇮🇳', color: '#ff9933' },
  '03-08': { name: 'International Women\'s Day', emoji: '👩', color: '#e91e63' },
}

export default function CalendarGrid({
  year, month, today,
  rangeStart, rangeEnd,
  onDayClick,
  onDayHoverImage,
  quotes, events, festivals,
}) {
  const containerRef = useRef(null)
  const days = useMemo(() => {
    const firstDay    = new Date(year, month, 1).getDay()
    const offset      = (firstDay + 6) % 7
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const cells = []
    for (let i = 0; i < offset; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)
    return cells
  }, [year, month])

  const startTs = toTs(rangeStart)
  const endTs   = toTs(rangeEnd)

  const isToday = (d) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear()

  const [hoverQuote, setHoverQuote] = useState(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const [hoverFest, setHoverFest]   = useState(null)
  const [festPos, setFestPos]       = useState({ x: 0, y: 0 })
  const [historyDay, setHistoryDay] = useState(null)
  const [reminderDay, setReminderDay] = useState(null)
  const [reminderPos, setReminderPos] = useState({ x: 0, y: 0 })
  const [cellAnimations, setCellAnimations] = useState({})
  const hoverTimer = useRef(null)

  const getPopupPosition = useCallback((rect, popupWidth, popupHeight, options = {}) => {
    if (!containerRef.current) return { x: 0, y: 0 }

    const margin = 12
    const gap = options.gap ?? 10
    const align = options.align ?? 'center'
    const containerRect = containerRef.current.getBoundingClientRect()
    const dayLeft = rect.left - containerRect.left
    const dayTop = rect.top - containerRect.top
    const dayRight = dayLeft + rect.width
    const dayBottom = dayTop + rect.height
    const centerX = dayLeft + rect.width / 2
    const centerY = dayTop + rect.height / 2

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

    const buildPosition = (side) => {
      let x = dayLeft
      let y = dayTop

      if (side === 'right') {
        x = dayRight + gap
        y = centerY - popupHeight / 2
      }

      if (side === 'left') {
        x = dayLeft - popupWidth - gap
        y = centerY - popupHeight / 2
      }

      if (side === 'top') {
        y = dayTop - popupHeight - gap
        if (align === 'start') x = dayLeft
        if (align === 'end') x = dayRight - popupWidth
        if (align === 'center') x = centerX - popupWidth / 2
      }

      if (side === 'bottom') {
        y = dayBottom + gap
        if (align === 'start') x = dayLeft
        if (align === 'end') x = dayRight - popupWidth
        if (align === 'center') x = centerX - popupWidth / 2
      }

      return {
        x: clamp(x, margin, Math.max(margin, containerRect.width - popupWidth - margin)),
        y: clamp(y, margin, Math.max(margin, containerRect.height - popupHeight - margin)),
      }
    }

    const fitsWithoutOverlap = (position, side) => {
      if (side === 'right') return position.x >= dayRight + Math.max(8, gap / 2)
      if (side === 'left') return position.x + popupWidth <= dayLeft - Math.max(8, gap / 2)
      if (side === 'top') return position.y + popupHeight <= dayTop - Math.max(8, gap / 2)
      if (side === 'bottom') return position.y >= dayBottom + Math.max(8, gap / 2)
      return true
    }

    const preferredSides = options.sides ?? [options.side ?? 'top']

    for (const side of preferredSides) {
      const position = buildPosition(side)
      if (fitsWithoutOverlap(position, side)) {
        return position
      }
    }

    return buildPosition(preferredSides[0] ?? 'top')
  }, [])

  
  useEffect(() => {
    const animations = {}
    days.forEach((d, idx) => {
      if (d) {
        animations[d] = {
          delay: idx * 30,
          animation: 'fadeInScale'
        }
      }
    })
    setCellAnimations(animations)
  }, [days])

  const getFestival = useCallback((d) => {
    if (!d || !festivals || !Object.keys(festivals).length) return null
    const key = `${pad2(month + 1)}-${pad2(d)}`
    return festivals[key] || null
  }, [month, festivals])

  const getSpecialDay = useCallback((d) => {
    if (!d) return null
    const key = `${pad2(month + 1)}-${pad2(d)}`
    return SPECIAL_DAYS[key] || null
  }, [month])

  const handleMouseEnter = useCallback((e, d) => {
    if (!d) return
    onDayHoverImage?.(d)

    const rect = e.currentTarget.getBoundingClientRect()
    const quotePosition = getPopupPosition(rect, 196, 112, {
      side: 'right',
      sides: ['right', 'left', 'bottom', 'top'],
      align: 'center',
      gap: 32,
    })
    const festivalPosition = getPopupPosition(rect, 164, 132, {
      side: 'left',
      sides: ['left', 'right', 'top', 'bottom'],
      align: 'center',
      gap: 24,
    })
    const specialPosition = getPopupPosition(rect, 248, 92, {
      side: rect.bottom - (containerRef.current?.getBoundingClientRect().top ?? 0) > 240 ? 'top' : 'bottom',
      sides: rect.bottom - (containerRef.current?.getBoundingClientRect().top ?? 0) > 240
        ? ['top', 'bottom', 'right', 'left']
        : ['bottom', 'top', 'right', 'left'],
      align: 'center',
      gap: 30,
    })

    // Clear previous timer
    if (hoverTimer.current) clearTimeout(hoverTimer.current)

    // Show special day reminder
    const special = getSpecialDay(d)
    if (special) {
      setHoverQuote(null)
      setHoverFest(null)
      setReminderDay(special)
      setReminderPos(specialPosition)
      return
    }

    const currentDay = isToday(d)

    // Show quote only for the current non-special day
    if (currentDay) {
      const quote = getQuoteForDay(quotes, year, month, d)
      if (quote) {
        setHoverQuote(quote)
        setTooltipPos(quotePosition)
      }
    } else {
      setHoverQuote(null)
    }

  
    const fest = getFestival(d)
    if (fest) {
      setHoverFest(fest)
      setFestPos(festivalPosition)
    }
  }, [year, month, quotes, getFestival, getPopupPosition, getSpecialDay, onDayHoverImage])

  const handleMouseLeave = useCallback(() => {
    onDayHoverImage?.(null)
    hoverTimer.current = setTimeout(() => {
      setHoverQuote(null)
      setHoverFest(null)
      setReminderDay(null)
      setReminderPos({ x: 0, y: 0 })
    }, 100)
  }, [onDayHoverImage])

  const handleDayDoubleClick = useCallback((d) => {
    if (!d) return
    const eventKey = `${pad2(month + 1)}-${pad2(d)}`
    const eventsForDay = Array.isArray(events?.[eventKey]) ? events[eventKey].slice(0, 3) : null

    setHistoryDay({ day: d, month, year, events: eventsForDay })
  }, [month, year, events])

  const isInRange = (d) => {
    if (!startTs || !endTs) return false
    const dTs = new Date(year, month, d).getTime()
    return dTs >= startTs && dTs <= endTs
  }

  const isRangeStart = (d) =>
    d === rangeStart?.d && month === rangeStart?.m && year === rangeStart?.y

  const isRangeEnd = (d) =>
    d === rangeEnd?.d && month === rangeEnd?.m && year === rangeEnd?.y

  const isPastDay = (d) => {
    if (!d) return false
    if (year !== today.getFullYear() || month !== today.getMonth()) return false
    const currentDate = new Date(year, month, d)
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    return currentDate < todayOnly
  }

  return (
    <div ref={containerRef} className="calendar-container">
      {}
      <div className="calendar-headers">
        {DAY_HEADERS.map(h => (
          <div key={h} className="calendar-header-cell">{h}</div>
        ))}
      </div>

      {}
      <div className="calendar-grid">
        {days.map((d, idx) => {
          const fest = getFestival(d)
          const special = getSpecialDay(d)
          const animation = cellAnimations[d]

          return (
            <div
              key={idx}
              className={`day-cell ${!d ? 'day-empty' : ''} ${isToday(d) ? 'day-today' : ''} ${
                isRangeStart(d) ? 'day-start' : ''
              } ${isRangeEnd(d) ? 'day-end' : ''} ${isInRange(d) ? 'day-in-range' : ''} ${
                fest ? 'day-festival' : ''
              } ${special ? 'day-special' : ''} ${isPastDay(d) ? 'day-past' : ''}`}
              onClick={() => onDayClick(d)}
              onDoubleClick={() => handleDayDoubleClick(d)}
              onMouseEnter={(e) => handleMouseEnter(e, d)}
              onMouseLeave={handleMouseLeave}
              style={{
                animationName: animation ? animation.animation : 'none',
                animationDuration: '0.4s',
                animationTimingFunction: 'ease-out',
                animationFillMode: 'forwards',
                animationDelay: animation ? `${animation.delay}ms` : '0ms',
              }}
            >
              {d && (
                <>
                  {isToday(d) ? (
                    <TodayDisc day={d} />
                  ) : (
                    <span className="day-number">{d}</span>
                  )}
                  {fest && <span className="festival-indicator">{fest.emoji}</span>}
                  {special && <span className="special-indicator">⭐</span>}
                </>
              )}
            </div>
          )
        })}
      </div>

      {}
      <QuoteTooltip quote={hoverQuote} x={tooltipPos.x} y={tooltipPos.y} visible={!!hoverQuote} />
      <FestivalTooltip festival={hoverFest} x={festPos.x} y={festPos.y} visible={!!hoverFest} />
      <SpecialDayReminder day={reminderDay} x={reminderPos.x} y={reminderPos.y} visible={!!reminderDay} />

      {}
      {historyDay && (
        <HistoryModal
          events={historyDay.events}
          day={historyDay.day}
          month={historyDay.month}
          year={historyDay.year}
          onClose={() => setHistoryDay(null)}
        />
      )}

      <style>{`
        .calendar-container {
          width: 100%;
          min-width: 0;
          position: relative;
          overflow: visible;
        }

        .calendar-headers {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 8px;
          margin-bottom: 12px;
        }

        .calendar-header-cell {
          text-align: center;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: var(--muted);
          text-transform: uppercase;
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 8px;
        }

        .day-cell {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.92rem;
          font-weight: 400;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.15s ease;
          position: relative;
          user-select: none;
          -webkit-tap-highlight-color: transparent;
        }

        .day-cell:not(.day-empty):hover {
          background: #00439a;
          transform: scale(1.08);
          box-shadow: 0 4px 12px rgba(8, 63, 140, 0.92);
        }

        .day-cell.day-empty {
          cursor: default;
          opacity: 0.3;
        }

        .day-cell.day-past:not(.day-start):not(.day-end):not(.day-in-range) {
          color: rgba(15, 23, 42, 0.42);
        }

        .day-cell.day-start,
        .day-cell.day-end {
          background: var(--accent);
          color: white;
          font-weight: 600;
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(30, 111, 224, 0.4);
        }

        .day-cell.day-in-range {
          background: var(--range-bg);
          color: #f8fbff;
          border-radius: 0;
        }

        .day-cell.day-start {
          border-radius: 50% 0 0 50%;
        }

        .day-cell.day-end {
          border-radius: 0 50% 50% 0;
        }

        .day-cell.day-start.day-end {
          border-radius: 50%;
        }

        .day-cell.day-today:not(.day-start):not(.day-end) {
          border: 2px solid var(--accent);
          color: var(--accent);
          font-weight: 600;
        }

        .day-cell.day-festival {
          box-shadow: inset 0 0 0 1.5px rgba(245, 158, 11, 0.6);
        }

        .day-cell.day-festival:hover {
          background: rgba(245, 158, 11, 0.1) !important;
        }

        .day-cell.day-special {
          box-shadow: inset 0 0 0 1.5px rgba(255, 107, 107, 0.6);
        }

        .day-cell.day-special:hover {
          background: rgba(255, 107, 107, 0.1) !important;
        }

        .day-number {
          z-index: 2;
          position: relative;
          font-size: 1em;
        }

        .day-cell.day-past:not(.day-start):not(.day-end):not(.day-in-range) .day-number {
          color: rgba(15, 23, 42, 0.42);
        }

        .festival-indicator {
          position: absolute;
          top: 2px;
          right: 2px;
          font-size: 0.6rem;
          animation: bounce 0.6s ease-in-out infinite;
        }

        .special-indicator {
          position: absolute;
          top: 2px;
          left: 2px;
          font-size: 0.6rem;
          animation: twinkle 1.5s ease-in-out infinite;
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @media (max-width: 640px) {
          .calendar-headers,
          .calendar-grid {
            gap: 4px;
          }

          .calendar-header-cell {
            font-size: 0.6rem;
            letter-spacing: 0.06em;
          }

          .day-cell {
            font-size: 0.82rem;
          }

          .festival-indicator,
          .special-indicator {
            font-size: 0.5rem;
          }
        }
      `}</style>
    </div>
  )
}
