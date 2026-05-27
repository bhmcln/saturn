import prompts from 'prompts'
import { componentsConfigSchema, readConfig, writeConfig } from '../utils/config'
import { log } from '../utils/output'

export interface InitOptions {
  cwd: string
  yes?: boolean
  registry?: string
}

export async function initCommand(opts: InitOptions): Promise<void> {
  const existing = await readConfig(opts.cwd)
  if (existing && !opts.yes) {
    const { overwrite } = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: 'components.json already exists. Overwrite?',
      initial: false,
    })
    if (!overwrite) {
      log.info('Aborted.')
      return
    }
  }

  const answers: Partial<{
    components: string
    ui: string
    lib: string
    hooks: string
  }> = opts.yes
    ? {}
    : await prompts([
        {
          type: 'text',
          name: 'components',
          message: 'Components directory alias?',
          initial: '@/components',
        },
        {
          type: 'text',
          name: 'ui',
          message: 'UI components alias?',
          initial: '@/components/ui',
        },
        {
          type: 'text',
          name: 'lib',
          message: 'Lib alias?',
          initial: '@/lib',
        },
        {
          type: 'text',
          name: 'hooks',
          message: 'Hooks alias?',
          initial: '@/hooks',
        },
      ])

  const config = componentsConfigSchema.parse({
    style: 'default',
    tsx: true,
    registry: opts.registry ?? 'https://saturn-ui.dev/r',
    aliases: {
      components: answers.components ?? '@/components',
      ui: answers.ui ?? '@/components/ui',
      lib: answers.lib ?? '@/lib',
      hooks: answers.hooks ?? '@/hooks',
    },
  })

  await writeConfig(opts.cwd, config)
  log.success('Wrote components.json')
  log.step(`Registry: ${config.registry}`)
  log.info('Next: `saturn add <component>` (e.g. `saturn add week-view`)')
}
