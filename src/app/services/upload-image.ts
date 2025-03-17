import { Readable } from "node:stream";
import { z } from "zod";
import { schema } from "../../infra/db/schemas";
import { db } from "../../infra/db";

/**
 * Validação para o input de upload de imagem.
 * 
 * Utiliza o Zod para validar os campos necessários para o upload de uma imagem.
 * 
 * @constant {z.ZodObject} uploadImageInput - Objeto que define a estrutura de validação para o upload de imagem.
 * @property {string} fileName - Nome do arquivo a ser enviado. Deve ser uma string.
 * @property {string} contentType - Tipo de conteúdo do arquivo, como "image/jpeg" ou "image/png". Deve ser uma string.
 * @property {Readable} contentStream - Stream de leitura do arquivo, proveniente do conteúdo enviado. Deve ser uma instância da classe `Readable`.
 * 
 * @example
 * const input = {
 *   fileName: "image.jpg",
 *   contentType: "image/jpeg",
 *   contentStream: someReadableStream
 * };
 * uploadImageInput.parse(input); // Valida o input
 */

const uploadImageInput = z.object({
    fileName: z.string(),
    contentType: z.string(),
    contentStream: z.instanceof(Readable),
})

type UploadImageInput = z.input<typeof uploadImageInput>;

const allowedMimeType = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp']

export async function uploadImage(input: UploadImageInput) {
    const { contentStream, contentType, fileName } = uploadImageInput.parse(input);

    if (!allowedMimeType.includes(contentType)) {
        throw new Error('Invalid file format.')
    }

    // TODO: Carregar a imagem para o Cloudflare R2

    await db.insert(schema.uploads).values({
        name: fileName,
        remoteKey: fileName,
        remoteUrl: fileName,
    })

}