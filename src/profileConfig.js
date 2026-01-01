const profileConfig = {
  profile: {
    name: 'Sweezy',
    username: '@sweezy',
    bio: 'Köszöntelek az oldalamon!',
    avatar: '/pfp.png',
    videoUrl: '/video.mp4',
    audioUrl: '/music.mp3',
    links: [
      {
        id: 1,
        title: 'Discord',
        url: 'https://discord.com/users/1231556789695152213',
        icon: 'discord',
      },
      {
        id: 2,
        title: 'Roblox',
        url: 'https://www.roblox.com/users/2717618665/profile',
        icon: 'roblox',
      },
      {
        id: 3,
        title: 'Spotify',
        url: 'https://open.spotify.com/user/31lv7empst4xdxonkozyeyrtcdje',
        icon: 'spotify',
      },
    ],
  },
  features: {
    splashScreen: true,
    audio: true,
    autoPlayAudioAfterSplash: true,
    visitorCounter: true,
    adminPanelInDevOnly: true,
  },
}

export default profileConfig
