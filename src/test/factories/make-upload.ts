import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import type { InferInsertModel } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'

export async function makeUpload(
  overrides?: Partial<InferInsertModel<typeof schema.uploads>>
) {
  const fileName = `file-test-${randomUUID()}`

  const result = await db
    .insert(schema.uploads)
    .values({
      name: fileName,
      remoteKey: `images/${fileName}`,
      remoteUrl: `https://teste.com/images/${fileName}`,
      ...overrides,
    })
    .returning()

  return result[0]
}
