import { useEffect, useRef, useState } from 'react'

function CustomCursor() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Don't show custom cursor on mobile devices
  if (isMobile) {
    return null
  }
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const isHoveringRef = useRef(false)
  const rafId = useRef(null)

  useEffect(() => {
    let currentX = 0
    let currentY = 0
    let targetX = 0
    let targetY = 0

    const updateCursor = (e) => {
      targetX = e.clientX
      targetY = e.clientY
    }

    const handleMouseEnter = (e) => {
      const target = e.target
      if (target && typeof target.closest === 'function' && target.closest('button, a, [role="button"]')) {
        isHoveringRef.current = true
        if (ringRef.current) {
          ringRef.current.classList.add('scale-150', 'border-white/60')
          ringRef.current.classList.remove('border-white/40')
        }
      }
    }

    const handleMouseLeave = (e) => {
      const target = e.target
      if (target && typeof target.closest === 'function' && target.closest('button, a, [role="button"]')) {
        isHoveringRef.current = false
        if (ringRef.current) {
          ringRef.current.classList.remove('scale-150', 'border-white/60')
          ringRef.current.classList.add('border-white/40')
        }
      }
    }

    const animate = () => {
      // Smooth interpolation
      currentX += (targetX - currentX) * 0.15
      currentY += (targetY - currentY) * 0.15

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${currentX - 8}px, ${currentY - 8}px)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${currentX - 16}px, ${currentY - 16}px)`
      }

      rafId.current = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', updateCursor)
    document.addEventListener('mouseenter', handleMouseEnter, true)
    document.addEventListener('mouseleave', handleMouseLeave, true)
    
    animate()

    return () => {
      window.removeEventListener('mousemove', updateCursor)
      document.removeEventListener('mouseenter', handleMouseEnter, true)
      document.removeEventListener('mouseleave', handleMouseLeave, true)
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
      }
    }
  }, [])

  return (
    <>
      {/* Custom cursor dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-4 h-4 rounded-full bg-white/30 pointer-events-none z-[9999] mix-blend-difference will-change-transform"
        style={{ transform: 'translate(0, 0)' }}
      />
      
      {/* Custom cursor ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/40 pointer-events-none z-[9998] will-change-transform"
        style={{ transform: 'translate(0, 0)' }}
      />
    </>
  )
}

export default CustomCursor

