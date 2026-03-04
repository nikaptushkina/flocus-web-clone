import { useState, useCallback, useEffect } from 'react'
import type { DashboardMode, AppSettings, SoundState, Todo, TimerSettings } from './types'
import { themes } from './data/themes'
import { ClockDisplay } from './components/ClockDisplay'
import { QuoteWidget } from './components/QuoteWidget'
import { FocusTimer } from './components/FocusTimer'
import { TodoList } from './components/TodoList'
import { SoundPanel, useSoundManager } from './components/SoundPanel'
import { ThemeSelector } from './components/ThemeSelector'
import { SettingsPanel } from './components/SettingsPanel'
import { StatsPanel } from './components/StatsPanel'
import { SpotifyPlayer } from './components/SpotifyPlayer'
import { Toolbar } from './components/Toolbar'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useClock } from './hooks/useClock'

const defaultSettings: AppSettings = {
  userName: '',
  use24Hour: false,
  showSeconds: false,
  showDate: true,
  showGreeting: true,
  clearMode: false,
  activeThemeIds: {
    home: 'pink-clouds',
    focus: 'minimal-dark',
    ambient: 'lavender-fields',
  },
  activeOpacities: {
    home: 0.4,
    focus: 0.55,
    ambient: 0.2,
  },
  customThemes: [],
  timerSettings: {
    mode: 'pomodoro',
    pomodoroWork: 25,
    pomodoroBreak: 5,
    pomodoroLong: 15,
    countdownMinutes: 25,
    countdownSeconds: 0,
    alertStyle: 'chime',
    tallyIcon: 'dots',
  },
}

export default function App() {
  const [mode, setMode] = useLocalStorage<DashboardMode>('flocus-mode', 'home')
  const [settings, setSettings] = useLocalStorage<AppSettings>('flocus-settings', defaultSettings)
  const [todos, setTodos] = useLocalStorage<Todo[]>('flocus-todos', [])
  const [activeSounds, setActiveSounds] = useLocalStorage<SoundState[]>('flocus-sounds', [])
  const [focusMinutes] = useLocalStorage<number>('flocus-focus-minutes', 0)

  const [soundsOpen, setSoundsOpen] = useState(false)
  const [themesOpen, setThemesOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [statsOpen, setStatsOpen] = useState(false)
  const [spotifyOpen, setSpotifyOpen] = useState(false)
  const [isMouseOver, setIsMouseOver] = useState(true)

  // Clear Mode handling
  useEffect(() => {
    if (!settings.clearMode) {
      setIsMouseOver(true)
      return
    }

    const handleMouseEnter = () => setIsMouseOver(true)
    const handleMouseLeave = () => setIsMouseOver(false)

    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)
    
    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [settings.clearMode])

  // Sound manager
  useSoundManager(activeSounds)

  const activeThemeId = settings.activeThemeIds?.[mode] ?? defaultSettings.activeThemeIds[mode]
  const baseTheme = themes.find(t => t.id === activeThemeId)
  const customTheme = (settings.customThemes ?? []).find(t => t.id === activeThemeId)
  
  const currentOpacity = settings.activeOpacities?.[mode] ?? defaultSettings.activeOpacities[mode]

  const activeTheme = baseTheme || (customTheme ? {
    id: customTheme.id,
    name: 'Custom',
    imageUrl: customTheme.type === 'image' ? customTheme.url : '',
    videoUrl: customTheme.type === 'video' ? customTheme.url : '',
    overlayOpacity: customTheme.overlayOpacity, // Fallback, we use settings.activeOpacities
  } : themes[0])

  const handleModeChange = (newMode: DashboardMode) => {
    setMode(newMode)
    // Close panels on mode change
    setSoundsOpen(false)
    setThemesOpen(false)
    setSettingsOpen(false)
    setStatsOpen(false)
    setSpotifyOpen(false)
  }

  const handleToggleSpotify = () => {
    setSpotifyOpen(v => !v)
    setSoundsOpen(false)
    setThemesOpen(false)
    setSettingsOpen(false)
    setStatsOpen(false)
  }

  const handleToggleSounds = () => {
    setSoundsOpen(v => !v)
    setThemesOpen(false)
    setSettingsOpen(false)
    setStatsOpen(false)
    setSpotifyOpen(false)
  }

  const handleToggleThemes = () => {
    setThemesOpen(v => !v)
    setSoundsOpen(false)
    setSettingsOpen(false)
    setStatsOpen(false)
    setSpotifyOpen(false)
  }

  const handleToggleSettings = () => {
    setSettingsOpen(v => !v)
    setSoundsOpen(false)
    setThemesOpen(false)
    setStatsOpen(false)
    setSpotifyOpen(false)
  }

  const handleToggleStats = () => {
    setStatsOpen(v => !v)
    setSoundsOpen(false)
    setThemesOpen(false)
    setSettingsOpen(false)
    setSpotifyOpen(false)
  }

  const handleToggleSound = useCallback((soundId: string) => {
    setActiveSounds(prev => {
      const exists = prev.find(s => s.soundId === soundId)
      if (exists) {
        return prev.map(s =>
          s.soundId === soundId ? { ...s, playing: !s.playing } : s
        )
      }
      return [...prev, { soundId, volume: 0.5, playing: true }]
    })
  }, [setActiveSounds])

  const handleVolumeChange = useCallback((soundId: string, volume: number) => {
    setActiveSounds(prev =>
      prev.map(s => s.soundId === soundId ? { ...s, volume } : s)
    )
  }, [setActiveSounds])

  const handleAddTodo = useCallback((text: string, priority: boolean) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      priority,
      createdAt: Date.now(),
    }
    setTodos(prev => [newTodo, ...prev])
  }, [setTodos])

  const handleToggleTodo = useCallback((id: string) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }, [setTodos])

  const handleDeleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(t => t.id !== id))
  }, [setTodos])

  const handleTogglePriority = useCallback((id: string) => {
    setTodos(prev => prev.map(t =>
      t.id === id ? { ...t, priority: !t.priority } : { ...t, priority: false }
    ))
  }, [setTodos])

  const soundsActive = activeSounds.some(s => s.playing)
  const completedTodos = todos.filter(t => t.completed).length

  const showUI = !settings.clearMode || isMouseOver

  return (
    <div className={`w-screen h-screen flex flex-col relative overflow-hidden transition-all duration-500 lofi-grain ${!showUI ? 'cursor-none' : ''}`}>
      {/* Background */}
      <div className="absolute inset-0 transition-all duration-1000 overflow-hidden">
        {activeTheme.videoUrl ? (
          <video
            key={activeTheme.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={activeTheme.videoUrl} type="video/mp4" />
          </video>
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
            style={{ backgroundImage: `url(${activeTheme.imageUrl})` }}
          />
        )}
      </div>
      
      {/* Vignette */}
      <div className="vignette" />

      {/* Overlay */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          background: `rgba(0,0,0,${currentOpacity})`,
        }}
      />

      {/* Main content */}
      <div className={`relative flex-1 flex flex-col overflow-hidden transition-opacity duration-700 ${!showUI ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>

        {mode === 'home' && (
          <HomeMode
            settings={settings}
          />
        )}

        {mode === 'focus' && (
          <FocusMode
            settings={settings}
            todos={todos}
            onAddTodo={handleAddTodo}
            onToggleTodo={handleToggleTodo}
            onDeleteTodo={handleDeleteTodo}
            onTogglePriority={handleTogglePriority}
            onTimerModeChange={(timerMode) => setSettings(s => ({
              ...s,
              timerSettings: { ...s.timerSettings, mode: timerMode }
            }))}
          />
        )}

        {mode === 'ambient' && (
          <AmbientMode />
        )}

        {/* Floating panels - bottom right area */}
        <div className="absolute bottom-16 right-4 flex flex-col items-end gap-3 z-20">
          {soundsOpen && (
            <SoundPanel
              activeSounds={activeSounds}
              onToggleSound={handleToggleSound}
              onVolumeChange={handleVolumeChange}
            />
          )}
          {themesOpen && (
            <ThemeSelector
              activeThemeId={settings.activeThemeIds?.[mode] ?? defaultSettings.activeThemeIds[mode]}
              customThemes={settings.customThemes ?? []}
              overlayOpacity={currentOpacity}
              onSelect={(id) => {
                const theme = themes.find(t => t.id === id)
                const themeIds = settings.activeThemeIds ?? defaultSettings.activeThemeIds
                const opacities = settings.activeOpacities ?? defaultSettings.activeOpacities
                setSettings(s => ({
                  ...s,
                  activeThemeIds: { ...themeIds, [mode]: id },
                  activeOpacities: { 
                    ...opacities, 
                    [mode]: theme ? theme.overlayOpacity : opacities[mode] 
                  }
                }))
              }}
              onAddCustomTheme={(theme) => setSettings(s => ({
                ...s,
                customThemes: [...(s.customThemes ?? []), theme]
              }))}
              onOpacityChange={(opacity) => {
                const opacities = settings.activeOpacities ?? defaultSettings.activeOpacities
                setSettings(s => ({
                  ...s,
                  activeOpacities: { ...opacities, [mode]: opacity }
                }))
              }}
            />
          )}
          {spotifyOpen && (
            <SpotifyPlayer
              playlistUrl={settings.spotifyPlaylistUrl}
              onUrlChange={(url) => setSettings(s => ({ ...s, spotifyPlaylistUrl: url }))}
              onClose={() => setSpotifyOpen(false)}
            />
          )}
          {settingsOpen && (
            <SettingsPanel
              settings={settings}
              onChange={(updates) => setSettings(s => ({ ...s, ...updates }))}
              onClose={() => setSettingsOpen(false)}
            />
          )}
          {statsOpen && (
            <StatsPanel
              onClose={() => setStatsOpen(false)}
              completedTodos={completedTodos}
              focusMinutes={focusMinutes}
            />
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className={`transition-all duration-700 ${!showUI ? 'opacity-0 translate-y-10 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
        <Toolbar
          mode={mode}
          onModeChange={handleModeChange}
          onToggleSounds={handleToggleSounds}
          onToggleThemes={handleToggleThemes}
          onToggleSettings={handleToggleSettings}
          onToggleStats={handleToggleStats}
          onToggleSpotify={handleToggleSpotify}
          soundsActive={soundsActive}
          soundsOpen={soundsOpen}
          themesOpen={themesOpen}
          settingsOpen={settingsOpen}
          statsOpen={statsOpen}
          spotifyOpen={spotifyOpen}
        />
      </div>
    </div>
  )
}

// ─── Home Mode ────────────────────────────────────────────────────────────────

function HomeMode({ settings }: { settings: AppSettings }) {
  const clock = useClock(settings.userName)

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative px-8">
      {/* Quote - top right */}
      <div className="absolute top-6 right-6 z-10">
        <QuoteWidget compact />
      </div>

      {/* Main center */}
      <div className="text-center">
        {settings.showGreeting && (
          <p
            className="text-white/70 font-medium tracking-[0.1em] mb-1 text-shadow animate-fade-in"
            style={{ fontSize: 'clamp(16px, 2vw, 24px)', animationDelay: '0.1s' }}
          >
            {clock.greeting}
          </p>
        )}
        <div style={{ animationDelay: '0.2s' }}>
          <ClockDisplay
            userName={settings.userName}
            use24Hour={settings.use24Hour}
            showSeconds={settings.showSeconds}
            showDate={settings.showDate}
            mode="home"
          />
        </div>
      </div>
    </div>
  )
}

// ─── Focus Mode ────────────────────────────────────────────────────────────────

interface FocusModeProps {
  settings: AppSettings
  todos: Todo[]
  onAddTodo: (text: string, priority: boolean) => void
  onToggleTodo: (id: string) => void
  onDeleteTodo: (id: string) => void
  onTogglePriority: (id: string) => void
  onTimerModeChange: (mode: TimerSettings['mode']) => void
}

function FocusMode({
  settings,
  todos,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onTogglePriority,
  onTimerModeChange,
}: FocusModeProps) {
  return (
    <div className="flex-1 flex items-center justify-center gap-12 px-8">
      {/* Timer */}
      <div className="flex flex-col items-center">
        <FocusTimer settings={settings.timerSettings} onModeChange={onTimerModeChange} />
      </div>

      {/* Divider */}
      <div className="hidden lg:block w-px h-64 bg-white/10" />

      {/* Todo list */}
      <div className="hidden lg:block">
        <TodoList
          todos={todos}
          onAdd={onAddTodo}
          onToggle={onToggleTodo}
          onDelete={onDeleteTodo}
          onTogglePriority={onTogglePriority}
        />
      </div>

      {/* Quote - bottom left */}
      <div className="absolute bottom-16 left-6">
        <QuoteWidget compact />
      </div>
    </div>
  )
}

// ─── Ambient Mode ────────────────────────────────────────────────────────────

function AmbientMode() {
  return (
    <div className="flex-1 flex items-end justify-end p-6">
      <div className="flex flex-col items-end gap-1 opacity-60 hover:opacity-100 transition-opacity duration-500">
        <ClockDisplay mode="ambient" use24Hour={false} />
      </div>
    </div>
  )
}
