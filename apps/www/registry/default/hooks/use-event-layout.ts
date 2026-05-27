import * as React from 'react'

export interface LayoutEvent {
  id: string
  start: Date
  end: Date
}

export interface EventLayout<E extends LayoutEvent> {
  event: E
  /** 0-indexed column within the event's overlap cluster. */
  column: number
  /** Total number of columns in the cluster. */
  columnCount: number
  /** Width as a percentage of the day-column. */
  widthPct: number
  /** Left offset as a percentage of the day-column. */
  leftPct: number
}

/**
 * Column-pack overlapping events the way Google Calendar does: events that
 * temporally overlap each other share a horizontal "cluster" and are split
 * into the minimum number of columns such that no two events in the same
 * column overlap. Returns layout info for each event so views can position
 * them with `left: leftPct%` and `width: widthPct%`.
 */
export function useEventLayout<E extends LayoutEvent>(events: E[]): EventLayout<E>[] {
  return React.useMemo(() => layoutEvents(events), [events])
}

export function layoutEvents<E extends LayoutEvent>(events: E[]): EventLayout<E>[] {
  if (events.length === 0) return []

  const sorted = [...events].sort((a, b) => a.start.getTime() - b.start.getTime())

  const clusters: E[][] = []
  let current: E[] = []
  let clusterEnd = -Infinity

  for (const evt of sorted) {
    if (current.length === 0 || evt.start.getTime() < clusterEnd) {
      current.push(evt)
      clusterEnd = Math.max(clusterEnd, evt.end.getTime())
    } else {
      clusters.push(current)
      current = [evt]
      clusterEnd = evt.end.getTime()
    }
  }
  if (current.length > 0) clusters.push(current)

  const results: EventLayout<E>[] = []
  for (const cluster of clusters) {
    const columns: E[][] = []
    const assignments = new Map<string, number>()

    for (const evt of cluster) {
      let placed = false
      for (let i = 0; i < columns.length; i++) {
        const col = columns[i]
        if (!col) continue
        const last = col[col.length - 1]
        if (last && last.end.getTime() <= evt.start.getTime()) {
          col.push(evt)
          assignments.set(evt.id, i)
          placed = true
          break
        }
      }
      if (!placed) {
        columns.push([evt])
        assignments.set(evt.id, columns.length - 1)
      }
    }

    const columnCount = columns.length
    for (const evt of cluster) {
      const column = assignments.get(evt.id) ?? 0
      results.push({
        event: evt,
        column,
        columnCount,
        widthPct: 100 / columnCount,
        leftPct: (column / columnCount) * 100,
      })
    }
  }
  return results
}
