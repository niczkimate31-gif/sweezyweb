import { useEffect, useRef } from 'react'

function ParticleEffects() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const particles = []
    let animationId

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const createParticle = (x, y) => {
      for (let i = 0; i < 15; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          life: 1,
          decay: Math.random() * 0.02 + 0.01,
          size: Math.random() * 3 + 2,
          color: `hsl(${Math.random() * 60 + 200}, 70%, ${Math.random() * 30 + 60}%)`
        })
      }
    }

    const handleClick = (e) => {
      createParticle(e.clientX, e.clientY)
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        
        p.x += p.vx
        p.y += p.vy
        p.life -= p.decay
        p.vy += 0.1 // Gravity

        if (p.life <= 0) {
          particles.splice(i, 1)
          continue
        }

        ctx.save()
        ctx.globalAlpha = p.life
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      animationId = requestAnimationFrame(animate)
    }

    window.addEventListener('click', handleClick)
    animate()

    return () => {
      window.removeEventListener('click', handleClick)
      window.removeEventListener('resize', resizeCanvas)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-30"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}

export default ParticleEffects

