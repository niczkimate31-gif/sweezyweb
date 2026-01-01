import TypingAnimation from './TypingAnimation'

function ProfileCard({ profile }) {
  return (
    <div className="mb-16 animate-fade-in-up">
      <div className="flex flex-col items-center text-center">
        <div className="mb-8 animate-float">
          <div className="relative group">
            {/* Subtle glow */}
            <div className="absolute inset-0 bg-white/5 rounded-full blur-2xl"></div>
            
            {/* Avatar */}
            <div className="relative overflow-hidden rounded-full">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="relative w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full object-cover border-2 border-white/20 shadow-xl group-hover:border-white/40 transition-all duration-300 group-hover:scale-105"
              />
            </div>
            
          </div>
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extralight mb-3 text-white tracking-tight animate-fade-in px-4" style={{ animationDelay: '0.2s' }}>
          <TypingAnimation text={profile.name} speed={100} />
        </h2>
        <p className="text-white/40 text-sm md:text-base mb-6 font-light tracking-wider uppercase animate-fade-in" style={{ animationDelay: '0.3s' }}>
          {profile.username}
        </p>
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}></div>
        <p className="text-white/60 text-sm md:text-base max-w-sm leading-relaxed font-light animate-fade-in" style={{ animationDelay: '0.5s' }}>
          {profile.bio}
        </p>
      </div>
    </div>
  )
}

export default ProfileCard

