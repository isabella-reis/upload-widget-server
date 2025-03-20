import { Readable } from 'node:stream'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { uploadImage } from './upload-image'
import { isLeft, isRight, unwrapEither } from '../../shared/either'
import { randomUUID } from 'node:crypto'
import { schema } from '@/infra/db/schemas'
import { eq } from 'drizzle-orm'
import { db } from '@/infra/db'
import { InvalidFileFormat } from './errors/invalid-file-format'

describe('upload image', () => {
  beforeAll(() => {
    vi.mock('@/infra/storage/upload-file-to-storage', () => {
      return {
        uploadFileToStorage: vi.fn().mockImplementation(() => {
          return {
            key: `${randomUUID()}.jpg`,
            url: 'https://storage.com/image.jpg',
          }
        }),
      }
    })
  })

  it('should be able to upload an image', async () => {
    const fileName = `${randomUUID()}.jpg`

    // system under test === sut
    const sut = await uploadImage({
      fileName,
      contentType: 'image/jpg',
      contentStream: Readable.from([]),
    })

    expect(isRight(sut)).toBe(true)

    const result = await db
      .select()
      .from(schema.uploads)
      .where(eq(schema.uploads.name, fileName))

    expect(result).toHaveLength(1)
  })

  it('should not be able to upload something that`s not an image', async () => {
    const fileName = `${randomUUID()}.pdf`

    // system under test === sut
    const sut = await uploadImage({
      fileName,
      contentType: 'image/pdf',
      contentStream: Readable.from([]),
    })

    expect(isLeft(sut)).toBe(true)
    expect(unwrapEither(sut)).toBeInstanceOf(InvalidFileFormat)
  })
})
