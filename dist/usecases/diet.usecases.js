"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DietUseCase = void 0;
const prisma_client_1 = require("../database/prisma-client");
const diet_repository_1 = require("../repositories/diet.repository");
const user_repository_1 = require("../repositories/user.repository");
class DietUseCase {
    constructor() {
        this.dietRepository = new diet_repository_1.DietRepositoryPrisma();
        this.userRepository = new user_repository_1.UserRepositoryPrisma();
    }
    async create({ dietName, prompt, userId }) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const verifyIsPaid = await this.userRepository.checkIfUserPaid(userId);
        if (!verifyIsPaid) {
            throw new Error(`user ${user.name} does not have access to paid features.`);
        }
        const dietData = await this.dietRepository.createDietResult({
            prompt: prompt,
            userId
        });
        //mover create para o userRepository e mudar o nome para createDietInDatabase
        const result = await prisma_client_1.prisma.diets.create({
            data: {
                name: dietName,
                dietData: dietData,
                userId: user.id
            }
        });
        return result;
    }
    //mover prisma.diets.delete para o userRepository
    async delete(id, userId) {
        //fazer validação para saber se realmente é o usuário que está deletando uma dieta própria
        //verificar se a dieta contém o userId utilizado na requisição
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        //verificar se o id da dieta existe
        const result = await prisma_client_1.prisma.diets.delete({
            where: {
                id: id
            }
        });
        //personalizar retorno no postman para retonar http 200 
        return result;
    }
    async deleteAllDietsByUserId(userId) {
        const checkIfUserHasDiets = await this.dietRepository.verifyIfUserHasDiets(userId);
        if (!checkIfUserHasDiets) {
            throw new Error("User don't have any diet registred");
        }
        const result = await this.dietRepository.deleteAllDietsByUserId(userId);
        return result;
    }
    async getAllDietsByUserId(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const diets = await this.dietRepository.getAllDietsByUserId(userId);
        return diets;
    }
}
exports.DietUseCase = DietUseCase;
