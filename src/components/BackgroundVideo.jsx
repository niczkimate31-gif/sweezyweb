import { useRef, useEffect, useState } from 'react'

function BackgroundVideo({ videoSrc, poster }) {
  const videoRef = useRef(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (video && videoSrc) {
      video.play().catch(() => {
        // Auto-play blocked, user interaction needed
      })
      
      video.addEventListener('error', () => {
        setHasError(true)
      })
    } else {
      setHasError(true)
    }
  }, [videoSrc])

  // Fallback to gradient background if no video or error
  if (!videoSrc || hasError) {
    return (
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden">
        <div className="absolute inset-0 bg-black"></div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden">
      <video
        ref={videoRef}
        className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover"
        autoPlay
        loop
        muted
        playsInline
        poster={poster}
        onError={() => setHasError(true)}
      >
        <source src={videoSrc} type="video/mp4" />
        <source src={videoSrc.replace('.mp4', '.webm')} type="video/webm" />
        Your browser does not support the video tag.
      </video>
      {/* Minimal overlay for better text readability */}
      <div className="absolute inset-0 bg-black/60"></div>
    </div>
  )
}

export default BackgroundVideo

