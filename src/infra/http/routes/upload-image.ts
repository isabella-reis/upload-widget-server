import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { uploadImage } from "../../../app/services/upload-image";
import { isRight, unwrapEither } from "../../../shared/either";

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
          201: z.null().describe("Image uploaded."),
          400: z.object({ message: z.string() }),
        },
      },
    },

    /**
     * Manipulador da requisição de upload.
     *
     * @param {import("fastify").FastifyRequest} request - Objeto da requisição do Fastify.
     * @param {import("fastify").FastifyReply} reply - Objeto de resposta do Fastify.
     * @returns {Promise<import("fastify").FastifyReply>} - Retorna a resposta HTTP apropriada.
     *
     * @throws {Error} Caso ocorra um erro inesperado no processo de upload.
     *
     * @example
     * // Exemplo de uso com cURL
     * curl -X POST http://localhost:3000/uploads \
     *      -F "file=@imagem.jpg"
     */
    async (request, reply) => {
      const uploadedFile = await request.file({
        limits: {
          fileSize: 1024 * 1024 * 5, // 5mb
        },
      });

      if (!uploadedFile) {
        return reply.status(400).send({ message: "File is required." });
      }

      // Realiza o upload do arquivo
      const result = await uploadImage({
        fileName: uploadedFile.filename,
        contentType: uploadedFile.mimetype,
        contentStream: uploadedFile.file,
      });

      if (isRight(result)) {
        console.log(unwrapEither(result))
        return reply.status(201).send();
      }

      // Desempacota o erro e retorna uma resposta apropriada
      const error = unwrapEither(result);

      switch (error.constructor.name) {
        case "InvalidFileFormat":
          return reply.status(400).send({ message: error.message });
      }
    }
  );
};
