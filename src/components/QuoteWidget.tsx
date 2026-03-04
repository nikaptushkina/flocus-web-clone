import { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'
import { getDailyQuote, getRandomQuote, type Quote } from '../data/quotes'

interface QuoteWidgetProps {
  compact?: boolean
}

export function QuoteWidget({ compact = false }: QuoteWidgetProps) {
  const [quote, setQuote] = useState<Quote>(getDailyQuote())
  const [animating, setAnimating] = useState(false)

  const refreshQuote = () => {
    setAnimating(true)
    setTimeout(() => {
      setQuote(getRandomQuote())
      setAnimating(false)
    }, 200)
  }

  if (compact) {
    return (
      <div
        className="glass-panel-dark rounded-2xl p-4 max-w-xs group cursor-pointer"
        style={{ maxWidth: '320px' }}
      >
        <div
          className="transition-all duration-200"
          style={{ opacity: animating ? 0 : 1, transform: animating ? 'translateY(4px)' : 'none' }}
        >
          <p className="text-white/90 text-sm font-light leading-relaxed italic">
            "{quote.text}"
          </p>
          <p className="text-white/50 text-xs font-medium mt-2">— {quote.author}</p>
        </div>
        <button
          onClick={refreshQuote}
          className="mt-3 text-white/30 hover:text-white/70 transition-colors"
        >
          <RefreshCw size={12} />
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-lg">
      <div
        className="transition-all duration-200"
        style={{ opacity: animating ? 0 : 1, transform: animating ? 'translateY(8px)' : 'none' }}
      >
        <p className="text-white/85 font-light leading-relaxed italic text-shadow"
          style={{ fontSize: 'clamp(16px, 2vw, 22px)' }}>
          "{quote.text}"
        </p>
        <div className="flex items-center justify-between mt-3">
          <p className="text-white/50 text-sm font-medium">— {quote.author}</p>
          <button
            onClick={refreshQuote}
            className="text-white/30 hover:text-white/70 transition-colors hover:scale-110 active:scale-95 ml-4"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
