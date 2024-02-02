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

    async delete(id: string, userId: string){
        //fazer validação para saber se realmente é o usuário que está deletando uma dieta própria

        const user = await this.userRepository.findById(userId)

        if(!user) {
            throw new Error('User not found')
        }

        const result = await prisma.diets.delete({
            where : {
                id : id
            }
        })

        //personalizar retorno no postman para retonar http 200 
        return result
    }
}

export {DietUseCase}