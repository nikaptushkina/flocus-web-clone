import { useState, useEffect } from 'react'

export interface ClockData {
  hours: number
  minutes: number
  seconds: number
  ampm: 'AM' | 'PM'
  hours12: number
  greeting: string
  dateString: string
}

function getGreeting(hours: number, name: string): string {
  if (hours < 5) return `Good night${name ? `, ${name}` : ''} 🌙`
  if (hours < 12) return `Good morning${name ? `, ${name}` : ''} ☀️`
  if (hours < 17) return `Good afternoon${name ? `, ${name}` : ''} 👋`
  if (hours < 21) return `Good evening${name ? `, ${name}` : ''} 🌇`
  return `Good night${name ? `, ${name}` : ''} 🌙`
}

function getDateString(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export function useClock(userName = ''): ClockData {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const hours = now.getHours()
  const minutes = now.getMinutes()
  const seconds = now.getSeconds()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const hours12 = hours % 12 || 12

  return {
    hours,
    minutes,
    seconds,
    ampm,
    hours12,
    greeting: getGreeting(hours, userName),
    dateString: getDateString(now),
  }
}
