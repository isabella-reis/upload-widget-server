import { uuidv7 } from "uuidv7"
import { pgTable, text, timestamp } from "drizzle-orm/pg-core"


/**
 * Definição da tabela "uploads" no banco de dados.
 * 
 * @constant {import("drizzle-orm/pg-core").PgTable} uploads - Estrutura da tabela de uploads.
 * @property {string} id - Identificador único do upload, gerado automaticamente como UUID v7.
 * @property {string} name - Nome do arquivo enviado (não pode ser nulo).
 * @property {string} remoteKey - Chave única que referencia o arquivo no armazenamento remoto.
 * @property {string} remoteURL - URL do arquivo no armazenamento remoto.
 * @property {Date} createdAt - Data e hora em que o upload foi criado, preenchido automaticamente.
 */

export const uploads = pgTable("uploads", {
    id: text('id').primaryKey().$defaultFn(() => uuidv7()),
    name: text('name').notNull(),
    remoteKey: text('remote_key').notNull().unique(),
    remoteUrl: text('remote_url').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
