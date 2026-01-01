import { useState, useEffect } from 'react'

function DiscordStatus() {
  const [status, setStatus] = useState('offline')
  const [activity, setActivity] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userId = '532035171667673088'
    
    const fetchStatus = async () => {
      try {
        setLoading(true)
        
        // Use Lanyard API directly (Netlify Function only works in production)
        // Check if we're in development or production
        const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        
        let response
        if (!isDevelopment) {
          // In production, try Netlify Function first
          try {
            response = await fetch('/.netlify/functions/discord-status')
            if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
              throw new Error('Netlify Function failed')
            }
          } catch (err) {
            // Fallback to Lanyard API
            response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`)
          }
        } else {
          // In development, use Lanyard API directly
          response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`)
        }
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        // Check if response is actually JSON
        const contentType = response.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON')
        }
        
        const data = await response.json()
        
        // Handle Lanyard API response
        if (data.success && data.data) {
          const discordData = data.data
          setStatus(discordData.discord_status || 'offline')
          
          if (discordData.activities && discordData.activities.length > 0) {
            const firstActivity = discordData.activities.find(act => act.type !== 4) || discordData.activities[0]
            
            if (firstActivity) {
              setActivity({
                name: firstActivity.name,
                type: firstActivity.type === 2 ? 'listening' : firstActivity.type === 0 ? 'playing' : 'custom',
                details: firstActivity.details,
                state: firstActivity.state,
              })
            } else {
              setActivity(null)
            }
          } else {
            setActivity(null)
          }
        } 
        // Handle Netlify Function response
        else if (data.status) {
          setStatus(data.status)
          if (data.activities && data.activities.length > 0) {
            const firstActivity = data.activities[0]
            setActivity({
              name: firstActivity.name,
              type: firstActivity.type === 2 ? 'listening' : firstActivity.type === 0 ? 'playing' : 'custom',
              details: firstActivity.details,
              state: firstActivity.state,
            })
          } else {
            setActivity(null)
          }
        } else {
          setStatus('offline')
          setActivity(null)
        }
      } catch (err) {
        console.error('Error fetching Discord status:', err)
        setStatus('offline')
        setActivity(null)
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
    // Update every 30 seconds
    const interval = setInterval(fetchStatus, 30000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'bg-green-400'
      case 'idle':
        return 'bg-yellow-400'
      case 'dnd':
        return 'bg-red-400'
      case 'offline':
        return 'bg-gray-400'
      default:
        return 'bg-gray-400'
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'online':
        return 'Online'
      case 'idle':
        return 'Tétlen'
      case 'dnd':
        return 'Ne zavarj'
      case 'offline':
        return 'Offline'
      default:
        return 'Offline'
    }
  }

  const getActivityIcon = () => {
    if (!activity) return null
    switch (activity.type) {
      case 'listening':
      case 2:
        return '🎵'
      case 'playing':
      case 0:
        return '🎮'
      case 'browsing':
        return '🌐'
      default:
        return '🎯'
    }
  }

  const getActivityName = () => {
    if (!activity) return null
    if (activity.details && activity.state) {
      return `${activity.name} - ${activity.details}`
    }
    return activity.name
  }

  return (
    <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          <div className="relative">
            {loading ? (
              <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse"></div>
            ) : (
              <>
                <div className={`w-3 h-3 ${getStatusColor()} rounded-full ${status === 'online' ? 'animate-pulse' : ''}`}></div>
                <div className={`absolute inset-0 ${getStatusColor()} rounded-full opacity-50 ${status === 'online' ? 'animate-ping' : ''}`}></div>
              </>
            )}
          </div>
          <div>
            <div className="text-sm font-light text-white">Discord Státusz</div>
            <div className="text-xs text-white/50 font-light">
              {loading ? 'Betöltés...' : getStatusText()}
            </div>
          </div>
        </div>
        
        {activity && !loading && (
          <div className="pt-3 border-t border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-sm">{getActivityIcon()}</span>
              <span className="text-xs text-white/60 font-light">{getActivityName()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DiscordStatus

