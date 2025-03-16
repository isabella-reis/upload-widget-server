import { uploads } from "./uploads";


/**
 * Definição do esquema do banco de dados, incluindo as tabelas a serem usadas no ORM Drizzle.
 * 
 * @constant {Object} schema - Objeto que contém as definições das tabelas do banco de dados.
 * @property {import("./uploads").PgTable} uploads - Tabela de uploads definida no arquivo "uploads".
 */

export const schema = {
    uploads
}