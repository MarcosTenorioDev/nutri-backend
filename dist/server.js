"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const user_routes_1 = require("./routes/user.routes");
const diet_routes_1 = require("./routes/diet.routes");
const cors_1 = __importDefault(require("@fastify/cors"));
const clerkWebhook_routes_1 = require("./routes/clerkWebhook.routes");
const app = (0, fastify_1.default)();
//configurar cors corretamente posteriormente
app.register(cors_1.default);
app.register(user_routes_1.userRoutes, {
    prefix: '/users'
});
app.register(clerkWebhook_routes_1.webhookClerk, {
    prefix: '/clerk'
});
app.register(diet_routes_1.dietRoutes, {
    prefix: '/diet'
});
app.get('/', (req, reply) => {
    reply.send({ status: 'its ok' });
});
app.listen({
    port: Number(process.env.PORT) || 3000,
}, () => {
    const port = Number(process.env.PORT) || 3000;
    console.log(`server is running on port ${port}`);
});
