'use client'

export default function TimeTravelHeroFixed({
  src,
  previewSrc,
  month,
  year,
  isYearPickerOpen,
  onToggleYearPicker,
  onPrev,
  onNext,
  transitioning,
  transDirection,
  children,
}) {
  const previewActive = !!previewSrc
  const displaySrc = previewSrc || src

  let imgStyle = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
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
      className="relative "
      style={{ height: 240, background: '#0f172a', overflow: 'hidden', position: 'relative' }}
    >
      <img src={displaySrc} alt={`${month} ${year}`} style={imgStyle} />

      {previewActive && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.14), transparent 45%, rgba(255,255,255,0.08))',
            zIndex: 2,
          }}
        />
      )}

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, transparent 40%, rgba(0,0,0,0.55) 100%)',
          pointerEvents: 'none',
          zIndex: 4,
        }}
      />

      <div style={{ position: 'absolute', bottom: 40, right: 24, textAlign: 'right', color: 'white', zIndex: 5 }}>
        <button
          onClick={onToggleYearPicker}
          aria-label="Open year timeline"
          aria-expanded={isYearPickerOpen}
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 300,
            fontSize: '0.7rem',
            letterSpacing: '0.15em',
            opacity: 0.92,
            margin: 0,
            color: 'white',
            border: 'none',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 999,
            padding: '4px 10px',
            cursor: 'pointer',
          }}
        >
          {year}
        </button>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '2.2rem', lineHeight: 1, letterSpacing: '-0.02em', margin: 0, textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
          {month.toUpperCase()}
        </h2>
        {previewActive && (
          <p style={{ fontSize: '0.55rem', letterSpacing: '0.2em', opacity: 0.7, margin: '2px 0 0', animation: 'blink 0.3s step-end infinite' }}>
            DATE PREVIEW
          </p>
        )}
      </div>

      <button
        className="nav-btn"
        style={{ position: 'absolute', top: 12, left: 12, zIndex: 6 }}
        aria-label="Previous month"
        onClick={onPrev}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <button
        className="nav-btn"
        style={{ position: 'absolute', top: 12, left: 52, zIndex: 6 }}
        aria-label="Next month"
        onClick={onNext}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {children}

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
