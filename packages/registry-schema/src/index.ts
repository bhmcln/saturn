import { z } from 'zod'

export const registryItemTypeSchema = z.enum([
  'registry:lib',
  'registry:hook',
  'registry:ui',
  'registry:component',
  'registry:example',
  'registry:block',
])
export type RegistryItemType = z.infer<typeof registryItemTypeSchema>

export const registryItemFileSchema = z.object({
  path: z.string(),
  content: z.string().optional(),
  type: registryItemTypeSchema,
  target: z.string().optional(),
})
export type RegistryItemFile = z.infer<typeof registryItemFileSchema>

export const registryItemSchema = z.object({
  $schema: z.string().optional(),
  name: z.string(),
  type: registryItemTypeSchema,
  description: z.string().optional(),
  dependencies: z.array(z.string()).optional(),
  devDependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  files: z.array(registryItemFileSchema),
  tailwind: z
    .object({
      config: z
        .object({
          plugins: z.array(z.string()).optional(),
          theme: z.record(z.unknown()).optional(),
        })
        .optional(),
    })
    .optional(),
  cssVars: z.record(z.record(z.string())).optional(),
  meta: z.record(z.unknown()).optional(),
})
export type RegistryItem = z.infer<typeof registryItemSchema>

export const registryIndexSchema = z.array(
  z.object({
    name: z.string(),
    type: registryItemTypeSchema,
    description: z.string().optional(),
  }),
)
export type RegistryIndex = z.infer<typeof registryIndexSchema>
