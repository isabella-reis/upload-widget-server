import { Upload } from "@aws-sdk/lib-storage";
import { randomUUID } from "node:crypto";
import { basename, extname } from "node:path";
import { Readable } from "node:stream";
import { z } from "zod";
import { r2 } from "./client";
import { env } from "../../env";


/**
 * Esquema de validação para os parâmetros de upload de arquivos.
 *
 * @constant {z.ZodObject} uploadFileToStorageInput - Define a estrutura e valida os dados necessários para realizar o upload.
 * @property {"images" | "downloads"} folder - Diretório onde o arquivo será armazenado (pode ser "images" ou "downloads").
 * @property {string} fileName - Nome original do arquivo enviado.
 * @property {string} contentType - Tipo de conteúdo do arquivo (exemplo: "image/png", "application/pdf").
 * @property {Readable} contentStream - Stream de leitura do arquivo.
 */
const uploadFileToStorageInput = z.object({
    folder: z.enum(['images', 'downloads']),
    fileName: z.string(),
    contentType: z.string(),
    contentStream: z.instanceof(Readable),
})

type UploadFileToStorageInput = z.input<typeof uploadFileToStorageInput> 


/**
 * Faz o upload de um arquivo para o Cloudflare R2.
 *
 * O nome do arquivo é sanitizado para remover caracteres inválidos, e um identificador único é adicionado ao nome do arquivo
 * antes de ser armazenado no bucket definido nas variáveis de ambiente.
 *
 * @async
 * @function uploadFileToStorage
 * @param {UploadFileToStorageInput} input - Dados necessários para realizar o upload do arquivo.
 * @returns {Promise<{ key: string; url: string }>} - Retorna um objeto contendo a chave (key) única do arquivo e sua URL pública.
 *
 * @example
 * const fileStream = fs.createReadStream("image.png");
 * const result = await uploadFileToStorage({
 *   folder: "images",
 *   fileName: "my_image.png",
 *   contentType: "image/png",
 *   contentStream: fileStream,
 * });
 * console.log(result);
 * // { key: "images/123e4567-e89b-12d3-a456-426614174000-my_image.png", url: "https://your-public-url.com/images/123e4567-e89b-12d3-a456-426614174000-my_image.png" }
 */
export async function uploadFileToStorage(input: UploadFileToStorageInput) {
    const { folder, fileName, contentType, contentStream } = uploadFileToStorageInput.parse(input)

    const fileExtension = extname(fileName)
    const fileNameWithoutExtension = basename(fileName)
    const sanitizedFileName = fileNameWithoutExtension.replace(/[^a-zA-Z0-9^]/g, '')
    const sanitizedFileNameWithExtension = sanitizedFileName.concat(fileExtension)

    const uniqueFileName = `${folder}/${randomUUID()}-${sanitizedFileNameWithExtension}`


    // Configura e inicia o upload para o Cloudflare R2
    const upload = new Upload({
        client: r2,
        params: {
            Key: uniqueFileName,
            Bucket: env.CLOUDFLARE_BUCKET,
            Body: contentStream, 
            ContentType: contentType,
        },
    })

    await upload.done();

    return {
        key: uniqueFileName,
        url: new URL(uniqueFileName, env.CLOUDFLARE_PUBLIC_URL).toString(),
    }
}