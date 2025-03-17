import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { uploadImage } from "../../../app/services/upload-image";


/**
 * Rota para upload de imagens.
 * 
 * Essa rota permite que usuários enviem imagens utilizando `multipart/form-data`. 
 * O arquivo é validado quanto ao tamanho e sua presença na requisição.
 * 
 * @constant {FastifyPluginAsync} uploadImageRoute - Plugin do Fastify que registra a rota de upload de imagens.
 * 
 * @param {import("fastify").FastifyInstance} server - Instância do servidor Fastify.
 * @returns {Promise<void>} - Retorna uma Promise que resolve quando a rota é registrada.
 */
export const uploadImageRoute: FastifyPluginAsync = async (server) => {
  server.post(
    "/uploads",
    {
      schema: {
        summary: "Upload an image",
        consumes: ["multipart/form-data"],
        response: {
          201: z.object({ uploadId: z.string() }),
          400: z
            .object({ message: z.string() }),
        },
      },
    },

    
    /**
     * Manipulador da requisição de upload.
     * 
     * @param {import("fastify").FastifyRequest} request - Objeto da requisição.
     * @param {import("fastify").FastifyReply} reply - Objeto de resposta do Fastify.
     * @returns {Promise<import("fastify").FastifyReply>} - Retorna a resposta HTTP apropriada.
     */
    async (request, reply) => {
      const uploadedFile = await request.file({
        limits: {
          fileSize: 1024 * 1024 * 5, // 5mb
        },
      });

      if (!uploadedFile) {
        return reply.status(400).send({ message: 'File is required.' })
      }

      // Realiza o upload do arquivo
      await uploadImage({
        fileName: uploadedFile.filename,
        contentType: uploadedFile.mimetype,
        contentStream: uploadedFile.file,
      })

      return reply.status(201).send({ uploadId: "test" });
    }
  );
};
