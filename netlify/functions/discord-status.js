// Netlify Serverless Function to fetch Discord status
// You need to set these environment variables in Netlify:
// - DISCORD_USER_ID: Your Discord User ID (1231556789695152213)
// - DISCORD_BOT_TOKEN: Your Discord Bot Token (optional, if you have a bot)

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  }

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    }
  }

  const userId = process.env.DISCORD_USER_ID || '532035171667673088'
  const botToken = process.env.DISCORD_BOT_TOKEN
  
  try {
    // Option 1: Use Discord API with bot token (if available)
    if (botToken) {
      // Find the user in guilds where the bot is present
      // First, get bot's guilds
      const guildsResponse = await fetch('https://discord.com/api/v10/users/@me/guilds', {
        headers: {
          'Authorization': `Bot ${botToken}`
        }
      })
      
      if (guildsResponse.ok) {
        const guilds = await guildsResponse.json()
        
        // Try to find user in one of the guilds
        for (const guild of guilds) {
          try {
            const memberResponse = await fetch(`https://discord.com/api/v10/guilds/${guild.id}/members/${userId}`, {
              headers: {
                'Authorization': `Bot ${botToken}`
              }
            })
            
            if (memberResponse.ok) {
              const member = await memberResponse.json()
              
              // Get presence from gateway (this is complex, so we'll use Lanyard as fallback)
              // For now, fall through to Lanyard
              break
            }
          } catch (err) {
            // Continue to next guild
            continue
          }
        }
      }
    }

    // Option 2: Use Lanyard API (free Discord status API)
    // This requires the Lanyard bot to be in a server with the user
    // OR you can use your own bot with Lanyard's self-hosted version
    const lanyardResponse = await fetch(`https://api.lanyard.rest/v1/users/${userId}`)
    
    if (!lanyardResponse.ok) {
      throw new Error('Failed to fetch Discord status')
    }

    const data = await lanyardResponse.json()
    
    if (data.success && data.data) {
      const discordData = data.data
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: discordData.discord_status || 'offline',
          activities: discordData.activities || [],
          username: discordData.discord_user?.username || 'Sweezy',
          avatar: discordData.discord_user?.avatar 
            ? `https://cdn.discordapp.com/avatars/${userId}/${discordData.discord_user.avatar}.png`
            : null,
        }),
      }
    }

    // Fallback if Lanyard doesn't work
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'offline',
        activities: [],
        username: 'Sweezy',
        avatar: null,
      }),
    }
  } catch (error) {
    console.error('Discord API Error:', error)
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'offline',
        activities: [],
        username: 'Sweezy',
        avatar: null,
        error: 'Unable to fetch status',
      }),
    }
  }
}

