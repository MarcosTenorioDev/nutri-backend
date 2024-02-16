"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const user_usecases_1 = require("../usecases/user.usecases");
const auth_middleware_1 = require("../middlewares/auth.middleware");
async function userRoutes(fastify) {
    const userUseCase = new user_usecases_1.UserUseCase();
    fastify.addHook("preHandler", auth_middleware_1.jwtValidator);
    fastify.get('/', (req, reply) => {
        reply.send({ status: 'its ok' });
    });
    /* Adicionar alguma lógica para ser usada no stripe para validar a requisição */
    fastify.post('/setIsPaid', async (req, reply) => {
        const userId = req.userId;
        try {
            const data = userUseCase.setUserPaid(userId);
            return reply.send(data);
        }
        catch (error) {
            reply.send(error);
        }
    });
    fastify.get('/userStatus', async (req, reply) => {
        const userId = req.userId;
        try {
            const result = await userUseCase.verifyUserStatus(userId);
            reply.send(result);
        }
        catch (err) {
            return reply.send(err);
        }
    });
}
exports.userRoutes = userRoutes;
