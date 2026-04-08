'use client'

import Image from 'next/image'

export default function HeroImage({ src, month, year, onPrev, onNext, transitioning, transDirection }) {
  let imgStyle = {
    transition: 'transform 0.32s cubic-bezier(0.4,0,0.2,1), opacity 0.32s ease, filter 0.32s ease',
    transform: 'translateX(0)',
    opacity: 1,
    filter: 'brightness(1)',
  }

  if (transitioning) {
    imgStyle = {
      ...imgStyle,
      transform: transDirection === 'future' ? 'translateX(-60px)' : 'translateX(60px)',
      opacity: 0,
      filter: 'brightness(1.4) blur(2px)',
    }
  }

  return (
    <div className="relative hero-clip bg-gray-200" style={{ height: '220px', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, ...imgStyle }}>
        <Image
          src={src}
          alt={`${month} ${year}`}
          fill
          style={{ objectFit: 'cover' }}
          priority
          unoptimized
        />
      </div>

      {}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.45) 100%)',
          pointerEvents: 'none',
        }}
      />

      {}
      {transitioning && (
        <div
          style={{
            position: 'absolute', inset: 0,
            background: transDirection === 'future'
              ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
              : 'linear-gradient(90deg, transparent, rgba(0,0,0,0.2), transparent)',
            animation: 'timeSweep 0.32s ease forwards',
            pointerEvents: 'none',
          }}
        />
      )}

      {}
      <div className="absolute bottom-10 right-6 text-right text-white">
        <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '0.75rem', letterSpacing: '0.1em', opacity: 0.9, margin: 0 }}>
          {year}
        </p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '2rem', lineHeight: 1, letterSpacing: '-0.02em', margin: 0 }}>
          {month.toUpperCase()}
        </h2>
      </div>

      {}
      <button onClick={onPrev} aria-label="Previous month" className="nav-btn absolute top-3 left-3">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <button onClick={onNext} aria-label="Next month" className="nav-btn absolute top-3 left-11">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <style>{`
        @keyframes timeSweep {
          from { transform: translateX(-100%); }
          to   { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}
