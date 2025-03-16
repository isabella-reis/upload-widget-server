import { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { db } from "../../db";
import { schema } from "../../db/schemas";

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

      await db.insert(schema.uploads).values({
        name: 'test.jpg',
        remoteKey: 'test.jpg',
        remoteURL: 'http://test.com.br',
      })

      return reply.status(201).send({ uploadId: "test" });
    }
  );
};
