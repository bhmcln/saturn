import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { type RegistryItem, registryItemSchema } from '@saturn/registry-schema'

export async function fetchRegistryItem(name: string, registryUrl: string): Promise<RegistryItem> {
  const base = registryUrl.endsWith('/') ? registryUrl : `${registryUrl}/`
  const url = new URL(`${name}.json`, base)

  let payload: unknown
  if (url.protocol === 'file:') {
    const content = await readFile(fileURLToPath(url), 'utf-8')
    payload = JSON.parse(content)
  } else {
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(`Failed to fetch ${url.toString()}: ${res.status} ${res.statusText}`)
    }
    payload = await res.json()
  }

  return registryItemSchema.parse(payload)
}

/**
 * Resolve a set of registry items into a topologically sorted list (deps first).
 * Items are fetched once and cached.
 */
export async function resolveRegistry(
  names: string[],
  registryUrl: string,
): Promise<RegistryItem[]> {
  const cache = new Map<string, RegistryItem>()
  const visited = new Set<string>()
  const ordered: RegistryItem[] = []

  async function visit(name: string): Promise<void> {
    if (visited.has(name)) return
    visited.add(name)
    if (!cache.has(name)) {
      cache.set(name, await fetchRegistryItem(name, registryUrl))
    }
    const item = cache.get(name)
    if (!item) return
    for (const dep of item.registryDependencies ?? []) {
      await visit(dep)
    }
    ordered.push(item)
  }

  for (const name of names) {
    await visit(name)
  }
  return ordered
}
