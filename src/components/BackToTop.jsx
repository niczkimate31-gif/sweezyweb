import { useState, useEffect } from 'react'

function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  if (!isVisible) return null

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-40 right-3 md:bottom-48 md:right-8 z-50 group"
      aria-label="Vissza a tetejére"
    >
      <div className="bg-white/5 backdrop-blur-md border border-white/15 rounded-full p-3 shadow-lg hover:bg-white/10 transition-all duration-200 hover:scale-110 active:scale-95">
        <svg className="w-5 h-5 text-white transform group-hover:-translate-y-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </div>
    </button>
  )
}

export default BackToTop

