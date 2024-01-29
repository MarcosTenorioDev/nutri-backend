import axios, { AxiosError } from 'axios';
import { DietCreate, DietRepository } from "../interfaces/diet.interface";
import { prisma } from '../database/prisma-client';

class DietRepositoryPrisma implements DietRepository {
    async create(data: DietCreate): Promise<any> {
        const OPENAI_API_KEY = process.env.OPENAI_API_KEY
        const content = data.prompt;

        const config = {
            headers: {
                Authorization: "Bearer " + OPENAI_API_KEY,
                "Content-Type": "application/json",
                Accept: "application/json",
                email: data.userEmail
                
            },
        };

        const chatData = {
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "Você é uma IA que gera dietas, com refeições de segunda a domingo com base nos dados recebidos." },
                { role: "user", content: content },
            ],
        };

        try {
            const response = await axios.post("https://api.openai.com/v1/chat/completions", chatData, config);
            const dietResponse = response.data.choices[0].message.content;

            return dietResponse;
             
        } catch (error : AxiosError | any) {
        console.error('Error:', error.message);
        return error

    }
    }
}

export { DietRepositoryPrisma };
