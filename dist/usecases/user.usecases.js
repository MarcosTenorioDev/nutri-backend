"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserUseCase = void 0;
const diet_repository_1 = require("../repositories/diet.repository");
const user_repository_1 = require("../repositories/user.repository");
class UserUseCase {
    constructor() {
        this.userRepository = new user_repository_1.UserRepositoryPrisma();
        this.dietsRepository = new diet_repository_1.DietRepositoryPrisma();
    }
    async create({ name, email, id }) {
        const result = await this.userRepository.create({ email, name, id });
        return result;
    }
    async delete(id) {
        const verifyIfUserExists = await this.userRepository.findById(id);
        if (!verifyIfUserExists) {
            throw new Error("User don't exists");
        }
        const verifyIfUserHasDiets = await this.dietsRepository.verifyIfUserHasDiets(id);
        if (verifyIfUserHasDiets) {
            await this.dietsRepository.deleteAllDietsByUserId(id);
        }
        const result = await this.userRepository.delete(id);
        return result;
    }
    //implementar a lógica de segurança de um token mestre para apenas o stripe poder fazer a requisição
    async setUserPaid(id) {
        const verifyIfUserExists = await this.userRepository.findById(id);
        if (!verifyIfUserExists) {
            throw new Error("User don't exists");
        }
        const result = await this.userRepository.setUserPaid(id);
        return result;
    }
    async verifyUserStatus(id) {
        const result = await this.userRepository.checkIfUserPaid(id);
        return {
            isPaid: result
        };
    }
}
exports.UserUseCase = UserUseCase;
