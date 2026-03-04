import { useClock } from '../hooks/useClock'

interface ClockDisplayProps {
  userName?: string
  use24Hour?: boolean
  showSeconds?: boolean
  showDate?: boolean
  mode: 'home' | 'focus' | 'ambient'
}

export function ClockDisplay({
  userName = '',
  use24Hour = false,
  showSeconds = false,
  showDate = true,
  mode,
}: ClockDisplayProps) {
  const clock = useClock(userName)

  const padTwo = (n: number) => n.toString().padStart(2, '0')

  const displayHours = use24Hour ? padTwo(clock.hours) : padTwo(clock.hours12)
  const displayMinutes = padTwo(clock.minutes)
  const displaySeconds = padTwo(clock.seconds)

  if (mode === 'ambient') {
    return (
      <div className="text-white/70 text-sm font-medium tracking-widest drop-shadow-md">
        {displayHours}:{displayMinutes}{!use24Hour && ` ${clock.ampm}`}
      </div>
    )
  }

  return (
    <div className="text-center animate-fade-in">
      {showDate && (
        <p className="text-white/60 text-sm font-medium tracking-[0.2em] uppercase mb-3 text-shadow">
          {clock.dateString}
        </p>
      )}
      <div className="flex items-end justify-center gap-1">
        <span
          className="font-black text-white leading-none text-shadow-lg select-none"
          style={{ fontSize: 'clamp(72px, 14vw, 160px)', letterSpacing: '-0.03em' }}
        >
          {displayHours}:{displayMinutes}
          {showSeconds && (
            <span style={{ fontSize: '0.45em' }} className="text-white/70 ml-2">
              :{displaySeconds}
            </span>
          )}
        </span>
        {!use24Hour && (
          <span className="text-white/60 font-semibold mb-4 ml-2" style={{ fontSize: 'clamp(18px, 2.5vw, 32px)' }}>
            {clock.ampm}
          </span>
        )}
      </div>
    </div>
  )
}