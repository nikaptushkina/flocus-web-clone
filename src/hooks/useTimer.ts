import { useState, useEffect, useRef, useCallback } from 'react'
import type { TimerSettings } from '../types'

export type TimerPhase = 'work' | 'break' | 'longBreak'
export type TimerStatus = 'idle' | 'running' | 'paused'

export interface TimerState {
  status: TimerStatus
  secondsLeft: number
  totalSeconds: number
  phase: TimerPhase
  pomodoroCount: number
  stopwatchSeconds: number
  start: () => void
  pause: () => void
  reset: () => void
  skip: () => void
  progress: number
}

export function useTimer(settings: TimerSettings): TimerState {
  const [status, setStatus] = useState<TimerStatus>('idle')
  const [phase, setPhase] = useState<TimerPhase>('work')
  const [pomodoroCount, setPomodoroCount] = useState(0)
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0)

  const getInitialSeconds = useCallback((ph: TimerPhase = phase) => {
    if (settings.mode === 'pomodoro') {
      if (ph === 'work') return settings.pomodoroWork * 60
      if (ph === 'break') return settings.pomodoroBreak * 60
      return settings.pomodoroLong * 60
    }
    if (settings.mode === 'countdown') {
      return settings.countdownMinutes * 60 + settings.countdownSeconds
    }
    return 0
  }, [settings, phase])

  const [secondsLeft, setSecondsLeft] = useState(() => getInitialSeconds('work'))
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Reset when settings change
  useEffect(() => {
    setStatus('idle')
    setPhase('work')
    setPomodoroCount(0)
    setStopwatchSeconds(0)
    setSecondsLeft(getInitialSeconds('work'))
  }, [settings.mode, settings.pomodoroWork, settings.pomodoroBreak, settings.pomodoroLong, settings.countdownMinutes, settings.countdownSeconds])

  useEffect(() => {
    if (status !== 'running') {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }

    intervalRef.current = setInterval(() => {
      if (settings.mode === 'stopwatch') {
        setStopwatchSeconds(s => s + 1)
      } else {
        setSecondsLeft(s => {
          if (s <= 1) {
            // Timer finished
            if (settings.mode === 'pomodoro') {
              if (phase === 'work') {
                const newCount = pomodoroCount + 1
                setPomodoroCount(newCount)
                const nextPhase: TimerPhase = newCount % 4 === 0 ? 'longBreak' : 'break'
                setPhase(nextPhase)
                setSecondsLeft(getInitialSeconds(nextPhase))
              } else {
                setPhase('work')
                setSecondsLeft(getInitialSeconds('work'))
              }
            } else {
              setStatus('idle')
              return 0
            }
          }
          return s - 1
        })
      }
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [status, settings.mode, phase, pomodoroCount, getInitialSeconds])

  const start = useCallback(() => setStatus('running'), [])
  const pause = useCallback(() => setStatus('paused'), [])
  
  const reset = useCallback(() => {
    setStatus('idle')
    setPhase('work')
    setPomodoroCount(0)
    setStopwatchSeconds(0)
    setSecondsLeft(getInitialSeconds('work'))
  }, [getInitialSeconds])

  const skip = useCallback(() => {
    if (settings.mode === 'pomodoro') {
      if (phase === 'work') {
        const newCount = pomodoroCount + 1
        setPomodoroCount(newCount)
        const nextPhase: TimerPhase = newCount % 4 === 0 ? 'longBreak' : 'break'
        setPhase(nextPhase)
        setSecondsLeft(getInitialSeconds(nextPhase))
      } else {
        setPhase('work')
        setSecondsLeft(getInitialSeconds('work'))
      }
    } else {
      reset()
    }
  }, [settings.mode, phase, pomodoroCount, getInitialSeconds, reset])

  const total = settings.mode === 'stopwatch' ? 0 : getInitialSeconds()
  const current = settings.mode === 'stopwatch' ? stopwatchSeconds : secondsLeft
  const progress = total > 0 ? 1 - (secondsLeft / total) : 0

  return {
    status,
    secondsLeft,
    totalSeconds: total,
    phase,
    pomodoroCount,
    stopwatchSeconds,
    start,
    pause,
    reset,
    skip,
    progress,
  }
}
