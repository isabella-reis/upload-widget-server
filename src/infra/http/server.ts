import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { env } from "../../env";
import { serializerCompiler, validatorCompiler, hasZodFastifySchemaValidationErrors } from "fastify-type-provider-zod";
import { uploadImageRoute } from "./routes/upload-image";

const server = fastify();

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

/**
 * Manipulador global de erros do servidor.
 * 
 * @param {Error} error - O erro capturado durante a execução.
 * @param {import('fastify').FastifyRequest} request - O objeto da requisição.
 * @param {import('fastify').FastifyReply} reply - O objeto de resposta do Fastify.
 * @returns {import('fastify').FastifyReply} A resposta HTTP correspondente ao erro.
 */

server.setErrorHandler((error, request, reply) => {
    if (hasZodFastifySchemaValidationErrors(error)) {
        return reply.status(400).send({
            message: 'Validation error.',
            issues: error.validation,
        })
    }

    console.log(error) // Substituiríamos por um logger que enviaria o erro para o Datadog (ex.:)

    return reply.status(500).send({message: 'Internal server error.'})
})

server.register(uploadImageRoute)

server.register(fastifyCors, {origin: '*'});

console.log(env.DATABASE_URL)

server.listen({port: 3333, host: '0.0.0.0'}).then(() => {
    console.log('HTTP server running')
})