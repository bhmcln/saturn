import { Command } from 'commander'
import { addCommand } from './commands/add'
import { initCommand } from './commands/init'
import { log } from './utils/output'

const program = new Command()

program
  .name('saturn')
  .description('Add Saturn time-based UI components to your project')
  .version('0.0.0')

program
  .command('init')
  .description('Initialize Saturn in the current project (writes components.json)')
  .option('-y, --yes', 'Skip prompts and use defaults')
  .option('-r, --registry <url>', 'Override the registry URL')
  .option('-c, --cwd <path>', 'Working directory', process.cwd())
  .action(async (opts) => {
    try {
      await initCommand({ cwd: opts.cwd, yes: opts.yes, registry: opts.registry })
    } catch (err) {
      log.error(err instanceof Error ? err.message : String(err))
      process.exit(1)
    }
  })

program
  .command('add')
  .description('Add one or more components to your project')
  .argument('<components...>', 'Component names (e.g. week-view event-card)')
  .option('-r, --registry <url>', 'Override the registry URL')
  .option('-o, --overwrite', 'Overwrite existing files without prompting')
  .option('-c, --cwd <path>', 'Working directory', process.cwd())
  .action(async (names: string[], opts) => {
    try {
      await addCommand(names, {
        cwd: opts.cwd,
        registry: opts.registry,
        overwrite: opts.overwrite,
      })
    } catch (err) {
      log.error(err instanceof Error ? err.message : String(err))
      process.exit(1)
    }
  })

program.parseAsync()
