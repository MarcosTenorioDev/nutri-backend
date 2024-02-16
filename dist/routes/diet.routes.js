"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dietRoutes = void 0;
const diet_usecases_1 = require("../usecases/diet.usecases");
const auth_middleware_1 = require("../middlewares/auth.middleware");
async function dietRoutes(fastify) {
    const dietUseCase = new diet_usecases_1.DietUseCase();
    fastify.addHook("preHandler", auth_middleware_1.jwtValidator);
    fastify.post("/", async (req, reply) => {
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
        }
        catch (error) {
            reply.send(error);
        }
    });
    fastify.delete("/:id", async (req, reply) => {
        const dietId = req.params.id;
        const userId = req.userId;
        try {
            const data = await dietUseCase.delete(dietId, userId);
            return reply.send(data);
        }
        catch (error) {
            reply.send(error);
        }
    });
    fastify.get("/allDiets", async (req, reply) => {
        const userId = req.userId;
        try {
            const data = await dietUseCase.getAllDietsByUserId(userId);
            return reply.send(data);
        }
        catch (error) {
            reply.send(error);
        }
    });
}
exports.dietRoutes = dietRoutes;
