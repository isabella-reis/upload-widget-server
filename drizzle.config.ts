import { env } from "./src/env";
import type { Config } from "drizzle-kit";

/**
 * Configuração do Drizzle Kit para gerenciamento do banco de dados.
 * 
 * @constant {Config} drizzleConfig - Objeto de configuração utilizado pelo Drizzle Kit.
 * @property {Object} drizzleConfig.dbCredentials - Credenciais do banco de dados.
 * @property {string} drizzleConfig.dbCredentials.url - URL de conexão com o banco de dados, obtida das variáveis de ambiente.
 * @property {"postgresql"} drizzleConfig.dialect - Dialeto do banco de dados utilizado.
 * @property {string} drizzleConfig.schema - Caminho dos arquivos de esquema do banco de dados.
 * @property {string} drizzleConfig.out - Diretório onde as migrações do banco serão geradas.
 */

export default {
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  dialect: "postgresql",
  schema: "src/infra/db/schemas/*",
  out: "src/infra/db/migrations",
} satisfies Config;
