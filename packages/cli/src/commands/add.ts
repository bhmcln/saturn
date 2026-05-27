import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import pc from 'picocolors'
import { readConfig, resolveTargetPath } from '../utils/config'
import { log } from '../utils/output'
import { resolveRegistry } from '../utils/registry'

export interface AddOptions {
  cwd: string
  registry?: string
  overwrite?: boolean
}

export async function addCommand(names: string[], opts: AddOptions): Promise<void> {
  const config = await readConfig(opts.cwd)
  if (!config) {
    log.error('No components.json found. Run `saturn init` first.')
    process.exit(1)
  }

  const registryUrl = opts.registry ?? config.registry
  log.info(`Resolving ${names.join(', ')} from ${registryUrl}…`)

  const items = await resolveRegistry(names, registryUrl)
  log.success(`Resolved ${items.length} item${items.length === 1 ? '' : 's'}`)

  const npmDeps = new Set<string>()
  const npmDevDeps = new Set<string>()
  const written: string[] = []

  for (const item of items) {
    for (const dep of item.dependencies ?? []) npmDeps.add(dep)
    for (const dep of item.devDependencies ?? []) npmDevDeps.add(dep)

    for (const file of item.files) {
      if (file.content === undefined) {
        log.warn(`Skipping ${file.path}: no content in registry payload`)
        continue
      }
      const target = file.target ?? resolveTargetPath(file.path, config.aliases)
      const absolute = resolve(opts.cwd, target)
      await mkdir(dirname(absolute), { recursive: true })
      await writeFile(absolute, file.content)
      written.push(target)
    }
  }

  for (const path of written) {
    log.step(`${pc.green('+')} ${path}`)
  }

  if (npmDeps.size > 0 || npmDevDeps.size > 0) {
    console.log()
    log.info('Install required dependencies:')
    if (npmDeps.size > 0) {
      log.step(`pnpm add ${[...npmDeps].join(' ')}`)
    }
    if (npmDevDeps.size > 0) {
      log.step(`pnpm add -D ${[...npmDevDeps].join(' ')}`)
    }
  }
}
