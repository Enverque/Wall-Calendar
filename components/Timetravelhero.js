'use client'

export default function TimeTravelHero({ src, previewSrc, month, year, onPrev, onNext, transitioning, transDirection }) {
  const previewActive = !!previewSrc
  const displaySrc = previewSrc || src

  // Transition styles
  let imgStyle = {
    position: 'absolute', inset: 0, width: '100%', height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.45s cubic-bezier(0.4,0,0.2,1), opacity 0.4s ease, filter 0.4s ease',
    transform: 'translateX(0) scale(1)',
    opacity: 1,
    filter: previewActive ? 'saturate(1.08) brightness(1.06)' : 'brightness(1)',
  }

  if (transitioning && !previewActive) {
    imgStyle = {
      ...imgStyle,
      transform: transDirection === 'future' ? 'translateX(-80px) scale(0.96)' : 'translateX(80px) scale(0.96)',
      opacity: 0,
      filter: 'brightness(1.5) blur(3px)',
    }
  }

  return (
    <div
      className="relative hero-clip"
      style={{ height: 240, background: '#0f172a', overflow: 'hidden', position: 'relative' }}
    >
      {}
      <img src={displaySrc} alt={`${month} ${year}`} style={imgStyle} />

      {}
      {timeTravelling && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(0,0,0,0.08) 3px,
            rgba(0,0,0,0.08) 4px
          )`,
          animation: 'scanlines 0.1s linear infinite',
          zIndex: 2,
        }} />
      )}

      {}
      {timeTravelling && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: ttDir === 'future'
            ? 'linear-gradient(90deg, transparent 60%, rgba(255,255,255,0.15) 80%, transparent 100%)'
            : 'linear-gradient(270deg, transparent 60%, rgba(255,255,255,0.15) 80%, transparent 100%)',
          animation: 'speedLine 0.12s linear infinite',
          zIndex: 3,
        }} />
      )}

      {}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, transparent 40%, rgba(0,0,0,0.55) 100%)',
          pointerEvents: 'none', zIndex: 4,
        }}
      />

      {}
      <div style={{ position: 'absolute', bottom: 40, right: 24, textAlign: 'right', color: 'white', zIndex: 5 }}>
        <p style={{ fontFamily: 'var(--font-body)', fontWeight: 300, fontSize: '0.7rem', letterSpacing: '0.15em', opacity: 0.85, margin: 0 }}>
          {year}
        </p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '2.2rem', lineHeight: 1, letterSpacing: '-0.02em', margin: 0, textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
          {month.toUpperCase()}
        </h2>
        {timeTravelling && (
          <p style={{ fontSize: '0.55rem', letterSpacing: '0.2em', opacity: 0.7, margin: '2px 0 0', animation: 'blink 0.3s step-end infinite' }}>
            TIME TRAVEL
          </p>
        )}
      </div>

      {}
      <button
        className="nav-btn"
        style={{ position: 'absolute', top: 12, left: 12, zIndex: 6 }}
        aria-label="Previous month"
        onClick={onPrev}
        onMouseEnter={() => startTimeTravel('past')}
        onMouseLeave={() => { stopTimeTravel(); }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {}
      <button
        className="nav-btn"
        style={{ position: 'absolute', top: 12, left: 52, zIndex: 6 }}
        aria-label="Next month"
        onClick={onNext}
        onMouseEnter={() => startTimeTravel('future')}
        onMouseLeave={() => { stopTimeTravel(); }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <style>{`
        @keyframes scanlines {
          from { background-position: 0 0; }
          to   { background-position: 0 4px; }
        }
        @keyframes speedLine {
          from { transform: translateX(-30%); }
          to   { transform: translateX(30%); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
