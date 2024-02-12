import { FastifyInstance } from "fastify";
import { DietUseCase } from "../usecases/diet.usecases";
import { jwtValidator } from "../middlewares/auth.middleware";
import { DietCreate } from "../interfaces/diet.interface";

export async function dietRoutes(fastify: FastifyInstance) {
  const dietUseCase = new DietUseCase();
  fastify.addHook("preHandler", jwtValidator);

  fastify.post("/", async (req: any, reply: any) => {
    const userId = req.userId;
    const prompt = req.body.prompt;
    const dietName = req.body.dietName;

    try {
      const data = await dietUseCase.create({
        prompt,
        dietName,
        userId: userId,
      });
      return reply.send(data);
    } catch (error) {
      reply.send(error);
    }
  });

  fastify.delete("/:id", async (req: any, reply: any) => {
    const dietId = req.params.id;
    const userId = req.userId
    
    try {
      const data = await dietUseCase.delete(dietId, userId);
      return reply.send(data);
    } catch (error) {
      reply.send(error);
    }
  })

  fastify.get("/allDiets", async (req : any, reply : any) => {
    const userId = req.userId;

    try{
      const data = await dietUseCase.getAllDietsByUserId(userId)
      return reply.send(data)
    }catch(error){
      reply.send(error)
    }
  })
}
