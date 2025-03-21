import { Readable } from 'node:stream'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { uploadImage } from './upload-image'
import { isLeft, isRight, unwrapEither } from '../../shared/either'
import { randomUUID } from 'node:crypto'
import { schema } from '@/infra/db/schemas'
import { eq } from 'drizzle-orm'
import { db } from '@/infra/db'
import { getUploads } from './get-uploads'
import { makeUpload } from '@/test/factories/make-upload'

describe('get uploads', () => {
  it('should be able to get the uploads', async () => {
    const namePattern = `make-upload-test-${randomUUID()}`

    const upload1 = await makeUpload({ name: `${namePattern}.webp` })
    const upload2 = await makeUpload({ name: `${namePattern}.webp` })
    const upload3 = await makeUpload({ name: `${namePattern}.webp` })
    const upload4 = await makeUpload({ name: `${namePattern}.webp` })
    const upload5 = await makeUpload({ name: `${namePattern}.webp` })

    // system under test === sut
    const sut = await getUploads({
      searchQuery: namePattern,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toEqual(5)
    expect(unwrapEither(sut).uploads).toEqual([
      expect.objectContaining({ id: upload5.id }),
      expect.objectContaining({ id: upload4.id }),
      expect.objectContaining({ id: upload3.id }),
      expect.objectContaining({ id: upload2.id }),
      expect.objectContaining({ id: upload1.id }),
    ])
  })

  it('should be able to get paginated uploads', async () => {
    const namePattern = `make-upload-test-${randomUUID()}`

    const upload1 = await makeUpload({ name: `${namePattern}.webp` })
    const upload2 = await makeUpload({ name: `${namePattern}.webp` })
    const upload3 = await makeUpload({ name: `${namePattern}.webp` })
    const upload4 = await makeUpload({ name: `${namePattern}.webp` })
    const upload5 = await makeUpload({ name: `${namePattern}.webp` })

    // system under test === sut
    let sut = await getUploads({
      searchQuery: namePattern,
      page: 1,
      pageSize: 3,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toEqual(5)
    expect(unwrapEither(sut).uploads).toEqual([
      expect.objectContaining({ id: upload5.id }),
      expect.objectContaining({ id: upload4.id }),
      expect.objectContaining({ id: upload3.id }),
    ])

    sut = await getUploads({
      searchQuery: namePattern,
      page: 2,
      pageSize: 3,
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toEqual(5)
    expect(unwrapEither(sut).uploads).toEqual([
      expect.objectContaining({ id: upload2.id }),
      expect.objectContaining({ id: upload1.id }),
    ])
  })

  it('should be able to get sorted uploads', async () => {
    const namePattern = `make-upload-test-${randomUUID()}`

    const today = new Date()

    const upload1 = await makeUpload({
      name: `${namePattern}.webp`,
      createdAt: new Date(today),
    })
    const upload2 = await makeUpload({
      name: `${namePattern}.webp`,
      createdAt: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000),
    }) // Ontem
    const upload3 = await makeUpload({
      name: `${namePattern}.webp`,
      createdAt: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000),
    }) // Anteontem
    const upload4 = await makeUpload({
      name: `${namePattern}.webp`,
      createdAt: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000),
    }) // 3 dias atrás
    const upload5 = await makeUpload({
      name: `${namePattern}.webp`,
      createdAt: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000),
    }) // 4 dias atrás

    let sut = await getUploads({
      searchQuery: namePattern,
      sortBy: 'createdAt',
      sortDirection: 'desc',
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toEqual(5)
    expect(unwrapEither(sut).uploads).toEqual([
      expect.objectContaining({ id: upload1.id }),
      expect.objectContaining({ id: upload2.id }),
      expect.objectContaining({ id: upload3.id }),
      expect.objectContaining({ id: upload4.id }),
      expect.objectContaining({ id: upload5.id }),
    ])

    sut = await getUploads({
      searchQuery: namePattern,
      sortBy: 'createdAt',
      sortDirection: 'asc',
    })

    expect(isRight(sut)).toBe(true)
    expect(unwrapEither(sut).total).toEqual(5)
    expect(unwrapEither(sut).uploads).toEqual([
      expect.objectContaining({ id: upload5.id }),
      expect.objectContaining({ id: upload4.id }),
      expect.objectContaining({ id: upload3.id }),
      expect.objectContaining({ id: upload2.id }),
      expect.objectContaining({ id: upload1.id }),
    ])
  })
})
