import { Check, Upload, Video, Trash2 } from 'lucide-react'
import { themes } from '../data/themes'
import type { CustomTheme } from '../types'
import { blink } from '../blink/client'
import { useState } from 'react'

interface ThemeSelectorProps {
  activeThemeId: string
  customThemes: CustomTheme[]
  overlayOpacity: number
  onSelect: (themeId: string) => void
  onAddCustomTheme: (theme: CustomTheme) => void
  onOpacityChange: (opacity: number) => void
}

export function ThemeSelector({ 
  activeThemeId, 
  customThemes, 
  overlayOpacity,
  onSelect, 
  onAddCustomTheme,
  onOpacityChange 
}: ThemeSelectorProps) {
  const [uploading, setUploading] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  const [showVideoInput, setShowVideoInput] = useState(false)

  const categories = ['ghibli', 'lofi', 'animated', 'nature', 'city', 'minimal'] as const

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const { publicUrl } = await blink.storage.upload(file, `backgrounds/${Date.now()}.${ext}`)
      
      const newTheme: CustomTheme = {
        id: `custom-${Date.now()}`,
        type: 'image',
        url: publicUrl,
        overlayOpacity: 0.4
      }
      onAddCustomTheme(newTheme)
      onSelect(newTheme.id)
    } catch (error) {
      console.error('Upload failed', error)
    } finally {
      setUploading(false)
    }
  }

  const handleAddVideo = () => {
    if (!videoUrl) return
    const newTheme: CustomTheme = {
      id: `custom-video-${Date.now()}`,
      type: 'video',
      url: videoUrl,
      overlayOpacity: 0.4
    }
    onAddCustomTheme(newTheme)
    onSelect(newTheme.id)
    setVideoUrl('')
    setShowVideoInput(false)
  }

  return (
    <div className="glass-panel-dark rounded-2xl p-4 w-80 max-h-[420px] overflow-y-auto scrollbar-hide animate-scale-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white/90 font-semibold text-sm">Themes</h3>
        <div className="flex gap-2">
          <label className="cursor-pointer glass-btn w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white transition-all">
            <Upload size={14} />
            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
          </label>
          <button 
            onClick={() => setShowVideoInput(!showVideoInput)}
            className="glass-btn w-8 h-8 rounded-lg flex items-center justify-center text-white/60 hover:text-white transition-all"
          >
            <Video size={14} />
          </button>
        </div>
      </div>

      {showVideoInput && (
        <div className="mb-4 space-y-2 animate-fade-in">
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Paste video MP4 URL..."
            className="w-full glass-btn rounded-xl px-3 py-2 text-white/80 text-[10px] outline-none"
          />
          <button
            onClick={handleAddVideo}
            className="w-full py-1.5 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold rounded-lg transition-all"
          >
            Add Video Background
          </button>
        </div>
      )}

      {/* Opacity Control */}
      <div className="mb-6 p-3 glass-btn rounded-xl space-y-2">
        <div className="flex justify-between items-center text-[10px] font-semibold text-white/60 uppercase tracking-wider">
          <span>Overlay Opacity</span>
          <span>{Math.round(overlayOpacity * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="0.9"
          step="0.01"
          value={overlayOpacity}
          onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
          className="w-full h-1 accent-white/70 cursor-pointer"
        />
      </div>

      {/* Custom Themes */}
      {customThemes.length > 0 && (
        <div className="mb-4">
          <p className="text-white/40 text-[10px] font-semibold uppercase tracking-widest mb-2">My Themes</p>
          <div className="grid grid-cols-3 gap-2">
            {customThemes.map(theme => (
              <button
                key={theme.id}
                onClick={() => onSelect(theme.id)}
                className="relative group rounded-xl overflow-hidden aspect-video transition-all hover:scale-105"
              >
                {theme.type === 'video' ? (
                  <video src={theme.url} className="w-full h-full object-cover" />
                ) : (
                  <img src={theme.url} className="w-full h-full object-cover" />
                )}
                <div className={`absolute inset-0 rounded-xl ring-2 transition-all ${
                  activeThemeId === theme.id ? 'ring-white' : 'ring-transparent'
                }`} />
                {activeThemeId === theme.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Check size={14} className="text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {categories.map(cat => {
        const catThemes = themes.filter(t => t.category === cat)
        if (catThemes.length === 0) return null
        return (
          <div key={cat} className="mb-4">
            <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-2">
              {cat}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {catThemes.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => onSelect(theme.id)}
                  className="relative group rounded-xl overflow-hidden aspect-video transition-all hover:scale-105 active:scale-95"
                >
                  <img
                    src={theme.imageUrl}
                    alt={theme.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0 rounded-xl"
                    style={{ background: `rgba(0,0,0,${theme.overlayOpacity})` }}
                  />
                  {activeThemeId === theme.id && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                        <Check size={14} className="text-gray-900" />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-[10px] font-medium text-center truncate">{theme.name}</p>
                  </div>
                  <div className={`absolute inset-0 rounded-xl ring-2 transition-all ${
                    activeThemeId === theme.id ? 'ring-white' : 'ring-transparent group-hover:ring-white/50'
                  }`} />
                </button>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
