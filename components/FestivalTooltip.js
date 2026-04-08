'use client'

export default function FestivalTooltip({ festival, x, y, visible }) {
  if (!festival || !visible) return null

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        zIndex: 9998,
        width: 'min(164px, calc(100vw - 24px))',
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 10px 24px rgba(0,0,0,0.18)',
        pointerEvents: 'none',
        animation: 'festPop 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      }}
    >
      {}
      {festival.image && (
        <img
          src={festival.image}
          alt={festival.name}
          style={{ 
            width: '100%', 
            height: 82, 
            objectFit: 'cover', 
            display: 'block',
            filter: 'brightness(1.1) saturate(1.2)',
          }}
        />
      )}

      {}
      <div style={{
        background: festival.color || '#f59e0b',
        padding: '10px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        boxShadow: `inset 0 -2px 8px rgba(0,0,0,0.1)`,
      }}>
        <span style={{ fontSize: '1rem' }}>{festival.emoji}</span>
        <div>
          <span style={{ 
            fontSize: '0.62rem', 
            color: 'white', 
            fontWeight: 700,
            display: 'block',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            opacity: 0.9,
          }}>
            Festival
          </span>
          <span style={{ 
            fontSize: '0.68rem', 
            color: 'white', 
            fontWeight: 600,
            display: 'block',
          }}>
            {festival.name}
          </span>
        </div>
      </div>

      <style>{`
        @keyframes festPop {
          from { 
            opacity: 0; 
            transform: scale(0.85) translateY(6px) rotate(-5deg);
          }
          to   { 
            opacity: 1; 
            transform: scale(1) translateY(0) rotate(0deg);
          }
        }
      `}</style>
    </div>
  )
}
