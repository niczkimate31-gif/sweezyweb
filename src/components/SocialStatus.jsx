import { useState, useEffect } from 'react'

function SocialStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [lastSeen, setLastSeen] = useState(null)

  useEffect(() => {
    // Simulate online/offline status (you can replace this with real logic)
    const checkStatus = () => {
      // Randomly set online status (90% chance online)
      setIsOnline(Math.random() > 0.1)
      
      if (!isOnline) {
        const minutesAgo = Math.floor(Math.random() * 60) + 1
        setLastSeen(minutesAgo)
      }
    }

    // Check status every 30 seconds
    const interval = setInterval(checkStatus, 30000)
    checkStatus() // Initial check

    return () => clearInterval(interval)
  }, [isOnline])

  if (!isOnline && lastSeen) {
    return (
      <div className="fixed top-16 right-3 md:top-20 md:right-6 z-50 animate-fade-in">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg px-2 py-1.5 md:px-3 md:py-2 shadow-lg flex items-center gap-1.5 md:gap-2">
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full"></div>
          <span className="text-[10px] md:text-xs text-white/60 font-light">
            <span className="hidden md:inline">Utolsó aktivitás: </span>{lastSeen} perce
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed top-16 right-3 md:top-20 md:right-6 z-50 animate-fade-in">
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg px-2 py-1.5 md:px-3 md:py-2 shadow-lg flex items-center gap-1.5 md:gap-2">
        <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-[10px] md:text-xs text-white/60 font-light">
          Most online
        </span>
      </div>
    </div>
  )
}

export default SocialStatus

