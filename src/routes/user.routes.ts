import { FastifyInstance } from "fastify";
import { UserUseCase } from "../usecases/user.usecases";
import { UserCreate } from "../interfaces/user.interface";

export async function userRoutes(fastify : FastifyInstance){
    const userUseCase = new UserUseCase();
    
    fastify.post<{Body: UserCreate}>('/', (req, reply) => {
        const {name, email} = req.body;
        try{
            const data = userUseCase.create({
                name,
                email
            });
            return reply.send(data)
        } catch(error){
            reply.send(error)
        }
    })

    fastify.get('/', (req, reply) => {
        reply.send({status: 'its ok'})
    })
}