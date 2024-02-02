import { prisma } from "../database/prisma-client";
import { DietCreate, DietRepository } from "../interfaces/diet.interface";
import { DietRepositoryPrisma } from "../repositories/diet.repository";
import { UserRepositoryPrisma } from "../repositories/user.repository";


class DietUseCase{
    private dietRepository : DietRepository
    private userRepository: UserRepositoryPrisma;
    constructor(){
        this.dietRepository = new DietRepositoryPrisma();
        this.userRepository = new UserRepositoryPrisma();
    }
    async create({dietName ,prompt, userId}: DietCreate){

        const user = await this.userRepository.findById(userId)

        if(!user) {
            throw new Error('User not found')
        }


        const dietData = await this.dietRepository.create({
            dietName: dietName,
            prompt : prompt,
            userId
        })
        
        const result = await prisma.diets.create({
            data:{
                name: dietName,
                dietData : dietData,
                userId: user.id
            }
        })

        return result

    }
}

export {DietUseCase}