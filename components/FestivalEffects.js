'use client'

import { useEffect, useMemo, useRef } from 'react'

const MONTH_EFFECTS = {
  0: {
    key: 'january-kites',
    name: 'Kite Festival',
    duration: 5200,
    background: 'rgba(125, 211, 252, 0.08)',
    particleCount: 18,
    type: 'kites',
  },
  2: {
    key: 'march-holi',
    name: 'Holi Colors',
    duration: 3400,
    background: 'rgba(255, 255, 255, 0.06)',
    particleCount: 48,
    type: 'holi',
  },
  7: {
    key: 'august-monsoon',
    name: 'Monsoon Glow',
    duration: 4200,
    background: 'rgba(56, 189, 248, 0.08)',
    particleCount: 44,
    type: 'monsoon',
  },
  10: {
    key: 'november-diwali',
    name: 'Festival of Lights',
    duration: 4800,
    background: 'rgba(251, 191, 36, 0.08)',
    particleCount: 34,
    type: 'diwali',
  },
  11: {
    key: 'december-snow',
    name: 'Winter Sparkle',
    duration: 5200,
    background: 'rgba(255, 255, 255, 0.08)',
    particleCount: 72,
    type: 'snow',
  },
}

function createKites(width, height, count) {
  return Array.from({ length: count }, (_, index) => {
    const palettes = [
      { body: '#fb7185', accent: '#fff1f2', ribbon: '#fecdd3' },
      { body: '#f97316', accent: '#ffedd5', ribbon: '#fdba74' },
      { body: '#38bdf8', accent: '#e0f2fe', ribbon: '#7dd3fc' },
      { body: '#a78bfa', accent: '#f3e8ff', ribbon: '#c4b5fd' },
      { body: '#facc15', accent: '#fef9c3', ribbon: '#fde68a' },
    ][index % 5]

    return {
      x: ((index + 1) / (count + 1)) * width,
      y: 68 + Math.random() * Math.max(88, height * 0.22),
      drift: 0.6 + Math.random() * 1.8,
      bob: Math.random() * Math.PI * 2,
      size: 20 + Math.random() * 18,
      tail: 42 + Math.random() * 54,
      tailSegments: 4 + Math.floor(Math.random() * 3),
      sway: 12 + Math.random() * 18,
      rise: 5 + Math.random() * 10,
      rotation: 0.14 + Math.random() * 0.16,
      palettes,
    }
  })
}

function createHoli(width, height, count) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: height * 0.25 + Math.random() * height * 0.5,
    radius: 14 + Math.random() * 34,
    life: 0.55 + Math.random() * 0.35,
    hue: ['#f97316', '#ec4899', '#22c55e', '#38bdf8', '#facc15'][Math.floor(Math.random() * 5)],
    vx: (Math.random() - 0.5) * 1.5,
    vy: (Math.random() - 0.5) * 1.1,
  }))
}

function createMonsoon(width, height, count) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    len: 10 + Math.random() * 18,
    speed: 3 + Math.random() * 3,
    opacity: 0.15 + Math.random() * 0.25,
  }))
}

function createDiwali(width, height, count) {
  return Array.from({ length: count }, (_, index) => {
    const palette = [
      ['#fff7c2', '#f59e0b', '#fb7185'],
      ['#fff1b5', '#f97316', '#facc15'],
      ['#fff8db', '#fbbf24', '#f472b6'],
      ['#ffe8a3', '#fb7185', '#f59e0b'],
    ][index % 4]

    return {
      x: width * (0.12 + Math.random() * 0.76),
      y: height * (0.12 + Math.random() * 0.42),
      coreRadius: 18 + Math.random() * 22,
      ringRadius: 34 + Math.random() * 42,
      burstSize: 10 + Math.floor(Math.random() * 7),
      twinkleSpeed: 0.0018 + Math.random() * 0.0016,
      cycleDuration: 1700 + Math.random() * 1700,
      delay: Math.random() * 1800,
      trailHeight: 52 + Math.random() * 70,
      emberFall: 20 + Math.random() * 28,
      emberDrift: (Math.random() - 0.5) * 16,
      haloSize: 58 + Math.random() * 64,
      palette,
    }
  })
}

function createSnow(width, height, count) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: 1 + Math.random() * 3.4,
    drift: (Math.random() - 0.5) * 0.6,
    fall: 0.5 + Math.random() * 1.4,
    opacity: 0.4 + Math.random() * 0.45,
  }))
}

function drawKite(ctx, particle, elapsed) {
  const x = particle.x + Math.sin(elapsed * 0.0011 * particle.drift + particle.bob) * particle.sway
  const y = particle.y + Math.cos(elapsed * 0.00145 * particle.drift + particle.bob) * particle.rise
  const half = particle.size / 2

  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(Math.sin(elapsed * 0.00095 * particle.drift + particle.bob) * particle.rotation)

  const kiteGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, particle.size * 1.2)
  kiteGlow.addColorStop(0, 'rgba(255,255,255,0.16)')
  kiteGlow.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = kiteGlow
  ctx.beginPath()
  ctx.arc(0, 0, particle.size * 1.2, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = particle.palettes.body
  ctx.beginPath()
  ctx.moveTo(0, -half)
  ctx.lineTo(half, 0)
  ctx.lineTo(0, half)
  ctx.lineTo(-half, 0)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = particle.palettes.accent
  ctx.beginPath()
  ctx.moveTo(0, -half * 0.72)
  ctx.lineTo(half * 0.56, -half * 0.06)
  ctx.lineTo(0, half * 0.48)
  ctx.lineTo(-half * 0.56, -half * 0.06)
  ctx.closePath()
  ctx.fill()

  ctx.strokeStyle = 'rgba(255,255,255,0.72)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, -half)
  ctx.lineTo(0, half)
  ctx.moveTo(-half, 0)
  ctx.lineTo(half, 0)
  ctx.stroke()

  ctx.strokeStyle = 'rgba(255,255,255,0.58)'
  ctx.beginPath()
  ctx.moveTo(0, half)
  ctx.quadraticCurveTo(
    Math.sin(elapsed * 0.0018 + particle.bob) * 6,
    half + particle.tail * 0.35,
    Math.cos(elapsed * 0.0014 + particle.bob) * 10,
    particle.tail
  )
  ctx.stroke()

  for (let i = 0; i < particle.tailSegments; i++) {
    ctx.beginPath()
    const offset = half + 10 + i * 11
    const wag = Math.sin(elapsed * 0.0022 + particle.bob + i * 0.7) * 4
    ctx.strokeStyle = particle.palettes.ribbon
    ctx.moveTo(wag - 4, offset)
    ctx.lineTo(wag + 4, offset + 4)
    ctx.stroke()
  }

  ctx.fillStyle = 'rgba(255,255,255,0.8)'
  ctx.beginPath()
  ctx.arc(-half * 0.18, -half * 0.18, Math.max(1.3, particle.size * 0.07), 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function drawSoftGlow(ctx, width, height, alpha, color) {
  const gradient = ctx.createRadialGradient(width * 0.6, height * 0.25, 20, width * 0.6, height * 0.25, width * 0.45)
  gradient.addColorStop(0, `${color}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`)
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
}

function drawDiwaliBurst(ctx, particle, elapsed) {
  const cycleElapsed = (elapsed + particle.delay) % particle.cycleDuration
  const progress = cycleElapsed / particle.cycleDuration
  const riseProgress = Math.min(progress / 0.28, 1)
  const burstProgress = progress < 0.28 ? 0 : Math.min((progress - 0.28) / 0.72, 1)
  const launchY = particle.y + particle.trailHeight * (1 - riseProgress)
  const flash = Math.sin((elapsed + particle.delay) * particle.twinkleSpeed)
  const glowAlpha = 0.18 + 0.22 * (0.5 + flash * 0.5)

  if (progress < 0.3) {
    const trailGradient = ctx.createLinearGradient(particle.x, launchY + particle.trailHeight * 0.55, particle.x, launchY)
    trailGradient.addColorStop(0, 'rgba(251,191,36,0)')
    trailGradient.addColorStop(1, 'rgba(255,244,214,0.9)')
    ctx.strokeStyle = trailGradient
    ctx.lineWidth = 1.6
    ctx.beginPath()
    ctx.moveTo(particle.x, launchY + particle.trailHeight * 0.55)
    ctx.lineTo(particle.x, launchY)
    ctx.stroke()

    ctx.fillStyle = 'rgba(255,249,196,0.95)'
    ctx.beginPath()
    ctx.arc(particle.x, launchY, 2.4, 0, Math.PI * 2)
    ctx.fill()
  }

  const haloGradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.haloSize)
  haloGradient.addColorStop(0, `rgba(255,241,190,${0.16 + glowAlpha * 0.2})`)
  haloGradient.addColorStop(0.35, `rgba(251,191,36,${0.08 + glowAlpha * 0.12})`)
  haloGradient.addColorStop(1, 'rgba(251,191,36,0)')
  ctx.fillStyle = haloGradient
  ctx.beginPath()
  ctx.arc(particle.x, particle.y, particle.haloSize, 0, Math.PI * 2)
  ctx.fill()

  if (progress < 0.24) return

  const coreGradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.coreRadius * 0.7)
  coreGradient.addColorStop(0, `rgba(255,255,245,${0.9 - burstProgress * 0.55})`)
  coreGradient.addColorStop(0.45, `rgba(253,230,138,${0.35 - burstProgress * 0.15})`)
  coreGradient.addColorStop(1, 'rgba(253,230,138,0)')
  ctx.fillStyle = coreGradient
  ctx.beginPath()
  ctx.arc(particle.x, particle.y, particle.coreRadius * (0.3 + burstProgress * 0.45), 0, Math.PI * 2)
  ctx.fill()

  for (let i = 0; i < particle.burstSize; i++) {
    const angle = (Math.PI * 2 * i) / particle.burstSize + particle.delay * 0.0015
    const ringDistance = particle.ringRadius * burstProgress
    const x = particle.x + Math.cos(angle) * ringDistance
    const y = particle.y + Math.sin(angle) * ringDistance
    const sparkRadius = 1 + (1 - burstProgress) * 2.4
    const sparkColor = particle.palette[i % particle.palette.length]

    ctx.strokeStyle = `rgba(255,236,179,${0.55 - burstProgress * 0.28})`
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(particle.x + Math.cos(angle) * Math.max(6, ringDistance - 12), particle.y + Math.sin(angle) * Math.max(6, ringDistance - 12))
    ctx.lineTo(x, y)
    ctx.stroke()

    ctx.fillStyle = sparkColor
    ctx.globalAlpha = 0.92 - burstProgress * 0.48
    ctx.beginPath()
    ctx.arc(x, y, sparkRadius, 0, Math.PI * 2)
    ctx.fill()

    const emberY = y + burstProgress * particle.emberFall
    const emberX = x + burstProgress * particle.emberDrift * Math.cos(angle * 1.7)
    ctx.fillStyle = 'rgba(255,231,170,0.38)'
    ctx.beginPath()
    ctx.arc(emberX, emberY, 0.9 + (1 - burstProgress) * 0.8, 0, Math.PI * 2)
    ctx.fill()
  }

  const innerStarRadius = particle.coreRadius * (0.7 + burstProgress * 0.2)
  for (let i = 0; i < 4; i++) {
    const angle = (Math.PI / 2) * i + flash * 0.08
    ctx.strokeStyle = `rgba(255,250,220,${0.34 - burstProgress * 0.18})`
    ctx.lineWidth = 1.1
    ctx.beginPath()
    ctx.moveTo(
      particle.x - Math.cos(angle) * innerStarRadius * 0.24,
      particle.y - Math.sin(angle) * innerStarRadius * 0.24
    )
    ctx.lineTo(
      particle.x + Math.cos(angle) * innerStarRadius,
      particle.y + Math.sin(angle) * innerStarRadius
    )
    ctx.stroke()
  }

  ctx.globalAlpha = 1
}

export default function FestivalEffects({ month, replayToken, enabled }) {
  const canvasRef = useRef(null)
  const frameRef = useRef(null)
  const particlesRef = useRef([])
  const effect = useMemo(() => MONTH_EFFECTS[month] || null, [month])

  useEffect(() => {
    if (!enabled || !effect || !canvasRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext('2d', { alpha: true })
    let mounted = true

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(window.innerWidth * ratio)
      canvas.height = Math.floor(window.innerHeight * ratio)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)

      if (effect.type === 'kites') particlesRef.current = createKites(window.innerWidth, window.innerHeight, effect.particleCount)
      if (effect.type === 'holi') particlesRef.current = createHoli(window.innerWidth, window.innerHeight, effect.particleCount)
      if (effect.type === 'monsoon') particlesRef.current = createMonsoon(window.innerWidth, window.innerHeight, effect.particleCount)
      if (effect.type === 'diwali') particlesRef.current = createDiwali(window.innerWidth, window.innerHeight, effect.particleCount)
      if (effect.type === 'snow') particlesRef.current = createSnow(window.innerWidth, window.innerHeight, effect.particleCount)
    }

    resize()
    window.addEventListener('resize', resize)
    const start = performance.now()

    const render = (now) => {
      if (!mounted) return
      const elapsed = now - start
      const width = window.innerWidth
      const height = window.innerHeight

      context.clearRect(0, 0, width, height)

      if (effect.type === 'holi') {
        particlesRef.current.forEach((particle) => {
          particle.x += particle.vx
          particle.y += particle.vy
          const radius = particle.radius + Math.sin(elapsed * 0.002 + particle.radius) * 4
          const gradient = context.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, radius)
          gradient.addColorStop(0, `${particle.hue}aa`)
          gradient.addColorStop(1, 'rgba(255,255,255,0)')
          context.globalAlpha = particle.life
          context.fillStyle = gradient
          context.beginPath()
          context.arc(particle.x, particle.y, radius, 0, Math.PI * 2)
          context.fill()
        })
        context.globalAlpha = 1
      }

      if (effect.type === 'kites') {
        drawSoftGlow(context, width, height, 0.18, '#38bdf8')
        particlesRef.current.forEach((particle) => drawKite(context, particle, elapsed))
      }

      if (effect.type === 'monsoon') {
        drawSoftGlow(context, width, height, 0.25, '#38bdf8')
        particlesRef.current.forEach((particle) => {
          particle.y += particle.speed
          particle.x += particle.speed * 0.2
          if (particle.y > height + 20) {
            particle.y = -20
            particle.x = Math.random() * width
          }
          context.strokeStyle = `rgba(186,230,253,${particle.opacity})`
          context.lineWidth = 1.2
          context.beginPath()
          context.moveTo(particle.x, particle.y)
          context.lineTo(particle.x - 4, particle.y + particle.len)
          context.stroke()
        })
      }

      if (effect.type === 'diwali') {
        drawSoftGlow(context, width, height, 0.26, '#f59e0b')
        drawSoftGlow(context, width, height, 0.12, '#fb7185')

        const skyGradient = context.createLinearGradient(0, 0, 0, height)
        skyGradient.addColorStop(0, 'rgba(120,53,15,0.05)')
        skyGradient.addColorStop(0.55, 'rgba(251,191,36,0.02)')
        skyGradient.addColorStop(1, 'rgba(120,53,15,0)')
        context.fillStyle = skyGradient
        context.fillRect(0, 0, width, height)

        const diyas = [0.18, 0.34, 0.5, 0.66, 0.82]
        diyas.forEach((position) => {
          const x = width * position
          const y = height - 72
          const diyaGlow = context.createRadialGradient(x, y - 14, 0, x, y - 14, 42)
          diyaGlow.addColorStop(0, 'rgba(255,243,190,0.3)')
          diyaGlow.addColorStop(0.45, 'rgba(251,191,36,0.14)')
          diyaGlow.addColorStop(1, 'rgba(251,191,36,0)')
          context.fillStyle = diyaGlow
          context.beginPath()
          context.arc(x, y - 14, 42, 0, Math.PI * 2)
          context.fill()

          context.fillStyle = 'rgba(120,53,15,0.62)'
          context.beginPath()
          context.ellipse(x, y, 16, 8, 0, 0, Math.PI * 2)
          context.fill()
          const flame = 14 + Math.sin(elapsed * 0.01 + position * 10) * 3
          const gradient = context.createRadialGradient(x, y - 14, 0, x, y - 14, flame)
          gradient.addColorStop(0, 'rgba(255,251,191,0.95)')
          gradient.addColorStop(0.55, 'rgba(251,191,36,0.65)')
          gradient.addColorStop(1, 'rgba(251,191,36,0)')
          context.fillStyle = gradient
          context.beginPath()
          context.arc(x, y - 14, flame, 0, Math.PI * 2)
          context.fill()

          context.fillStyle = 'rgba(255,250,220,0.82)'
          context.beginPath()
          context.arc(x, y - 18, 3.6, 0, Math.PI * 2)
          context.fill()
        })

        particlesRef.current.forEach((particle) => {
          drawDiwaliBurst(context, particle, elapsed)
        })
        context.globalAlpha = 1
      }

      if (effect.type === 'snow') {
        drawSoftGlow(context, width, height, 0.18, '#e0f2fe')
        particlesRef.current.forEach((particle) => {
          particle.y += particle.fall
          particle.x += Math.sin(elapsed * 0.001 + particle.y * 0.02) * particle.drift
          if (particle.y > height + 10) {
            particle.y = -12
            particle.x = Math.random() * width
          }
          context.fillStyle = `rgba(255,255,255,${particle.opacity})`
          context.beginPath()
          context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          context.fill()
        })
      }

      if (elapsed < effect.duration) {
        frameRef.current = requestAnimationFrame(render)
      } else {
        context.clearRect(0, 0, width, height)
      }
    }

    frameRef.current = requestAnimationFrame(render)

    return () => {
      mounted = false
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', resize)
      context.clearRect(0, 0, window.innerWidth, window.innerHeight)
    }
  }, [effect, enabled, replayToken])

  if (!enabled || !effect) return null

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 70,
          background: effect.background,
          mixBlendMode: 'screen',
        }}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 80,
          pointerEvents: 'none',
        }}
      />
    </>
  )
}
