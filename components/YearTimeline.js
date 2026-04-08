'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

export default function YearTimeline({ currentYear, onSelectYear, onClose }) {
  const stripRef = useRef(null)
  const dragStateRef = useRef({ active: false, startX: 0, startScrollLeft: 0 })
  const [isDragging, setIsDragging] = useState(false)

  const years = useMemo(
    () => Array.from({ length: 81 }, (_, index) => currentYear - 40 + index),
    [currentYear]
  )

  useEffect(() => {
    if (!stripRef.current) return
    const activeIndex = years.findIndex((year) => year === currentYear)
    if (activeIndex < 0) return

    const itemWidth = 56
    const containerWidth = stripRef.current.clientWidth
    const targetLeft = activeIndex * itemWidth - containerWidth / 2 + itemWidth / 2
    stripRef.current.scrollTo({ left: Math.max(0, targetLeft), behavior: 'smooth' })
  }, [currentYear, years])

  const handlePointerDown = (event) => {
    if (!stripRef.current) return
    dragStateRef.current = {
      active: true,
      startX: event.clientX,
      startScrollLeft: stripRef.current.scrollLeft,
    }
    setIsDragging(true)
  }

  const handlePointerMove = (event) => {
    if (!dragStateRef.current.active || !stripRef.current) return
    const delta = event.clientX - dragStateRef.current.startX
    stripRef.current.scrollLeft = dragStateRef.current.startScrollLeft - delta
  }

  const stopDragging = () => {
    dragStateRef.current.active = false
    setIsDragging(false)
  }

  return (
    <div
      style={{
        position: 'absolute',
        right: 24,
        bottom: 18,
        zIndex: 8,
        width: 'min(520px, calc(100% - 48px))',
        borderRadius: 18,
        background: 'rgba(7, 16, 30, 0.72)',
        border: '1px solid rgba(255,255,255,0.14)',
        boxShadow: '0 18px 36px rgba(0,0,0,0.28)',
        backdropFilter: 'blur(12px)',
        padding: '14px 16px',
        color: 'white',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
        <div>
          <p style={{ margin: 0, fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.72 }}>
            Jump To Year
          </p>
          <p style={{ margin: '4px 0 0', fontSize: '0.78rem', opacity: 0.9 }}>
            Choose a year from the timeline
          </p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close year timeline"
          style={{
            width: 30,
            height: 30,
            borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.16)',
            background: 'rgba(255,255,255,0.08)',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          x
        </button>
      </div>

      <div style={{ position: 'relative', padding: '10px 0 4px' }}>
        <div
          style={{
            position: 'absolute',
            top: 23,
            left: 12,
            right: 12,
            height: 2,
            borderRadius: 999,
            background: 'linear-gradient(90deg, rgba(125,211,252,0.32), rgba(255,255,255,0.22), rgba(125,211,252,0.32))',
          }}
        />

        <div
          ref={stripRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDragging}
          onPointerLeave={stopDragging}
          onPointerCancel={stopDragging}
          style={{
            display: 'grid',
            gridAutoFlow: 'column',
            gridAutoColumns: '48px',
            gap: 8,
            alignItems: 'start',
            overflowX: 'auto',
            overflowY: 'hidden',
            paddingBottom: 6,
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
            scrollbarWidth: 'thin',
          }}
        >
          {years.map((year) => {
            const active = year === currentYear

            return (
              <button
                key={year}
                onClick={() => onSelectYear(year)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: active ? '#ffffff' : 'rgba(255,255,255,0.74)',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  minWidth: 48,
                }}
              >
                <span
                  style={{
                    width: active ? 14 : 10,
                    height: active ? 14 : 10,
                    borderRadius: 999,
                    background: active ? '#7dd3fc' : 'rgba(255,255,255,0.75)',
                    boxShadow: active ? '0 0 0 6px rgba(125,211,252,0.18)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                />
                <span
                  style={{
                    fontSize: active ? '0.8rem' : '0.72rem',
                    fontWeight: active ? 700 : 500,
                    lineHeight: 1,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {year}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
