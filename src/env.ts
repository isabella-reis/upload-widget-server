import { z } from 'zod'

/**
 * Esquema de validação para as variáveis de ambiente.
 * 
 * @constant {z.ZodObject} envSchema - Define e valida as variáveis de ambiente da aplicação.
 * @property {number} PORT - Porta do servidor (padrão: 3333).
 * @property {'development' | 'test' | 'production'} NODE_ENV - Define o ambiente da aplicação (padrão: 'production').
 * @property {string} DATABASE_URL - URL de conexão com o banco de dados (deve começar com 'postgresql://').
 */


const envSchema = z.object({ 
    PORT: z.coerce.number().default(3333),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
    DATABASE_URL: z.string().url().startsWith('postgresql://'),
})

export const env = envSchema.parse(process.env)