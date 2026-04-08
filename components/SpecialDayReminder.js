'use client'

export default function SpecialDayReminder({ day, x, y, visible }) {
  if (!day || !visible) return null

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        zIndex: 9999,
        width: 'min(228px, calc(100% - 28px))',
        borderRadius: '14px',
        overflow: 'hidden',
        boxShadow: '0 16px 32px rgba(0,0,0,0.16)',
        pointerEvents: 'none',
        animation: 'slideInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <div
        style={{
          background: day.color || '#ff6b6b',
          padding: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: 'white',
          position: 'relative',
        }}
      >
        {}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(45deg, rgba(255,255,255,0.15), transparent)',
          pointerEvents: 'none'
        }} />

        <div style={{ 
          fontSize: '1.35rem', 
          background: 'rgba(255,255,255,0.2)', 
          width: '38px', 
          height: '38px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          borderRadius: '10px',
          flexShrink: 0,
          position: 'relative',
          zIndex: 1
        }}>
          {day.emoji}
        </div>
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ 
            fontSize: '0.58rem', 
            opacity: 0.8, 
            margin: 0, 
            letterSpacing: '0.1em', 
            textTransform: 'uppercase',
            fontWeight: 700
          }}>
            Special Day
          </p>
          <p style={{ 
            fontSize: '0.8rem', 
            fontWeight: 700, 
            margin: '4px 0 0',
            lineHeight: 1.2
          }}>
            {day.name}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  )
}
