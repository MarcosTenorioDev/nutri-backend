"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhookClerk = void 0;
const svix_1 = require("svix");
const user_usecases_1 = require("../usecases/user.usecases");
async function webhookClerk(fastify) {
    const userUseCase = new user_usecases_1.UserUseCase();
    fastify.post('/api/webhooks', async (request, reply) => {
        // Check if the 'Signing Secret' from the Clerk Dashboard was correctly provided
        const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
        if (!WEBHOOK_SECRET) {
            throw new Error("You need a WEBHOOK_SECRET in your .env");
        }
        // Grab the headers and body
        const headers = request.headers;
        const payload = request.body;
        const payloadString = JSON.stringify(payload);
        // Get the Svix headers for verification
        const svix_id = headers["svix-id"];
        const svix_timestamp = headers["svix-timestamp"];
        const svix_signature = headers["svix-signature"];
        // If there are missing Svix headers, error out
        if (!svix_id || !svix_timestamp || !svix_signature) {
            return reply.status(400).send("Error occurred -- no Svix headers");
        }
        // Initiate Svix
        const wh = new svix_1.Webhook(WEBHOOK_SECRET);
        let evt;
        // Attempt to verify the incoming webhook
        // If successful, the payload will be available from 'evt'
        // If the verification fails, error out and return an error code
        try {
            evt = wh.verify(payloadString, {
                "svix-id": svix_id,
                "svix-timestamp": svix_timestamp,
                "svix-signature": svix_signature,
            });
        }
        catch (err) {
            // Console log and return error
            console.log("Webhook failed to verify. Error:", err.message);
            return reply.status(400).send({
                success: false,
                message: err.message,
            });
        }
        // Grab the ID and TYPE of the Webhook
        const { id, email_addresses, first_name } = evt.data;
        const { type, data } = evt;
        //TODO:
        //Criar função para gerenciar as respostas do webhook
        switch (type) {
            case 'user.deleted':
                try {
                    const data = userUseCase.delete(id);
                    return reply.send(data);
                }
                catch (error) {
                    return reply.send(error);
                }
                break;
            case 'user.created':
                console.log('user created');
                try {
                    const data = userUseCase.create({
                        id: id,
                        name: first_name,
                        email: email_addresses[0].email_address
                    });
                    return reply.send(data);
                }
                catch (error) {
                    reply.send(error);
                }
                break;
            case 'user.updated':
                console.log('Usuário editado');
                console.log('Webhook body:', data);
                break;
            case 'session.ended':
                console.log('Sessão encerrada');
                console.log('Webhook body:', data);
                break;
            case 'session.created':
                console.log('Sessão criada');
                console.log('Webhook body:', data);
                break;
            case 'session.revoked':
                console.log('Sessão revogada');
                console.log('Webhook body:', data);
                break;
            case 'email.created':
                console.log('Email Criado');
                console.log('Webhook body:', data);
                break;
            case 'session.removed':
                console.log('Sessão removida');
                console.log('Webhook body:', data);
                break;
            default:
                console.log(`Evento não tratado: ${type}`);
        }
        return reply.status(200).send({
            success: true,
            message: "Webhook received",
        });
    });
}
exports.webhookClerk = webhookClerk;
