import { useEffect, useRef, useState } from 'react'

function MusicVisualizer({ audioElement }) {
  const canvasRef = useRef(null)
  const animationFrameRef = useRef(null)
  const [isEnabled, setIsEnabled] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !audioElement) {
      setIsEnabled(false)
      return
    }
    
    // Check if audio is playing
    const checkAudio = () => {
      if (audioElement && !audioElement.paused && !audioElement.muted) {
        setIsEnabled(true)
      } else {
        setIsEnabled(false)
      }
    }
    
    audioElement.addEventListener('play', checkAudio)
    audioElement.addEventListener('pause', checkAudio)
    checkAudio()
    
    if (!isEnabled) return

    const ctx = canvas.getContext('2d')
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const analyser = audioContext.createAnalyser()
    const source = audioContext.createMediaElementSource(audioElement)

    source.connect(analyser)
    analyser.connect(audioContext.destination)

    analyser.fftSize = 256
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw)

      analyser.getByteFrequencyData(dataArray)

      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const barWidth = (canvas.width / bufferLength) * 2.5
      let barHeight
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * canvas.height * 0.3

        const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height)
        gradient.addColorStop(0, 'rgba(139, 92, 246, 0.3)')
        gradient.addColorStop(1, 'rgba(236, 72, 153, 0.3)')

        ctx.fillStyle = gradient
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)

        x += barWidth + 1
      }
    }

    draw()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      audioContext.close()
    }
  }, [audioElement])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[1] pointer-events-none opacity-30"
    />
  )
}

export default MusicVisualizer

