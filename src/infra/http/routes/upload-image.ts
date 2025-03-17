import { FastifyPluginAsync } from "fastify";
import { z } from "zod";

export const uploadImageRoute: FastifyPluginAsync = async (server) => {
  server.post(
    "/uploads",
    {
      schema: {
        summary: "Upload an image",
        consumes: ["multipart/form-data"],
        response: {
          201: z.object({ uploadId: z.string() }),
          409: z
            .object({ message: z.string() })
            .describe("Upload already exists in server."),
        },
      },
    },
    async (request, reply) => {
      const uploadedFile = await request.file({
        limits: {
          fileSize: 1024 * 1024 * 10, // 10mb
        },
      });

      console.log(uploadedFile);

      return reply.status(201).send({ uploadId: "test" });
    }
  );
};
