import { FastifyInstance } from "fastify";
import { UserUseCase } from "../usecases/user.usecases";
import { jwtValidator } from "../middlewares/auth.middleware";

export async function userRoutes(fastify : FastifyInstance){
    const userUseCase = new UserUseCase();
  fastify.addHook("preHandler", jwtValidator)


  fastify.get('/', (req, reply) => {
    reply.send({status: 'its ok'})
  })
  /* Adicionar alguma lógica para ser usada no stripe para validar a requisição */
  fastify.post('/setIsPaid', async (req : any, reply : any) => {
    const userId = req.userId;
    try{
      const data = userUseCase.setUserPaid(userId)
      return reply.send(data);
    }
    catch (error) {
      reply.send(error);
    }

  })

  fastify.get('/userStatus', async (req: any, reply: any) => {
    const userId = req.userId;

      try{
        const result = await userUseCase.verifyUserStatus(userId)
        reply.send(result);
      }catch(err){
        return reply.send(err)
      }
  })
}