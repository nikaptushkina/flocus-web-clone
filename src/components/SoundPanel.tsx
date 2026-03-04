import { useState, useRef, useEffect } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { sounds } from '../data/sounds'
import type { SoundState } from '../types'

interface SoundPanelProps {
  activeSounds: SoundState[]
  onToggleSound: (soundId: string) => void
  onVolumeChange: (soundId: string, volume: number) => void
}

export function SoundPanel({ activeSounds, onToggleSound, onVolumeChange }: SoundPanelProps) {
  return (
    <div className="glass-panel-dark rounded-2xl p-4 w-64 animate-scale-in">
      <h3 className="text-white/90 font-semibold text-sm mb-4">Soundscapes</h3>
      <div className="space-y-3">
        {sounds.map(sound => {
          const active = activeSounds.find(s => s.soundId === sound.id)
          const isPlaying = active?.playing ?? false
          const volume = active?.volume ?? 0.5

          return (
            <div key={sound.id} className="space-y-1.5">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onToggleSound(sound.id)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-base transition-all hover:scale-110 active:scale-95 ${
                    isPlaying
                      ? 'bg-white/25 text-white'
                      : 'bg-white/8 text-white/50 hover:text-white/80'
                  }`}
                >
                  {sound.emoji}
                </button>
                <span className={`text-xs font-medium flex-1 ${isPlaying ? 'text-white/90' : 'text-white/50'}`}>
                  {sound.name}
                </span>
                {isPlaying && (
                  <div className="flex gap-0.5 items-end h-4">
                    {[0, 1, 2].map(i => (
                      <div
                        key={i}
                        className="w-0.5 bg-white/60 rounded-full animate-pulse"
                        style={{
                          height: `${40 + i * 25}%`,
                          animationDelay: `${i * 0.15}s`,
                          animationDuration: '0.8s',
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
              {isPlaying && (
                <div className="flex items-center gap-2 pl-11">
                  <VolumeX size={10} className="text-white/40" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={e => onVolumeChange(sound.id, parseFloat(e.target.value))}
                    className="flex-1 h-1 accent-white/70 cursor-pointer"
                  />
                  <Volume2 size={10} className="text-white/40" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Audio manager hook
export function useSoundManager(activeSounds: SoundState[]) {
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({})

  useEffect(() => {
    activeSounds.forEach(({ soundId, volume, playing }) => {
      const sound = sounds.find(s => s.id === soundId)
      if (!sound) return

      if (!audioRefs.current[soundId]) {
        const audio = new Audio(sound.url)
        audio.loop = true
        audio.volume = volume
        audioRefs.current[soundId] = audio
      }

      const audio = audioRefs.current[soundId]
      audio.volume = volume

      if (playing && audio.paused) {
        audio.play().catch(() => {})
      } else if (!playing && !audio.paused) {
        audio.pause()
      }
    })

    // Stop sounds not in active list
    Object.keys(audioRefs.current).forEach(id => {
      const isActive = activeSounds.find(s => s.soundId === id)
      if (!isActive || !isActive.playing) {
        audioRefs.current[id]?.pause()
      }
    })
  }, [activeSounds])

  useEffect(() => {
    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause()
        audio.src = ''
      })
    }
  }, [])
}
