import { z } from 'zod'

/**
 * Esquema de validação para as variáveis de ambiente.
 * 
 * @constant {z.ZodObject} envSchema - Objeto que define e valida as variáveis de ambiente.
 * 
 * @property {number} PORT - Porta na qual o servidor será executado (padrão: 3333).
 * @property {'development' | 'test' | 'production'} NODE_ENV - Ambiente da aplicação (padrão: 'production').
 * @property {string} DATABASE_URL - URL de conexão com o banco de dados (deve começar com 'postgresql://').
 * @property {string} CLOUDFLARE_ACCOUNT_ID - ID da conta do Cloudflare, utilizado para conexão com o R2.
 * @property {string} CLOUDFLARE_ACCESS_KEY_ID - Chave de acesso ao Cloudflare R2.
 * @property {string} CLOUDFLARE_SECRET_ACCESS_KEY_ID - Chave secreta de acesso ao Cloudflare R2.
 * @property {string} CLOUDFLARE_BUCKET - Nome do bucket utilizado no Cloudflare R2.
 * @property {string} CLOUDFLARE_PUBLIC_URL - URL pública para acessar os arquivos armazenados no bucket.
 * 
 */

const envSchema = z.object({ 
    PORT: z.coerce.number().default(3333),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
    DATABASE_URL: z.string().url().startsWith('postgresql://'),
    CLOUDFLARE_ACCOUNT_ID: z.string(),
    CLOUDFLARE_ACCESS_KEY_ID: z.string(),
    CLOUDFLARE_SECRET_ACCESS_KEY_ID: z.string(),
    CLOUDFLARE_BUCKET: z.string(),
    CLOUDFLARE_PUBLIC_URL: z.string().url(),
})

export const env = envSchema.parse(process.env)