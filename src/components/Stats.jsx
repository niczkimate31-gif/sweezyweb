import { useState, useEffect } from 'react'

function Quote() {
  const quotes = [
    "Csak az a kudarc, amit nem próbálsz meg.",
    "A legjobb idő a változásra most van.",
    "Ne félj lassan haladni, csak attól félj, hogy megállsz.",
    "A tegnap múlt, a holnap bizonytalan, a ma ajándék.",
    "Kicsi lépések, nagy változások.",
    "Minden nap új lehetőség.",
    "Ne várj a tökéletes pillanatra, kezdd el most.",
    "A legnagyobb kockázat az, ha nem kockáztatsz.",
  ]

  // Válassz egy véletlenszerű idézetet csak egyszer, amikor a komponens először renderelődik
  const [selectedQuote] = useState(() => {
    // Használj localStorage-t, hogy ugyanaz az idézet maradjon a session alatt
    const storedQuote = sessionStorage.getItem('selectedQuote')
    if (storedQuote) {
      return storedQuote
    }
    const quote = quotes[Math.floor(Math.random() * quotes.length)]
    sessionStorage.setItem('selectedQuote', quote)
    return quote
  })

  return (
    <div className="mb-14 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
      <div className="text-center max-w-2xl mx-auto">
        <div className="relative">
          {/* Opening quote mark */}
          <div className="absolute -top-4 -left-4 md:-left-8 text-white/20 text-6xl md:text-8xl font-serif leading-none">
            "
          </div>
          
          {/* Quote text */}
          <p className="text-base md:text-lg text-white/70 font-light leading-relaxed px-8 md:px-12 relative z-10">
            {selectedQuote}
          </p>
          
          {/* Closing quote mark */}
          <div className="absolute -bottom-4 -right-4 md:-right-8 text-white/20 text-6xl md:text-8xl font-serif leading-none">
            "
          </div>
        </div>
        
        {/* Decorative line */}
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto mt-8"></div>
      </div>
    </div>
  )
}

export default Quote

