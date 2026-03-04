import { useState } from 'react'
import {
  Home,
  Timer,
  Waves,
  Palette,
  Music,
  Settings,
  Volume2,
  BarChart2,
  LayoutDashboard,
} from 'lucide-react'
import type { DashboardMode } from '../types'

interface ToolbarProps {
  mode: DashboardMode
  onModeChange: (mode: DashboardMode) => void
  onToggleSounds: () => void
  onToggleThemes: () => void
  onToggleSettings: () => void
  onToggleStats: () => void
  onToggleSpotify: () => void
  soundsActive: boolean
  soundsOpen: boolean
  themesOpen: boolean
  settingsOpen: boolean
  statsOpen: boolean
  spotifyOpen: boolean
}

export function Toolbar({
  mode,
  onModeChange,
  onToggleSounds,
  onToggleThemes,
  onToggleSettings,
  onToggleStats,
  onToggleSpotify,
  soundsActive,
  soundsOpen,
  themesOpen,
  settingsOpen,
  statsOpen,
  spotifyOpen,
}: ToolbarProps) {
  return (
    <div className="flocus-toolbar h-14 flex items-center px-4 gap-1">
      {/* Left - Nav Links */}
      <div className="flex items-center gap-1 mr-auto">
        <ToolbarButton
          icon={<Home size={16} />}
          label="Home"
          active={mode === 'home'}
          onClick={() => onModeChange('home')}
        />
        <ToolbarButton
          icon={<Timer size={16} />}
          label="Focus"
          active={mode === 'focus'}
          onClick={() => onModeChange('focus')}
        />
        <ToolbarButton
          icon={<LayoutDashboard size={16} />}
          label="Ambient"
          active={mode === 'ambient'}
          onClick={() => onModeChange('ambient')}
        />
      </div>

      {/* Center - Flocus brand */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <span className="text-white/40 text-xs font-semibold tracking-[0.2em] uppercase">Flocus</span>
      </div>

      {/* Right - Widgets */}
      <div className="flex items-center gap-1 ml-auto">
        <ToolbarButton
          icon={<Volume2 size={16} />}
          label="Sounds"
          active={soundsOpen}
          highlight={soundsActive}
          onClick={onToggleSounds}
        />
        <ToolbarButton
          icon={<Music size={16} />}
          label="Music"
          active={spotifyOpen}
          onClick={onToggleSpotify}
        />
        <ToolbarButton
          icon={<Palette size={16} />}
          label="Themes"
          active={themesOpen}
          onClick={onToggleThemes}
        />
        <ToolbarButton
          icon={<BarChart2 size={16} />}
          label="Stats"
          active={statsOpen}
          onClick={onToggleStats}
        />
        <div className="w-px h-5 bg-white/10 mx-1" />
        <ToolbarButton
          icon={<Settings size={16} />}
          label="Settings"
          active={settingsOpen}
          onClick={onToggleSettings}
        />
      </div>
    </div>
  )
}

interface ToolbarButtonProps {
  icon: React.ReactNode
  label: string
  active: boolean
  highlight?: boolean
  onClick: () => void
}

function ToolbarButton({ icon, label, active, highlight, onClick }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105 active:scale-95 ${
        active
          ? 'bg-white/15 text-white'
          : 'text-white/50 hover:text-white/80 hover:bg-white/8'
      }`}
    >
      {icon}
      <span className="hidden sm:block">{label}</span>
      {highlight && (
        <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-green-400" />
      )}
    </button>
  )
}