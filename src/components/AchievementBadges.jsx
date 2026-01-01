import { useState, useEffect } from 'react'

function AchievementBadges({ visitorCount }) {
  const [achievements, setAchievements] = useState([])

  useEffect(() => {
    const unlocked = []
    
    // Check achievements based on visitor count
    if (visitorCount >= 1) {
      unlocked.push({ id: 1, name: 'Első látogató', icon: '🎉', description: 'Az első látogató érkezett!' })
    }
    if (visitorCount >= 10) {
      unlocked.push({ id: 2, name: '10 látogató', icon: '🌟', description: '10 látogató elérve!' })
    }
    if (visitorCount >= 50) {
      unlocked.push({ id: 3, name: '50 látogató', icon: '💎', description: '50 látogató elérve!' })
    }
    if (visitorCount >= 100) {
      unlocked.push({ id: 4, name: '100 látogató', icon: '🏆', description: '100 látogató elérve!' })
    }
    if (visitorCount >= 500) {
      unlocked.push({ id: 5, name: '500 látogató', icon: '👑', description: '500 látogató elérve!' })
    }
    if (visitorCount >= 1000) {
      unlocked.push({ id: 6, name: '1000 látogató', icon: '🔥', description: '1000 látogató elérve!' })
    }
    
    setAchievements(unlocked)
  }, [visitorCount])

  if (achievements.length === 0) {
    return null
  }

  return (
    <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-lg">
        <div className="text-xs text-white/40 font-light mb-3 uppercase tracking-wide">
          Elért eredmények
        </div>
        <div className="flex flex-wrap gap-2">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="flex items-center gap-2 bg-white/5 rounded-lg px-2 py-1.5 border border-white/10"
              title={achievement.description}
            >
              <span className="text-sm">{achievement.icon}</span>
              <span className="text-xs text-white/60 font-light">{achievement.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AchievementBadges

