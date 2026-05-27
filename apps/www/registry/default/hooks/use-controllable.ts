import * as React from 'react'

export interface UseControllableStateOptions<T> {
  value?: T
  defaultValue?: T
  onChange?: (value: T) => void
}

type SetStateAction<T> = T | ((prev: T | undefined) => T)

/**
 * Drop-in replacement for useState that also supports a controlled `value`
 * prop. When `value` is provided the component is controlled; otherwise an
 * internal state seeded from `defaultValue` is used. Either way `onChange`
 * fires when the consumer requests a change.
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateOptions<T>): [T | undefined, (next: SetStateAction<T>) => void] {
  const [internal, setInternal] = React.useState<T | undefined>(defaultValue)
  const isControlled = value !== undefined
  const current = isControlled ? value : internal

  const onChangeRef = React.useRef(onChange)
  React.useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const set = React.useCallback(
    (next: SetStateAction<T>) => {
      const resolved =
        typeof next === 'function' ? (next as (p: T | undefined) => T)(current) : next
      if (!isControlled) setInternal(resolved)
      onChangeRef.current?.(resolved)
    },
    [current, isControlled],
  )

  return [current, set]
}
