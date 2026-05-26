import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { type RegistryIndex, registryItemSchema } from '@saturn/registry-schema'
import { registry } from '../registry'

const __dirname = dirname(fileURLToPath(import.meta.url))
const WWW_ROOT = join(__dirname, '..')
const REGISTRY_SRC = join(WWW_ROOT, 'registry/default')
const REGISTRY_OUT = join(WWW_ROOT, 'public/r')

async function build() {
  await mkdir(REGISTRY_OUT, { recursive: true })

  const index: RegistryIndex = []

  for (const item of registry) {
    const files = await Promise.all(
      item.files.map(async (file) => ({
        path: file.path,
        type: file.type,
        content: await readFile(join(REGISTRY_SRC, file.path), 'utf-8'),
      })),
    )

    const built = registryItemSchema.parse({
      $schema: 'https://saturn-ui.dev/schema/registry-item.json',
      name: item.name,
      type: item.type,
      ...(item.description !== undefined && { description: item.description }),
      ...(item.dependencies !== undefined && { dependencies: item.dependencies }),
      ...(item.devDependencies !== undefined && { devDependencies: item.devDependencies }),
      ...(item.registryDependencies !== undefined && {
        registryDependencies: item.registryDependencies,
      }),
      files,
    })

    await writeFile(join(REGISTRY_OUT, `${item.name}.json`), `${JSON.stringify(built, null, 2)}\n`)

    index.push({
      name: item.name,
      type: item.type,
      ...(item.description !== undefined && { description: item.description }),
    })
  }

  await writeFile(join(REGISTRY_OUT, 'index.json'), `${JSON.stringify(index, null, 2)}\n`)

  console.log(`✓ Built ${registry.length} registry items → public/r/`)
}

build().catch((err) => {
  console.error(err)
  process.exit(1)
})
