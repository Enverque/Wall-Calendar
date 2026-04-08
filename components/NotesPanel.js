'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'

export default function NotesPanel({ note, onChange, rangeStart, rangeEnd, monthName }) {
  const [isFlipping, setIsFlipping] = useState(false)
  const didMountRef = useRef(false)

  const formatDate = (obj) => {
    if (!obj) return null
    const d = new Date(obj.y, obj.m, obj.d)
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    return `${monthNames[d.getMonth()]} ${d.getDate()}`
  }

  const startStr = formatDate(rangeStart)
  const endStr   = formatDate(rangeEnd)

  let label = 'Select a date'
  if (startStr && endStr) label = `${startStr} — ${endStr}`
  else if (startStr) label = startStr

  const selectionKey = useMemo(
    () => [
      rangeStart?.y ?? '',
      rangeStart?.m ?? '',
      rangeStart?.d ?? '',
      rangeEnd?.y ?? '',
      rangeEnd?.m ?? '',
      rangeEnd?.d ?? '',
    ].join('-'),
    [rangeStart, rangeEnd]
  )

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true
      return
    }

    setIsFlipping(true)
    const timer = setTimeout(() => setIsFlipping(false), 360)
    return () => clearTimeout(timer)
  }, [selectionKey])

  return (
    <div className="w-full md:w-80 lg:w-96 border-r border-gray-100 p-5 md:p-6 flex flex-col bg-gray-50/30">
      <div className="mb-6">
        <h3 className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase mb-1">
          Notes & Reminders
        </h3>
        <p className="text-sm font-medium text-gray-600 truncate">
          {label}
        </p>
      </div>

      <div className="flex-1 relative">
        <div className={`notes-flip-shell ${isFlipping ? 'is-flipping' : ''}`}>
          <div className="flex-1 relative notes-lines rounded-lg p-1 bg-white shadow-sm min-h-[300px]">
            <textarea
              className="notes-area"
              placeholder={rangeStart ? "Write something special..." : "Select a date to add notes"}
              value={note}
              onChange={(e) => onChange(e.target.value)}
              disabled={!rangeStart}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <p className="text-[10px] leading-relaxed text-black italic">
          &ldquo;The best way to predict the future is to create it.&rdquo;
        </p>
      </div>

      <style>{`
        .notes-flip-shell {
          width: 100%;
          height: 100%;
        }

        @media (min-width: 768px) {
          .notes-flip-shell {
            perspective: 1600px;
            position: relative;
            transform-style: preserve-3d;
          }

          .notes-flip-shell.is-flipping > .notes-lines {
            transform-origin: left center;
            backface-visibility: hidden;
            will-change: transform, opacity, filter;
            animation: notesAreaFlip 0.96s cubic-bezier(0.2, 0.78, 0.24, 1);
          }

          .notes-flip-shell.is-flipping::after {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 0.5rem;
            pointer-events: none;
            background: linear-gradient(
              90deg,
              rgba(15, 23, 42, 0.18) 0%,
              rgba(15, 23, 42, 0.08) 16%,
              rgba(255, 255, 255, 0.08) 44%,
              rgba(255, 255, 255, 0) 100%
            );
            transform-origin: left center;
            animation: notesPageShade 0.96s cubic-bezier(0.2, 0.78, 0.24, 1);
          }
        }

        @keyframes notesAreaFlip {
          0% {
            opacity: 0.97;
            transform: perspective(1600px) rotateY(-70deg) translateX(-4px) scaleX(0.97);
            filter: brightness(0.91);
          }
          58% {
            opacity: 1;
            transform: perspective(1600px) rotateY(10deg) translateX(1px) scaleX(1);
            filter: brightness(1.01);
          }
          100% {
            opacity: 1;
            transform: perspective(1600px) rotateY(0deg) translateX(0) scaleX(1);
            filter: brightness(1);
          }
        }

        @keyframes notesPageShade {
          0% {
            opacity: 0.14;
            transform: perspective(1600px) rotateY(-70deg);
          }
          58% {
            opacity: 0.09;
            transform: perspective(1600px) rotateY(10deg);
          }
          100% {
            opacity: 0;
            transform: perspective(1600px) rotateY(0deg);
          }
        }
      `}</style>
    </div>
  )
}
