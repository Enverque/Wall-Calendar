'use client'

import { useEffect, useRef } from 'react'

export default function HistoryModal({ events, day, month, year, onClose }) {
  const overlayRef = useRef(null)
  const cardRef    = useRef(null)

  useEffect(() => {
    if (!cardRef.current || !overlayRef.current) return
    overlayRef.current.style.opacity = '0'
    cardRef.current.style.opacity    = '0'
    cardRef.current.style.transform  = 'scale(0.93) translateY(20px)'
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (overlayRef.current) overlayRef.current.style.opacity = '1'
        if (cardRef.current) {
          cardRef.current.style.opacity   = '1'
          cardRef.current.style.transform = 'scale(1) translateY(0)'
        }
      })
    })
  }, [])

  const monthNames = ['January','February','March','April','May','June',
                      'July','August','September','October','November','December']

  const fallbackEvents = [
    {year: '?', event: 'History is still being written for this date.', wiki: 'https://en.wikipedia.org/wiki/Wikipedia:Contents'},
  ]

  const list = events?.length ? events.slice(0, 3) : fallbackEvents

  const eventColors = ['#eff6ff', '#fff7ed', '#f5f3ff']
  const eventTextColors = ['#1d4ed8', '#c2410c', '#6d28d9']

  return (
    <div
      ref={overlayRef}
      onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(15,23,42,0.42)',
          backdropFilter: 'blur(6px)',
        zIndex: 10000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
        transition: 'opacity 0.25s ease',
        opacity: 0,
      }}
    >
      <div
        ref={cardRef}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: 16,
          maxWidth: 430,
          width: '100%',
          maxHeight: '74vh',
          overflow: 'hidden',
          boxShadow: '0 20px 52px rgba(15,23,42,0.22)',
          border: '1px solid rgba(226,232,240,0.9)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
          opacity: 0,
          transform: 'scale(0.93) translateY(20px)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a, #1e3a8a 58%, #2563eb)',
          padding: '18px 20px',
          color: 'white',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.7rem', opacity: 0.8, letterSpacing: '0.08em', margin: 0, textTransform: 'uppercase' }}>
                On This Day
              </p>
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', fontWeight: 900, margin: '4px 0 0', letterSpacing: '-0.02em' }}>
                {monthNames[month]} {day}
              </h3>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '50%',
                width: 30, height: 30,
                cursor: 'pointer',
                color: 'white',
                fontSize: '1.2rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.3)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.2)'
              }}
            >
              ×
            </button>
          </div>
        </div>

        {}
        <div style={{ 
          padding: '16px 18px', 
          overflowY: 'auto',
          flex: 1,
        }}>
          {list.slice(0, 3).map((ev, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 12,
                padding: '12px 0',
                borderBottom: i < Math.min(list.length, 3) - 1 ? '1px solid #f1f5f9' : 'none',
                animation: `fadeInUp 0.4s ${0.1 + i * 0.1}s both`,
              }}
            >
              {}
              <div style={{
                flexShrink: 0,
                width: 42, height: 42,
                borderRadius: 11,
                background: eventColors[i],
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '0.66rem',
                color: eventTextColors[i],
                boxShadow: `0 3px 10px ${eventColors[i]}88`,
              }}>
                {ev.year}
              </div>

              {/* Event content */}
              <div style={{ flex: 1 }}>
                {ev.wiki ? (
                  <a
                    href={ev.wiki}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      fontSize: '0.78rem',
                      lineHeight: 1.55,
                      color: '#1d4ed8',
                      fontWeight: 600,
                      textDecoration: 'underline',
                      textUnderlineOffset: '3px',
                    }}
                  >
                    {ev.event}
                  </a>
                ) : (
                <p style={{ 
                  fontSize: '0.8rem', 
                  lineHeight: 1.55, 
                  margin: 0, 
                  color: '#0f172a',
                  fontWeight: 500,
                }}>
                  {ev.event}
                </p>
                )}
                {false && ev.wiki && (
                  <a
                    href={ev.wiki}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      marginTop: 8,
                      fontSize: '0.7rem',
                      color: '#1e6fe0',
                      fontWeight: 600,
                      textDecoration: 'none',
                      padding: '6px 10px',
                      borderRadius: 6,
                      background: '#dbeafe',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#bfdbfe'
                      e.target.style.transform = 'translateX(2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#dbeafe'
                      e.target.style.transform = 'translateX(0)'
                    }}
                  >
                     Read on Wikipedia
                    <span style={{ fontSize: '0.8em' }}>→</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Smooth scrollbar */
        div::-webkit-scrollbar {
          width: 6px;
        }

        div::-webkit-scrollbar-track {
          background: transparent;
        }

        div::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }

        div::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </div>
  )
}
