import { useState, useRef, useEffect } from 'react'

function AudioPlayer({ audioSrc, autoPlay = false, audioRef: externalAudioRef, onPlayStateChange }) {
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isMuted, setIsMuted] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [volume, setVolume] = useState(0.3) // Alapértelmezett hangerő: 30%
  const [showVolumeControl, setShowVolumeControl] = useState(false)
  const internalAudioRef = useRef(null)
  const audioRef = externalAudioRef || internalAudioRef
  
  // Sync external ref
  useEffect(() => {
    if (externalAudioRef) {
      externalAudioRef.current = internalAudioRef.current
    }
  }, [externalAudioRef])

  // Listen to play/pause events to sync state
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handlePlay = () => {
      setIsPlaying(true)
      if (onPlayStateChange) onPlayStateChange(true)
    }

    const handlePause = () => {
      setIsPlaying(false)
      if (onPlayStateChange) onPlayStateChange(false)
    }

    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)

    return () => {
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
    }
  }, [audioRef, onPlayStateChange])

  useEffect(() => {
    if (audioRef.current && audioSrc) {
      audioRef.current.addEventListener('error', () => {
        setHasError(true)
      })
      
      // Auto-play when enabled with fade-in effect
      if (autoPlay) {
        // Start with volume 0
        audioRef.current.volume = 0
        setVolume(0)
        
        const playPromise = audioRef.current.play()
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true)
              
              // Fade-in effect: gradually increase volume from 0 to target volume (0.3)
              const targetVolume = 0.3
              const fadeDuration = 2000 // 2 seconds
              const fadeSteps = 50
              const stepTime = fadeDuration / fadeSteps
              const volumeStep = targetVolume / fadeSteps
              
              let currentStep = 0
              const fadeInterval = setInterval(() => {
                currentStep++
                const newVolume = Math.min(targetVolume, currentStep * volumeStep)
                
                if (audioRef.current) {
                  audioRef.current.volume = newVolume
                  setVolume(newVolume)
                }
                
                if (currentStep >= fadeSteps) {
                  clearInterval(fadeInterval)
                }
              }, stepTime)
            })
            .catch(() => {
              // Auto-play blocked, user interaction needed
              setIsPlaying(false)
            })
        }
      } else {
        // If not auto-playing, set volume normally
        audioRef.current.volume = volume
      }
    } else {
      setHasError(true)
    }
  }, [audioSrc, autoPlay])

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const togglePlay = () => {
    if (audioRef.current && !hasError) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(() => {
          // Auto-play blocked
        })
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (audioRef.current && !hasError) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
      audioRef.current.muted = false
      setIsMuted(false)
    }
  }

  const increaseVolume = () => {
    const newVolume = Math.min(1, volume + 0.1)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
      audioRef.current.muted = false
      setIsMuted(false)
    }
  }

  const decreaseVolume = () => {
    const newVolume = Math.max(0, volume - 0.1)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
      if (newVolume === 0) {
        audioRef.current.muted = true
        setIsMuted(true)
      } else {
        audioRef.current.muted = false
        setIsMuted(false)
      }
    }
  }

  // Don't show player if no audio source or error
  if (!audioSrc || hasError) {
    return null
  }

  return (
    <div className="fixed bottom-3 right-3 md:bottom-8 md:right-8 z-50">
      <div className="bg-white/5 backdrop-blur-md border border-white/15 rounded-full p-2 md:p-2.5 flex items-center gap-2 md:gap-2.5 shadow-lg">
        <button
          onClick={togglePlay}
          className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center transition-all duration-200 hover:scale-105"
          aria-label={isPlaying ? 'Szünet' : 'Lejátszás'}
        >
          {isPlaying ? (
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          )}
        </button>
        
        {/* Volume Control */}
        <div className="relative">
          <button
            onClick={() => setShowVolumeControl(!showVolumeControl)}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center transition-all duration-200 hover:scale-105"
            aria-label={isMuted ? 'Hang be' : 'Hang ki'}
          >
            {isMuted || volume === 0 ? (
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.383 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.383l4-3.617a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.383 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.383l4-3.617a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          
          {/* Volume Slider */}
          {showVolumeControl && (
            <div className="absolute bottom-full right-0 mb-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-3 flex flex-col items-center gap-2">
              {/* Volume up button */}
              <button
                onClick={increaseVolume}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                aria-label="Hangerő növelése"
              >
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </button>
              
              {/* Volume slider */}
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-24 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                style={{
                  background: `linear-gradient(to right, white 0%, white ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) ${(isMuted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) 100%)`
                }}
              />
              
              {/* Volume down button */}
              <button
                onClick={decreaseVolume}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
                aria-label="Hangerő csökkentése"
              >
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                </svg>
              </button>
              
              {/* Volume percentage */}
              <div className="text-white/60 text-xs font-light">
                {Math.round((isMuted ? 0 : volume) * 100)}%
              </div>
            </div>
          )}
        </div>
        
        <audio
          ref={internalAudioRef}
          src={audioSrc}
          loop
        />
      </div>
    </div>
  )
}

export default AudioPlayer

