import { env } from "../../env" 
import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import { schema } from "./schemas"


/**
 * Conexão com o banco de dados PostgreSQL e configuração do ORM Drizzle.
 * 
 * @constant {import("postgres").Sql} pg - Instância de conexão com o banco de dados PostgreSQL, configurada com a URL do banco de dados definida nas variáveis de ambiente.
 * @constant {import("drizzle-orm/postgres-js").Drizzle} db - Instância do Drizzle ORM configurada com a conexão `pg` e o esquema definido.
 * 
 * @example
 * const result = await db.uploads.findFirst(); // Exemplo de uso do ORM com o banco de dados
 */


export const pg = postgres(env.DATABASE_URL)
export const db = drizzle(pg, { schema })