export type DashboardMode = 'home' | 'focus' | 'ambient'

export type TimerMode = 'pomodoro' | 'countdown' | 'stopwatch'

export type TallyIcon = 'dots' | 'hearts' | 'stars' | 'tomatoes' | 'bolts' | 'graduation' | 'snowflake' | 'snowman' | 'christmas-tree'

export type AlertStyle = 'sparkle' | 'train' | 'commuter' | 'gameshow' | 'airport' | 'soft' | 'chime' | 'piano' | 'success' | 'levelup' | 'applause' | 'none'

export interface TimerSettings {
  mode: TimerMode
  pomodoroWork: number     // minutes
  pomodoroBreak: number    // minutes
  pomodoroLong: number     // minutes
  countdownMinutes: number
  countdownSeconds: number
  alertStyle: AlertStyle
  tallyIcon: TallyIcon
}

export interface Todo {
  id: string
  text: string
  completed: boolean
  priority: boolean
  createdAt: number
}

export interface SoundState {
  soundId: string
  volume: number
  playing: boolean
}

export interface CustomTheme {
  id: string
  type: 'image' | 'video'
  url: string
  overlayOpacity: number
}

export interface AppSettings {
  userName: string
  use24Hour: boolean
  showSeconds: boolean
  showDate: boolean
  showGreeting: boolean
  clearMode: boolean
  activeThemeIds: Record<DashboardMode, string>
  activeOpacities: Record<DashboardMode, number>
  customThemes: CustomTheme[]
  spotifyPlaylistUrl?: string
  timerSettings: TimerSettings
}