import { S3Client } from '@aws-sdk/client-s3'
import { env } from '../../env'

/**
 * Cliente S3 para integração com o Cloudflare R2.
 * 
 * Esse cliente é configurado para se conectar ao armazenamento R2 do Cloudflare, utilizando as credenciais 
 * definidas nas variáveis de ambiente.
 * 
 * @constant {S3Client} r2 - Instância do cliente S3 configurado para o Cloudflare R2.
 * 
 * @property {string} region - Região configurada como 'auto' para o Cloudflare R2.
 * @property {string} endpoint - URL do endpoint do Cloudflare R2, baseada no `CLOUDFLARE_ACCOUNT_ID`.
 * @property {Object} credentials - Credenciais para autenticação no Cloudflare R2.
 * @property {string} credentials.accessKeyId - Chave de acesso (`CLOUDFLARE_ACCESS_KEY_ID`).
 * @property {string} credentials.secretAccessKey - Chave secreta (`CLOUDFLARE_SECRET_ACCESS_KEY_ID`).
 * 
 * @requires @aws-sdk/client-s3 - SDK da AWS para manipulação de buckets S3.
 * @requires ../../env - Módulo que carrega as variáveis de ambiente.
 * 
 * @example
 * import { r2 } from './r2';
 * import { ListObjectsCommand } from '@aws-sdk/client-s3';
 * 
 * async function listObjects() {
 *   const response = await r2.send(new ListObjectsCommand({ Bucket: 'meu-bucket' }));
 *   console.log(response);
 * }
 */

export const r2 = new S3Client ({ 
    region: 'auto',
    endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: env.CLOUDFLARE_ACCESS_KEY_ID,
        secretAccessKey: env.CLOUDFLARE_SECRET_ACCESS_KEY_ID,
    },
})