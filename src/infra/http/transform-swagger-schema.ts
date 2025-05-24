import { jsonSchemaTransform } from "fastify-type-provider-zod";


/**
 * Tipo de dados esperado pela função `transformSwaggerSchema`, baseado nos parâmetros da função `jsonSchemaTransform`.
 * 
 * @typedef {Parameters<typeof jsonSchemaTransform>[0]} TransformSwaggerSchemaData
 */
type TransformSwaggerSchemaData = Parameters<typeof jsonSchemaTransform>[0];


/**
 * Transforma o esquema JSON para ser compatível com o Swagger.
 * 
 * Essa função ajusta o esquema do Swagger quando o conteúdo da requisição usa `multipart/form-data`, 
 * garantindo que o corpo (`body`) seja tratado corretamente como um objeto que contém um arquivo.
 * 
 * @param {TransformSwaggerSchemaData} data - Dados do esquema a serem transformados.
 * @returns {{ schema: object, url: string }} - Retorna o esquema transformado e a URL correspondente.
 */
export function transformSwaggerSchema(data: TransformSwaggerSchemaData) {
    const { schema, url } = jsonSchemaTransform(data);

    if (schema.consumes?.includes('multipart/form-data')) {
        if (schema.body === undefined) {
            schema.body = {
                type: 'object',
                required: [],
                properties: {},
            }
        }

        schema.body.properties.file = {
            type: 'string',
            format: 'binary',
        }

        schema.body.required.push('file')
    }

    return { schema, url }
}