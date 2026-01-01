import { useState } from 'react'

function SplashScreen({ onEnter }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className="fixed inset-0 z-50 bg-black flex items-center justify-center cursor-pointer"
      onClick={onEnter}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Minimal background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black/95"></div>
      
      {/* Main text */}
      <div className="text-center relative z-10">
        <h1 
          className={`text-3xl md:text-5xl font-light text-white tracking-[0.2em] mb-6 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-60'
          }`}
        >
          kattints a belépéshez
        </h1>
        
        <div className="w-px h-8 bg-white/20 mx-auto mb-6"></div>
        
        <p className="text-white/30 text-xs md:text-sm mt-6 max-w-sm mx-auto px-4 leading-relaxed font-light tracking-wide">
          akárhogy is szúr itt sweezy az úr!
        </p>
      </div>
    </div>
  )
}

export default SplashScreen

