'use client'

import { useState, useEffect } from 'react'

function roundCoord(value) {
  return Number(value.toFixed(3))
}

function getHandPoint(cx, cy, length, angleDeg) {
  const radians = (angleDeg - 90) * (Math.PI / 180)
  return {
    x: roundCoord(cx + Math.cos(radians) * length),
    y: roundCoord(cy + Math.sin(radians) * length),
  }
}

export default function TodayDisc({ day }) {
  const [now, setNow] = useState(() => new Date('2026-01-01T12:00:00'))

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const hours = now.getHours()
  const minutes = now.getMinutes()
  const seconds = now.getSeconds()
  const isNight = hours < 6 || hours >= 18

  const SIZE = 44
  const cx = SIZE / 2
  const cy = SIZE / 2
  const outerR = SIZE / 2 - 1.5
  const innerR = outerR - 4

  const hourAngle = ((hours % 12) + minutes / 60) * 30
  const minuteAngle = (minutes + seconds / 60) * 6
  const secondAngle = seconds * 6

  const hourHand = getHandPoint(cx, cy, 9, hourAngle)
  const minuteHand = getHandPoint(cx, cy, 13, minuteAngle)
  const secondHand = getHandPoint(cx, cy, 15, secondAngle)

  const palette = isNight
    ? {
        outer: '#08111f',
        inner: '#12233e',
        rim: '#7dd3fc',
        tick: '#cbd5e1',
        hour: '#f8fafc',
        minute: '#93c5fd',
        second: '#f472b6',
        center: '#f8fafc',
        day: '#e2e8f0',
        glow: 'rgba(56, 189, 248, 0.32)',
      }
    : {
        outer: '#fff6db',
        inner: '#fde68a',
        rim: '#f59e0b',
        tick: '#b45309',
        hour: '#7c2d12',
        minute: '#92400e',
        second: '#ef4444',
        center: '#7c2d12',
        day: '#78350f',
        glow: 'rgba(245, 158, 11, 0.26)',
      }

  const ticks = Array.from({ length: 12 }, (_, index) => {
    const angle = index * 30
    const outer = getHandPoint(cx, cy, innerR, angle)
    const inner = getHandPoint(cx, cy, innerR - (index % 3 === 0 ? 3.4 : 2), angle)
    return { outer, inner, angle }
  })

  return (
    <div
      style={{
        position: 'relative',
        width: SIZE,
        height: SIZE,
        filter: `drop-shadow(0 6px 12px ${palette.glow})`,
      }}
      title={`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}
    >
      <svg width={SIZE} height={SIZE} style={{ position: 'absolute', inset: 0 }}>
        <circle cx={cx} cy={cy} r={outerR} fill={palette.outer} />
        <circle cx={cx} cy={cy} r={innerR} fill={palette.inner} />
        <circle cx={cx} cy={cy} r={outerR} fill="none" stroke={palette.rim} strokeWidth="1.8" />
        <circle cx={cx} cy={cy} r={innerR} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />

        {ticks.map(({ outer, inner, angle }) => (
          <line
            key={angle}
            x1={inner.x}
            y1={inner.y}
            x2={outer.x}
            y2={outer.y}
            stroke={palette.tick}
            strokeWidth={angle % 90 === 0 ? 1.4 : 1}
            strokeLinecap="round"
            opacity={angle % 90 === 0 ? 0.95 : 0.72}
          />
        ))}

        <line
          x1={cx}
          y1={cy}
          x2={hourHand.x}
          y2={hourHand.y}
          stroke={palette.hour}
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <line
          x1={cx}
          y1={cy}
          x2={minuteHand.x}
          y2={minuteHand.y}
          stroke={palette.minute}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1={cx}
          y1={cy}
          x2={secondHand.x}
          y2={secondHand.y}
          stroke={palette.second}
          strokeWidth="1.2"
          strokeLinecap="round"
        />

        <circle cx={cx} cy={cy} r="2.6" fill={palette.center} />
      </svg>

      <span
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          paddingBottom: '5px',
          fontSize: '0.56rem',
          fontWeight: 800,
          color: palette.day,
          letterSpacing: '-0.02em',
          lineHeight: 1,
          zIndex: 2,
          textShadow: isNight ? '0 1px 2px rgba(0,0,0,0.35)' : '0 1px 1px rgba(255,255,255,0.35)',
        }}
      >
        {day}
      </span>
    </div>
  )
}
