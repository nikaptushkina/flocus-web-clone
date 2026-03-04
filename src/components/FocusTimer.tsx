import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react'
import type { TimerSettings, TallyIcon } from '../types'
import { useTimer } from '../hooks/useTimer'
import { alerts } from '../data/alerts'
import { useEffect, useRef } from 'react'

interface FocusTimerProps {
  settings: TimerSettings
  onModeChange?: (mode: TimerSettings['mode']) => void
}

export function FocusTimer({ settings, onModeChange }: FocusTimerProps) {
  const timer = useTimer(settings)
  const lastPhaseRef = useRef(timer.phase)
  const lastStatusRef = useRef(timer.status)

  // Alert sound handling
  useEffect(() => {
    // Play alert when phase changes (e.g. from work to break)
    // or when status becomes idle after running (countdown finished)
    const phaseChanged = lastPhaseRef.current !== timer.phase
    const finished = lastStatusRef.current === 'running' && timer.status === 'idle' && settings.mode === 'countdown'

    if ((phaseChanged || finished) && settings.alertStyle !== 'none') {
      const alert = alerts.find(a => a.id === settings.alertStyle)
      if (alert?.url) {
        const audio = new Audio(alert.url)
        audio.volume = 0.5
        audio.play().catch(() => {})
      }
    }

    lastPhaseRef.current = timer.phase
    lastStatusRef.current = timer.status
  }, [timer.phase, timer.status, settings.alertStyle, settings.mode])

  const padTwo = (n: number) => n.toString().padStart(2, '0')

  const formatTime = () => {
    if (settings.mode === 'stopwatch') {
      const h = Math.floor(timer.stopwatchSeconds / 3600)
      const m = Math.floor((timer.stopwatchSeconds % 3600) / 60)
      const s = timer.stopwatchSeconds % 60
      if (h > 0) return `${padTwo(h)}:${padTwo(m)}:${padTwo(s)}`
      return `${padTwo(m)}:${padTwo(s)}`
    }
    const m = Math.floor(timer.secondsLeft / 60)
    const s = timer.secondsLeft % 60
    return `${padTwo(m)}:${padTwo(s)}`
  }

  const phaseLabel = () => {
    if (settings.mode === 'pomodoro') {
      if (timer.phase === 'work') return 'Focus Time'
      if (timer.phase === 'break') return 'Short Break'
      return 'Long Break'
    }
    if (settings.mode === 'countdown') return 'Countdown'
    return 'Stopwatch'
  }

  const phaseColor = () => {
    if (settings.mode === 'pomodoro') {
      if (timer.phase === 'work') return '#f87171'
      if (timer.phase === 'break') return '#6ee7b7'
      return '#93c5fd'
    }
    return '#a78bfa'
  }

  const radius = 90
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - timer.progress)

  const renderTally = () => {
    const icons: Record<TallyIcon, string> = {
      'dots': '●',
      'hearts': '❤️',
      'stars': '⭐️',
      'tomatoes': '🍅',
      'bolts': '⚡️',
      'graduation': '🎓',
      'snowflake': '❄️',
      'snowman': '☃️',
      'christmas-tree': '🎄',
    }
    const icon = icons[settings.tallyIcon]
    return Array.from({ length: timer.pomodoroCount }).map((_, i) => (
      <span key={i} className="text-xs filter drop-shadow-sm">{icon}</span>
    ))
  }

  return (
    <div className="flex flex-col items-center gap-6 animate-slide-up">
      {/* Mode tabs */}
      <div className="flex gap-1 glass-panel rounded-full p-1">
        {(['pomodoro', 'countdown', 'stopwatch'] as const).map(m => (
          <button
            key={m}
            onClick={() => onModeChange?.(m)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all capitalize ${
              settings.mode === m
                ? 'bg-white/20 text-white'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            {m === 'pomodoro' ? 'Pomodoro' : m === 'countdown' ? 'Timer' : 'Stopwatch'}
          </button>
        ))}
      </div>

      {/* Phase label */}
      <p className="text-white/60 text-sm font-medium tracking-widest uppercase" style={{ color: phaseColor() }}>
        {phaseLabel()}
        {settings.mode === 'pomodoro' && timer.pomodoroCount > 0 && (
          <span className="ml-2 text-white/40">#{timer.pomodoroCount}</span>
        )}
      </p>

      {/* Circular timer */}
      <div className="relative flex items-center justify-center">
        <svg width="220" height="220" className="-rotate-90">
          {/* Background track */}
          <circle
            cx="110"
            cy="110"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="6"
          />
          {/* Progress arc */}
          {(settings.mode !== 'stopwatch') && (
            <circle
              cx="110"
              cy="110"
              r={radius}
              fill="none"
              stroke={phaseColor()}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          )}
        </svg>

        {/* Time display */}
        <div className="absolute text-center">
          <div
            className="font-black text-white leading-none text-shadow-lg"
            style={{ fontSize: '52px', letterSpacing: '-0.02em' }}
          >
            {formatTime()}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={timer.reset}
          className="glass-btn w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-all active:scale-95"
        >
          <RotateCcw size={16} />
        </button>

        <button
          onClick={timer.status === 'running' ? timer.pause : timer.start}
          className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-lg"
          style={{ background: phaseColor() }}
        >
          {timer.status === 'running'
            ? <Pause size={22} fill="white" />
            : <Play size={22} fill="white" className="translate-x-0.5" />
          }
        </button>

        {settings.mode === 'pomodoro' && (
          <button
            onClick={timer.skip}
            className="glass-btn w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-all active:scale-95"
          >
            <SkipForward size={16} />
          </button>
        )}
      </div>

      {/* Pomodoro tallies */}
      {settings.mode === 'pomodoro' && timer.pomodoroCount > 0 && (
        <div className="flex flex-wrap justify-center gap-1.5 max-w-[200px]">
          {renderTally()}
        </div>
      )}

      {/* Legacy Pomodoro dots fallback if count is 0 but still in pomodoro mode */}
      {settings.mode === 'pomodoro' && timer.pomodoroCount === 0 && (
        <div className="flex gap-2">
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className="w-2 h-2 rounded-full transition-all"
              style={{
                background: i < (timer.pomodoroCount % 4)
                  ? phaseColor()
                  : 'rgba(255,255,255,0.2)'
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}