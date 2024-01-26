import fastify, { FastifyInstance } from "fastify";
import {userRoutes} from './routes/user.routes'
import { dietRoutes } from './routes/diet.routes'
const app: FastifyInstance = fastify();
 
app.register(userRoutes, {
    prefix: '/users'
})

app.register(dietRoutes, {
    prefix: '/diet'
})

app.listen({
    port: 3000,
}, () => {
    console.log("Server is running on port 3000")
})

