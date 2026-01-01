import { useState, useEffect } from 'react'

function VisitorCounter({ onCountChange }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const sessionKey = 'visitorSession'
    const hasVisited = sessionStorage.getItem(sessionKey)

    const updateCount = (newCount) => {
      setCount(newCount)
      if (onCountChange) onCountChange(newCount)
    }

    const runLocalFallback = () => {
      const storedCount = localStorage.getItem('visitorCount')
      const initialCount = storedCount ? parseInt(storedCount, 10) : 0

      if (!hasVisited) {
        const newCount = initialCount + 1
        updateCount(newCount)
        localStorage.setItem('visitorCount', newCount.toString())
        sessionStorage.setItem(sessionKey, 'true')
      } else {
        updateCount(initialCount)
      }

      const handleUpdate = () => {
        const updatedCount = parseInt(localStorage.getItem('visitorCount') || '0', 10)
        updateCount(updatedCount)
      }
      window.addEventListener('visitorCountUpdated', handleUpdate)
      return () => window.removeEventListener('visitorCountUpdated', handleUpdate)
    }

    let cleanup = null

    const run = async () => {
      try {
        const endpoint = '/.netlify/functions/visitor-count'

        if (!hasVisited) {
          const res = await fetch(endpoint, { method: 'POST' })
          if (!res.ok) throw new Error('Failed to increment')
          const data = await res.json()
          updateCount(data.count)
          sessionStorage.setItem(sessionKey, 'true')
        } else {
          const res = await fetch(endpoint)
          if (!res.ok) throw new Error('Failed to fetch')
          const data = await res.json()
          updateCount(data.count)
        }
      } catch (e) {
        cleanup = runLocalFallback()
      }
    }

    run()
    return () => {
      if (typeof cleanup === 'function') cleanup()
    }
  }, [onCountChange])

  return (
    <div className="fixed bottom-3 left-3 md:bottom-6 md:left-6 z-50 animate-fade-in">
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg px-2 py-1.5 md:px-3 md:py-2 shadow-lg">
        <div className="text-[10px] md:text-xs text-white/40 font-light mb-0.5 md:mb-1 uppercase tracking-wide">
          Látogatók
        </div>
        <div className="text-lg md:text-xl font-light text-white tracking-tight">
          {count.toLocaleString('hu-HU')}
        </div>
      </div>
    </div>
  )
}

export default VisitorCounter

