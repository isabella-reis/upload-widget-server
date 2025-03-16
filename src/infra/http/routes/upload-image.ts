import { FastifyPluginAsync } from "fastify";

export const uploadImageRoute: FastifyPluginAsync = async server => {
    server.post('/uploads', () => {
        return 'Olá Mundo'
    })
}