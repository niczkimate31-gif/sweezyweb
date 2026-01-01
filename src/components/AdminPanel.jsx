import { useState, useEffect } from 'react'

function AdminPanel({ isOpen, onClose, onVisitorCountUpdate, enabled = import.meta.env.PROD ? false : true }) {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [visitorCount, setVisitorCount] = useState(0)
  const [error, setError] = useState('')

  // Admin password - change this to your desired password
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD

  useEffect(() => {
    if (isOpen) {
      // Load current visitor count
      const storedCount = localStorage.getItem('visitorCount')
      setVisitorCount(storedCount ? parseInt(storedCount, 10) : 0)
      
      // Check if already authenticated in this session
      const authStatus = sessionStorage.getItem('adminAuth')
      if (authStatus === 'true') {
        setIsAuthenticated(true)
      }
    }
  }, [isOpen])

  const handleLogin = (e) => {
    e.preventDefault()
    if (ADMIN_PASSWORD && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem('adminAuth', 'true')
      setError('')
    } else {
      setError('Hibás jelszó!')
      setPassword('')
    }
  }

  const handleUpdateVisitorCount = () => {
    localStorage.setItem('visitorCount', visitorCount.toString())
    if (onVisitorCountUpdate) {
      onVisitorCountUpdate(visitorCount)
    }
    alert(`Látogatószámláló frissítve: ${visitorCount}`)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem('adminAuth')
    setPassword('')
    onClose()
  }

  if (!enabled) return null
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 max-w-md w-full shadow-2xl">
        {!isAuthenticated ? (
          <div>
            <h2 className="text-2xl font-light text-white mb-4">Admin Bejelentkezés</h2>
            <form onSubmit={handleLogin}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Jelszó"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-white/40 mb-4"
                autoFocus
              />
              {error && (
                <p className="text-red-400 text-sm mb-4">{error}</p>
              )}
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-white/20 hover:bg-white/30 border border-white/30 rounded-lg px-4 py-2 text-white transition-all duration-200"
                >
                  Bejelentkezés
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-4 py-2 text-white transition-all duration-200"
                >
                  Mégse
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-light text-white">Admin Panel</h2>
              <button
                onClick={handleLogout}
                className="text-white/60 hover:text-white transition-colors"
                aria-label="Kijelentkezés"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">
                  Látogatószámláló
                </label>
                <input
                  type="number"
                  value={visitorCount}
                  onChange={(e) => setVisitorCount(parseInt(e.target.value) || 0)}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/40"
                  min="0"
                />
                <button
                  onClick={handleUpdateVisitorCount}
                  className="mt-3 w-full bg-white/20 hover:bg-white/30 border border-white/30 rounded-lg px-4 py-2 text-white transition-all duration-200"
                >
                  Frissítés
                </button>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-6 w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-4 py-2 text-white transition-all duration-200"
            >
              Bezárás
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel

