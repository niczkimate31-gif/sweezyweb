import { useState, useRef, useEffect } from 'react'
import ProfileCard from './components/ProfileCard'
import LinkButton from './components/LinkButton'
import Quote from './components/Stats'
import BackgroundVideo from './components/BackgroundVideo'
import BackgroundAnimation from './components/BackgroundAnimation'
import AudioPlayer from './components/AudioPlayer'
import SplashScreen from './components/SplashScreen'
import CustomCursor from './components/CustomCursor'
import Clock from './components/Clock'
import SocialStatus from './components/SocialStatus'
import MusicVisualizer from './components/MusicVisualizer'
import VisitorCounter from './components/VisitorCounter'
import DiscordStatus from './components/DiscordStatus'
import KeyboardShortcuts from './components/KeyboardShortcuts'
import ShareButton from './components/ShareButton'
import AchievementBadges from './components/AchievementBadges'
import ParticleEffects from './components/ParticleEffects'
import AdminPanel from './components/AdminPanel'
import ScrollProgress from './components/ScrollProgress'
import BackToTop from './components/BackToTop'
import profileConfig from './profileConfig'

function App() {
  const { profile, features } = profileConfig
  const [showSplash, setShowSplash] = useState(Boolean(features?.splashScreen))
  const [audioAutoPlay, setAudioAutoPlay] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [visitorCount, setVisitorCount] = useState(0)
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const audioRef = useRef(null)

  const isDev = import.meta.env.DEV
  const adminPanelEnabled = features?.adminPanelInDevOnly ? isDev : true

  const handleEnter = () => {
    if (features?.splashScreen) {
      setShowSplash(false)
    }
    if (features?.audio && features?.autoPlayAudioAfterSplash) {
      setTimeout(() => {
        setAudioAutoPlay(true)
      }, 500)
    }
  }

  const handleTogglePlay = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play()
        setIsPlaying(true)
      } else {
        audioRef.current.pause()
        setIsPlaying(false)
      }
    }
  }

  const handleVisitorCountUpdate = (newCount) => {
    setVisitorCount(newCount)
    // Force VisitorCounter to update
    window.dispatchEvent(new Event('visitorCountUpdated'))
  }

  // Admin panel keyboard shortcut (Ctrl+Shift+A)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (adminPanelEnabled && e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault()
        setShowAdminPanel(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [adminPanelEnabled])

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Scroll Progress Bar */}
      {!showSplash && <ScrollProgress />}
      
      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts audioRef={audioRef} onTogglePlay={handleTogglePlay} />
      
      {/* Particle Effects */}
      {!showSplash && <ParticleEffects />}
      
      {/* Custom Cursor */}
      <CustomCursor />
      
      {/* Back to Top */}
      {!showSplash && <BackToTop />}
      
      {/* Clock */}
      {!showSplash && <Clock />}
      
      {/* Social Status */}
      {!showSplash && <SocialStatus />}
      
      {/* Visitor Counter */}
      {!showSplash && features?.visitorCounter && <VisitorCounter onCountChange={setVisitorCount} />}
      
      {/* Share Button */}
      {!showSplash && <ShareButton />}
      
      {/* Admin Panel */}
      <AdminPanel 
        isOpen={showAdminPanel} 
        onClose={() => setShowAdminPanel(false)}
        onVisitorCountUpdate={handleVisitorCountUpdate}
        enabled={adminPanelEnabled}
      />
      
      {/* Splash Screen */}
      {features?.splashScreen && showSplash && <SplashScreen onEnter={handleEnter} />}
      
      {/* Background Video */}
      <BackgroundVideo 
        videoSrc={profile.videoUrl || '/video.mp4'} 
        poster="/video-poster.jpg"
      />
      
      {/* Background Animation */}
      <BackgroundAnimation />
      
      {/* Music Visualizer */}
      {!showSplash && audioRef.current && (
        <MusicVisualizer audioElement={audioRef.current} />
      )}
      
      {/* Audio Player */}
      {features?.audio && (
        <AudioPlayer 
          audioSrc={profile.audioUrl || '/music.mp3'} 
          autoPlay={audioAutoPlay}
          audioRef={audioRef}
          onPlayStateChange={setIsPlaying}
        />
      )}

      {/* Content */}
      <div className={`relative z-10 min-h-screen transition-opacity duration-1000 ${features?.splashScreen && showSplash ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <div className="container mx-auto px-4 md:px-6 pt-12 md:pt-20 lg:pt-28 pb-32 md:pb-40 lg:pb-48 max-w-lg">

          {/* Profile Card */}
          <ProfileCard profile={profile} />

          {/* Quote */}
          <Quote />

          {/* Discord Status */}
          <DiscordStatus />

          {/* Achievement Badges */}
          <AchievementBadges visitorCount={visitorCount} />

          {/* Links */}
          <div className="flex items-center justify-center gap-6 md:gap-8 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            {profile.links.map((link) => (
              <LinkButton key={link.id} link={link} />
            ))}
          </div>

          {/* Footer */}
          <div className="mt-20 text-center">
            <p className="text-white/20 text-xs font-light tracking-wide">
              © 2026 Sweezy
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

