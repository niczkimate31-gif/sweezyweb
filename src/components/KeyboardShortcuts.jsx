import { useEffect } from 'react'

function KeyboardShortcuts({ audioRef, onTogglePlay }) {
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Space = Play/Pause zene
      if (e.code === 'Space' && !e.target.matches('input, textarea, [contenteditable]')) {
        e.preventDefault()
        if (onTogglePlay && audioRef?.current) {
          onTogglePlay()
        }
      }
      
      // M = Mute/Unmute
      if (e.code === 'KeyM' && !e.target.matches('input, textarea, [contenteditable]')) {
        if (audioRef?.current) {
          audioRef.current.muted = !audioRef.current.muted
        }
      }
      
      // Arrow Up = Volume up
      if (e.code === 'ArrowUp' && !e.target.matches('input, textarea, [contenteditable]')) {
        e.preventDefault()
        if (audioRef?.current) {
          const newVolume = Math.min(1, audioRef.current.volume + 0.1)
          audioRef.current.volume = newVolume
        }
      }
      
      // Arrow Down = Volume down
      if (e.code === 'ArrowDown' && !e.target.matches('input, textarea, [contenteditable]')) {
        e.preventDefault()
        if (audioRef?.current) {
          const newVolume = Math.max(0, audioRef.current.volume - 0.1)
          audioRef.current.volume = newVolume
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [audioRef, onTogglePlay])

  return null // This component doesn't render anything
}

export default KeyboardShortcuts

