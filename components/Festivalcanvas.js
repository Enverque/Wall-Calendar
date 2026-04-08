'use client'

import { useEffect, useRef } from 'react'


const FESTIVAL_ANIMATIONS = {
  'holi': {
    name: 'Holi - Festival of Colors',
    duration: 3000,
    particles: 150,
    colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA'],
    animation: 'colorBurst'
  },
  'diwali': {
    name: 'Diwali - Festival of Lights',
    duration: 4000,
    particles: 80,
    colors: ['#FFD700', '#FFA500', '#FF6347', '#FFB6C1'],
    animation: 'firecracker'
  },
  'christmas': {
    name: 'Christmas',
    duration: 3500,
    particles: 120,
    colors: ['#FF0000', '#00FF00', '#FFD700', '#FFFFFF'],
    animation: 'snowfall'
  },
  'newyear': {
    name: 'New Year',
    duration: 3000,
    particles: 100,
    colors: ['#FFD700', '#FF69B4', '#00BFFF', '#32CD32'],
    animation: 'confetti'
  },
}

export default function FestivalCanvas({ festivalType, isVisible }) {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const animationRef = useRef(null)

  useEffect(() => {
    if (!isVisible || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const config = FESTIVAL_ANIMATIONS[festivalType] || FESTIVAL_ANIMATIONS['newyear']
    const particles = []


    for (let i = 0; i < config.particles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        vx: (Math.random() - 0.5) * 8,
        vy: Math.random() * 4 + 2,
        size: Math.random() * 8 + 2,
        color: config.colors[Math.floor(Math.random() * config.colors.length)],
        life: 1,
        decay: Math.random() * 0.01 + 0.005,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
      })
    }

    particlesRef.current = particles
    let startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime

      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

     
      particles.forEach((p, idx) => {
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.rotationSpeed

        p.vy += 0.1

        p.life -= p.decay

        if (p.life > 0) {
          ctx.save()
          ctx.globalAlpha = p.life
          ctx.translate(p.x, p.y)
          ctx.rotate(p.rotation)

          // Draw based on animation type
          if (config.animation === 'firecracker') {
            // Firecracker burst
            ctx.fillStyle = p.color
            ctx.beginPath()
            ctx.arc(0, 0, p.size, 0, Math.PI * 2)
            ctx.fill()

            // Glow effect
            ctx.strokeStyle = p.color
            ctx.lineWidth = 1
            ctx.globalAlpha = p.life * 0.3
            ctx.beginPath()
            ctx.arc(0, 0, p.size * 2, 0, Math.PI * 2)
            ctx.stroke()
          } else if (config.animation === 'colorBurst') {
            // Holi color burst
            ctx.fillStyle = p.color
            ctx.beginPath()
            ctx.arc(0, 0, p.size, 0, Math.PI * 2)
            ctx.fill()
          } else if (config.animation === 'snowfall') {
            // Snowflake
            ctx.fillStyle = p.color
            ctx.beginPath()
            for (let i = 0; i < 6; i++) {
              ctx.lineTo(
                Math.cos((i * Math.PI) / 3) * p.size,
                Math.sin((i * Math.PI) / 3) * p.size
              )
              ctx.lineTo(
                Math.cos(((i + 0.5) * Math.PI) / 3) * (p.size * 0.5),
                Math.sin(((i + 0.5) * Math.PI) / 3) * (p.size * 0.5)
              )
            }
            ctx.closePath()
            ctx.fill()
          } else {
            // Confetti
            ctx.fillStyle = p.color
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
          }

          ctx.restore()
        } else {
          particles.splice(idx, 1)
        }
      })

      if (elapsed < config.duration && particles.length > 0) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isVisible, festivalType])


  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth
        canvasRef.current.height = window.innerHeight
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!isVisible) return null

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        pointerEvents: 'none',
        width: '100vw',
        height: '100vh',
      }}
    />
  )
}
