import { Readable } from "node:stream";
import { z } from "zod";
import { schema } from "../../infra/db/schemas";
import { db } from "../../infra/db";
import { type Either, makeLeft, makeRight } from "../../shared/either";
import { InvalidFileFormat } from "./errors/invalid-file-format";
import { uploadFileToStorage } from "../../infra/storage/upload-file-to-storage";

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
});

type UploadImageInput = z.input<typeof uploadImageInput>;

const allowedMimeType = ["image/jpg", "image/jpeg", "image/png", "image/webp"];


/**
 * Realiza o upload de uma imagem, validando os dados de entrada e armazenando a imagem no banco de dados.
 *
 * @async
 * @function uploadImage
 * @param {UploadImageInput} input - Dados necessários para o upload de uma imagem.
 * @returns {Promise<Either<InvalidFileFormat, { url: string }>>} 
 * Retorna um `Either`, onde `Left` representa um erro de formato inválido e `Right` representa a URL do arquivo enviado.
 *
 * @example
 * const result = await uploadImage({
 *   fileName: "image.png",
 *   contentType: "image/png",
 *   contentStream: someReadableStream
 * });
 * 
 * if (isLeft(result)) {
 *   console.error("Erro ao fazer upload:", result.left);
 * } else {
 *   console.log("Upload bem-sucedido:", result.right.url);
 * }
 */
export async function uploadImage(
  input: UploadImageInput
): Promise<Either<InvalidFileFormat, { url: string }>> {
  const { contentStream, contentType, fileName } =
    uploadImageInput.parse(input);

  if (!allowedMimeType.includes(contentType)) {
    return makeLeft(new InvalidFileFormat());
  }

  
  // Realiza o upload de uma imagem para o Cloudflare R2 e armazena as informações no banco de dados.  
  const { key, url } = await uploadFileToStorage({
    folder: 'images',
    fileName,
    contentType,
    contentStream,
  })

  // Salvar os metadados do upload no banco de dados
  await db.insert(schema.uploads).values({
    name: fileName,
    remoteKey: key,
    remoteUrl: url,
  });

  return makeRight({ url });
}
