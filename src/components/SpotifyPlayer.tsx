import { useState, useEffect } from 'react'
import { Music, X, ExternalLink } from 'lucide-react'

interface SpotifyPlayerProps {
  playlistUrl?: string
  onUrlChange: (url: string) => void
  onClose: () => void
}

export function SpotifyPlayer({ playlistUrl, onUrlChange, onClose }: SpotifyPlayerProps) {
  const [inputUrl, setInputUrl] = useState(playlistUrl || '')
  
  // Extract embed URL from standard Spotify URL
  const getEmbedUrl = (url: string) => {
    if (!url) return ''
    try {
      const parts = url.split('spotify.com/')[1]?.split('?')[0].split('/')
      if (parts && parts.length >= 2) {
        const type = parts[0]
        const id = parts[1]
        return `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`
      }
    } catch (e) {
      console.error('Invalid Spotify URL', e)
    }
    return ''
  }

  const embedUrl = getEmbedUrl(playlistUrl || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputUrl.includes('spotify.com')) {
      onUrlChange(inputUrl)
    }
  }

  return (
    <div className="glass-panel-dark rounded-2xl p-4 w-80 animate-scale-in flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white/90 font-semibold text-sm">
          <Music size={16} className="text-[#1DB954]" />
          <span>Spotify Player</span>
        </div>
        <button onClick={onClose} className="text-white/40 hover:text-white/80 transition-colors">
          <X size={16} />
        </button>
      </div>

      {!embedUrl ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <p className="text-white/50 text-[11px] leading-relaxed">
            Paste a Spotify playlist, album, or track link to listen while you work.
          </p>
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            placeholder="https://open.spotify.com/playlist/..."
            className="w-full glass-btn rounded-xl px-3 py-2 text-white/80 text-xs placeholder:text-white/20 outline-none focus:border-white/30"
          />
          <button
            type="submit"
            disabled={!inputUrl.includes('spotify.com')}
            className="w-full py-2 bg-[#1DB954] hover:bg-[#1ed760] disabled:opacity-50 disabled:hover:bg-[#1DB954] text-white font-bold rounded-xl text-xs transition-all shadow-lg active:scale-95"
          >
            Load Playlist
          </button>
        </form>
      ) : (
        <div className="space-y-3">
          <div className="rounded-xl overflow-hidden bg-black/40 h-[352px]">
            <iframe
              src={embedUrl}
              width="100%"
              height="352"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="rounded-xl"
            ></iframe>
          </div>
          <div className="flex justify-between items-center px-1">
            <button
              onClick={() => onUrlChange('')}
              className="text-white/40 hover:text-white/70 text-[10px] font-medium transition-colors"
            >
              Change Playlist
            </button>
            <a
              href={playlistUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white/70 text-[10px] font-medium flex items-center gap-1 transition-colors"
            >
              Open in Spotify <ExternalLink size={10} />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
