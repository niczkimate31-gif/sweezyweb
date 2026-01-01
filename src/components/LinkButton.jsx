function LinkButton({ link }) {
  const handleClick = () => {
    window.open(link.url, '_blank', 'noopener,noreferrer')
  }

  const renderIcon = () => {
    switch (link.icon) {
      case 'discord':
        return (
          <img 
            src="/discord.png" 
            alt="Discord" 
            className="w-full h-full object-contain p-2"
          />
        )
      case 'roblox':
        return (
          <img 
            src="/06B44AC0-4257-4033-89BB-76A5C737EB75.png" 
            alt="Roblox" 
            className="w-full h-full object-contain p-2"
          />
        )
      case 'spotify':
        return (
          <img 
            src="/spotify.png" 
            alt="Spotify" 
            className="w-full h-full object-contain p-2"
          />
        )
      default:
        return null
    }
  }

  return (
    <button
      onClick={handleClick}
      className="group relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 transition-all duration-300 hover:scale-110 active:scale-95 animate-fade-in-up"
      style={{ animationDelay: `${link.id * 0.1}s` }}
    >
      {/* Animated glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-purple-500/30 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse-glow"></div>
      <div className="absolute inset-0 bg-white/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Icon container with shimmer */}
      <div className="relative bg-black/40 backdrop-blur-sm border border-white/20 rounded-xl w-full h-full flex items-center justify-center shadow-lg group-hover:border-white/40 group-hover:shadow-2xl transition-all duration-300 overflow-hidden">
        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Icon */}
        <div className="relative z-10 transform group-hover:rotate-6 transition-transform duration-300">
          {renderIcon()}
        </div>
        
        {/* Decorative corner accents */}
        <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </button>
  )
}

export default LinkButton

