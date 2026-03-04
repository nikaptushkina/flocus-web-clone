import { useState } from 'react'

function mergeDefaults<T>(stored: T, defaults: T): T {
  if (
    defaults !== null &&
    typeof defaults === 'object' &&
    !Array.isArray(defaults) &&
    stored !== null &&
    typeof stored === 'object' &&
    !Array.isArray(stored)
  ) {
    const result = { ...defaults } as Record<string, unknown>
    for (const key of Object.keys(defaults as Record<string, unknown>)) {
      const storedObj = stored as Record<string, unknown>
      if (key in storedObj) {
        result[key] = mergeDefaults(
          storedObj[key] as T[keyof T],
          (defaults as Record<string, unknown>)[key] as T[keyof T]
        )
      }
    }
    // Keep extra keys from stored that aren't in defaults
    for (const key of Object.keys(stored as Record<string, unknown>)) {
      if (!(key in result)) {
        result[key] = (stored as Record<string, unknown>)[key]
      }
    }
    return result as T
  }
  return stored
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (!item) return initialValue
      const parsed = JSON.parse(item) as T
      return mergeDefaults(parsed, initialValue)
    } catch {
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue] as const
}
