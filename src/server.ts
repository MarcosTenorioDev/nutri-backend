import fastify, { FastifyInstance } from "fastify";
import {userRoutes} from './routes/user.routes'
import { dietRoutes } from './routes/diet.routes'
import cors from "@fastify/cors";
import { webhookClerk } from "./routes/clerkWebhook.routes";


const app: FastifyInstance = fastify();
//configurar cors corretamente posteriormente
app.register(cors)

app.register(userRoutes, {
    prefix: '/users'
})

app.register(webhookClerk, {
    prefix: '/clerk'
})

app.register(dietRoutes, {
    prefix: '/diet'
})

app.listen({
    port: Number(process.env.PORT),
}, () => {
    console.log("Server is running on port 3000")
})

