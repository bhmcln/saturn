import * as React from 'react'

/**
 * Returns a Date that updates every `intervalMs` ms (default 60s). Used by
 * the now-indicator to keep the current-time line fresh without forcing
 * consumers to manage their own timers.
 */
export function useNow(intervalMs = 60_000): Date {
  const [now, setNow] = React.useState(() => new Date())
  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}
