import { access, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { z } from 'zod'

export const aliasesSchema = z.object({
  components: z.string().default('@/components'),
  ui: z.string().default('@/components/ui'),
  lib: z.string().default('@/lib'),
  hooks: z.string().default('@/hooks'),
  blocks: z.string().default('@/components/blocks'),
})
export type Aliases = z.infer<typeof aliasesSchema>

export const componentsConfigSchema = z.object({
  $schema: z.string().optional(),
  style: z.literal('default').default('default'),
  tsx: z.boolean().default(true),
  registry: z.string().default('https://saturn-ui.dev/r'),
  aliases: aliasesSchema.default({}),
})
export type ComponentsConfig = z.infer<typeof componentsConfigSchema>

const CONFIG_PATH = 'components.json'

export async function readConfig(cwd: string): Promise<ComponentsConfig | null> {
  const path = resolve(cwd, CONFIG_PATH)
  try {
    await access(path)
  } catch {
    return null
  }
  const raw = await readFile(path, 'utf-8')
  return componentsConfigSchema.parse(JSON.parse(raw))
}

export async function writeConfig(cwd: string, config: ComponentsConfig): Promise<void> {
  const path = resolve(cwd, CONFIG_PATH)
  const payload = {
    $schema: 'https://saturn-ui.dev/schema/components.json',
    ...config,
  }
  await writeFile(path, `${JSON.stringify(payload, null, 2)}\n`)
}

/**
 * Strip the leading alias (e.g. `@/`) from a path so it can be resolved on disk.
 * `@/components/ui` → `components/ui`.
 */
function stripAlias(alias: string): string {
  return alias.replace(/^@\//, '').replace(/^\//, '')
}

/**
 * Map a registry file path (e.g. `ui/week-view.tsx`, `lib/utils.ts`) onto a
 * concrete on-disk path under the consumer's project, using their aliases.
 */
export function resolveTargetPath(filePath: string, aliases: Aliases): string {
  const [topDir, ...rest] = filePath.split('/')
  if (!topDir || rest.length === 0) return filePath
  const aliasMap: Record<string, string | undefined> = {
    ui: aliases.ui,
    components: aliases.components,
    lib: aliases.lib,
    hooks: aliases.hooks,
    blocks: aliases.blocks,
  }
  const alias = aliasMap[topDir]
  if (!alias) return filePath
  return [stripAlias(alias), ...rest].join('/')
}
