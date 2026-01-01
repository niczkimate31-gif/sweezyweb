import { useState, useEffect } from 'react'

function VisitorCounter({ onCountChange }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    // Get count from localStorage or initialize
    const storedCount = localStorage.getItem('visitorCount')
    const initialCount = storedCount ? parseInt(storedCount, 10) : 0
    
    // Check if this is a new visitor (not in current session)
    const sessionKey = 'visitorSession'
    const hasVisited = sessionStorage.getItem(sessionKey)
    
    if (!hasVisited) {
      // New visitor - increment count
      const newCount = initialCount + 1
      setCount(newCount)
      localStorage.setItem('visitorCount', newCount.toString())
      sessionStorage.setItem(sessionKey, 'true')
      if (onCountChange) onCountChange(newCount)
    } else {
      // Returning visitor in same session
      setCount(initialCount)
      if (onCountChange) onCountChange(initialCount)
    }

    // Listen for admin updates
    const handleUpdate = () => {
      const updatedCount = parseInt(localStorage.getItem('visitorCount') || '0', 10)
      setCount(updatedCount)
      if (onCountChange) onCountChange(updatedCount)
    }
    window.addEventListener('visitorCountUpdated', handleUpdate)
    
    return () => {
      window.removeEventListener('visitorCountUpdated', handleUpdate)
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

