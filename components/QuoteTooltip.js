'use client'

const QUOTE_COLORS = [
  { bg: '#ff6b6b', text: 'white', accent: '#ff5252' },
  { bg: '#4ecdc4', text: 'white', accent: '#45b7aa' },
  { bg: '#ffe66d', text: '#333', accent: '#ffd93d' },
  { bg: '#95e1d3', text: '#333', accent: '#7dd3c0' },
  { bg: '#f38181', text: 'white', accent: '#e06b6b' },
  { bg: '#aa96da', text: 'white', accent: '#9b7dd1' },
  { bg: '#fcbad3', text: '#333', accent: '#f9a3c7' },
  { bg: '#a8dadc', text: '#333', accent: '#8ec9d1' },
]

export default function QuoteTooltip({ quote, x, y, visible }) {
  if (!quote || !visible) return null

  // Handle both string and object types for quote
  const quoteText = typeof quote === 'object' ? (quote.text || quote.quote || JSON.stringify(quote)) : String(quote)
  
  const colorIndex = Math.abs(quoteText.charCodeAt(0) + quoteText.charCodeAt(quoteText.length - 1)) % QUOTE_COLORS.length
  const colors = QUOTE_COLORS[colorIndex]

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        zIndex: 9998,
        width: 'min(196px, calc(100vw - 36px))',
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 10px 24px rgba(0,0,0,0.18)',
        pointerEvents: 'none',
        animation: 'popIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      }}
    >
      <div
        style={{
          background: colors.bg,
          padding: '11px 13px',
          color: colors.text,
          borderRadius: 12,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(135deg, ${colors.bg}, ${colors.accent})`,
            opacity: 0.3,
            animation: 'shimmer 3s ease-in-out infinite',
          }}
        />

        {/* Quote icon */}
        <div
          style={{
            fontSize: '1.1rem',
            opacity: 0.4,
            marginBottom: 6,
            position: 'relative',
            zIndex: 1,
          }}
        >
          ✨
        </div>

        {/* Quote text */}
        <p
          style={{
            fontSize: '0.68rem',
            lineHeight: 1.45,
            margin: 0,
            fontWeight: 500,
            fontStyle: 'italic',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {quoteText}
        </p>

        {}
        <p
          style={{
            fontSize: '0.54rem',
            marginTop: 6,
            opacity: 0.7,
            position: 'relative',
            zIndex: 1,
            fontStyle: 'normal',
          }}
        >
          Double-click for history →
        </p>
      </div>

      <style>{`
        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.85) translateY(8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes shimmer {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  )
}
