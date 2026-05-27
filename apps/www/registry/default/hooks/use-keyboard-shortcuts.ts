import * as React from 'react'

export type ShortcutHandler = (event: KeyboardEvent) => void

/**
 * Map of key combos to handlers. Keys take the form:
 *
 *   "ArrowLeft"          // just the key
 *   "Shift+ArrowLeft"    // with modifiers (Meta, Ctrl, Alt, Shift — in that order)
 *   "Meta+k"             // ⌘k / Ctrl+k
 *
 * If both a combo and a plain key match an event, the combo wins.
 */
export type ShortcutMap = Record<string, ShortcutHandler>

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  if (target.isContentEditable) return true
  const tag = target.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'
}

function comboFromEvent(event: KeyboardEvent): string {
  const parts: string[] = []
  if (event.metaKey) parts.push('Meta')
  if (event.ctrlKey) parts.push('Ctrl')
  if (event.altKey) parts.push('Alt')
  if (event.shiftKey) parts.push('Shift')
  parts.push(event.key)
  return parts.join('+')
}

export interface UseKeyboardShortcutsOptions {
  enabled?: boolean
  /** By default, shortcuts are ignored when focus is in an input / textarea / contenteditable. */
  fireInEditableFields?: boolean
}

export function useKeyboardShortcuts(
  shortcuts: ShortcutMap,
  { enabled = true, fireInEditableFields = false }: UseKeyboardShortcutsOptions = {},
): void {
  const handlersRef = React.useRef(shortcuts)
  handlersRef.current = shortcuts

  React.useEffect(() => {
    if (!enabled) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (!fireInEditableFields && isEditableTarget(event.target)) return
      const map = handlersRef.current
      const combo = comboFromEvent(event)
      const handler = map[combo] ?? map[event.key]
      if (handler) {
        event.preventDefault()
        handler(event)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [enabled, fireInEditableFields])
}
