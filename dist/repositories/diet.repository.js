"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DietRepositoryPrisma = void 0;
const axios_1 = __importDefault(require("axios"));
const prisma_client_1 = require("../database/prisma-client");
class DietRepositoryPrisma {
    async createDietResult(data) {
        const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
        const content = data.prompt;
        const config = {
            headers: {
                Authorization: "Bearer " + OPENAI_API_KEY,
                "Content-Type": "application/json",
                Accept: "application/json",
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
            const response = await axios_1.default.post("https://api.openai.com/v1/chat/completions", chatData, config);
            const dietResponse = response.data.choices[0].message.content;
            return dietResponse;
        }
        catch (error) {
            console.error('Error:', error.message);
            return error;
        }
    }
    async deleteAllDietsByUserId(userId) {
        const diets = await prisma_client_1.prisma.diets.deleteMany({
            where: {
                userId: userId
            }
        });
        return diets;
    }
    async verifyIfUserHasDiets(userId) {
        const hasDiets = await prisma_client_1.prisma.diets.findMany({
            where: {
                userId: userId
            }
        });
        if (hasDiets) {
            return true;
        }
        return false;
    }
    async getAllDietsByUserId(userId) {
        const diets = await prisma_client_1.prisma.diets.findMany({
            where: {
                userId: userId
            }
        });
        return diets;
    }
}
exports.DietRepositoryPrisma = DietRepositoryPrisma;
