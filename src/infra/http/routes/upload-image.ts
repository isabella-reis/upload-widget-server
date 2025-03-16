import { FastifyPluginAsync } from "fastify";
import { z } from "zod";

export const uploadImageRoute: FastifyPluginAsync = async (server) => {
  server.post(
    '/uploads',
    {
      schema: {
        summary: "Upload an image",
        body: z.object({
          name: z.string(),
          password: z.string().optional(),
        }),
        response: {
          201: z.object({ uploadId: z.string() }),
          409: z
            .object({ message: z.string() })
            .describe("Upload already exists in server."),
        },
      },
    },
    async (request, reply) => {
      return reply.status(201).send({ uploadId: "test" });
    }
  );
};
