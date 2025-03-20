import { z } from 'zod'
import { type Either, makeRight } from '../../shared/either'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { asc, count, desc, ilike } from 'drizzle-orm'

/**
 * Obtém uma lista paginada de uploads armazenados no banco de dados,
 * com suporte a pesquisa e ordenação.
 *
 * @async
 * @function getUploads
 * @param {Object} input - Parâmetros para buscar uploads.
 * @param {string} [input.searchQuery] - Termo opcional para busca pelo nome do arquivo.
 * @param {'createdAt'} [input.sortBy] - Campo para ordenação (atualmente apenas `createdAt`).
 * @param {'asc' | 'desc'} [input.sortDirection] - Direção da ordenação (`asc` para crescente, `desc` para decrescente).
 * @param {number} [input.page=1] - Página atual para paginação (padrão: 1).
 * @param {number} [input.pageSize=20] - Número de itens por página (padrão: 20).
 * @returns {Promise<Either<never, GetUploadsOutput>>} - Retorna um objeto contendo os uploads filtrados e o total de registros.
 *
 * @example
 * const result = await getUploads({ searchQuery: "logo", sortBy: "createdAt", sortDirection: "desc", page: 1, pageSize: 10 });
 * console.log(result);
 * // {
 * //   right: {
 * //     uploads: [
 * //       { id: "1", name: "logo.png", remoteKey: "...", remoteUrl: "...", createdAt: "2024-03-17T12:00:00Z" }
 * //     ],
 * //     total: 5
 * //   }
 * // }
 */

const getUploadsInput = z.object({
  searchQuery: z.string().optional(),
  sortBy: z.enum(['createdAt']).optional(),
  sortDirection: z.enum(['asc', 'desc']).optional(),
  page: z.number().optional().default(1),
  pageSize: z.number().optional().default(20),
})

type UploadImageInput = z.input<typeof getUploadsInput>

type GetUploadsOutput = {
  uploads: {
    id: string
    name: string
    remoteKey: string
    remoteUrl: string
    createdAt: Date
  }[]
  total: number
}

export async function getUploads(
  input: UploadImageInput
): Promise<Either<never, GetUploadsOutput>> {
  const { searchQuery, sortBy, sortDirection, page, pageSize } =
    getUploadsInput.parse(input)

  // Busca os uploads no banco de dados com filtros opcionais de pesquisa e ordenação.
  const [uploads, [{ total }]] = await Promise.all([
    db
      .select({
        id: schema.uploads.id,
        name: schema.uploads.name,
        remoteKey: schema.uploads.remoteKey,
        remoteUrl: schema.uploads.remoteUrl,
        createdAt: schema.uploads.createdAt,
      })
      .from(schema.uploads)
      .where(
        searchQuery ? ilike(schema.uploads.name, `%${searchQuery}%`) : undefined
      )
      .orderBy(fields => {
        if (sortBy && sortDirection === 'asc') {
          return asc(fields[sortBy])
        }

        if (sortBy && sortDirection === 'desc') {
          return desc(fields[sortBy])
        }

        return desc(fields.id)
      })
      .offset((page - 1) * pageSize)
      .limit(pageSize),

    // Conta o total de uploads no banco de dados para a pesquisa atual.
    db
      .select({ total: count(schema.uploads.id) })
      .from(schema.uploads)
      .where(
        searchQuery ? ilike(schema.uploads.name, `%${searchQuery}%`) : undefined
      ),
  ])

  return makeRight({ uploads, total })
}
