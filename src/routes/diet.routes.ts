import { FastifyInstance } from "fastify";
import { DietUseCase } from "../usecases/diet.usecases";
import { authMiddleware } from "../middlewares/auth.middleware";
import { DietCreate } from "../interfaces/diet.interface";

export async function dietRoutes(fastify: FastifyInstance) {
  const dietUseCase = new DietUseCase();
  fastify.addHook("preHandler", authMiddleware);
  fastify.post("/", async (req : any, reply: any) => {
    const prompt = req.body.prompt;
    const dietName = req.body.dietName;
    const emailUser = req.headers["email"];
    try {
      const data = await dietUseCase.create({
        prompt,
        dietName,
        userEmail : emailUser
      }
      );
      return reply.send(data);
    } catch (error) {
      reply.send(error);
    }
  });
}
