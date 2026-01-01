import { useState, useEffect } from 'react'

function Clock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString('hu-HU', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('hu-HU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="fixed top-3 left-3 md:top-6 md:left-6 z-50 animate-fade-in">
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-2 md:p-4 shadow-lg">
        <div className="text-lg md:text-2xl font-light text-white mb-0.5 md:mb-1 tracking-wider">
          {formatTime(time)}
        </div>
        <div className="text-[10px] md:text-xs text-white/50 font-light uppercase tracking-wide hidden md:block">
          {formatDate(time)}
        </div>
      </div>
    </div>
  )
}

export default Clock

