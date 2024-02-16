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
    port: Number(process.env.PORT) || 3000,
    host: '0.0.0.0'
}, () => {
    const port = Number(process.env.PORT) || 3000
    console.log(`server is running on port ${port}`)
})

