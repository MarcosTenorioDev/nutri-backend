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


        const verifyIsPaid = await this.userRepository.checkIfUserPaid(userId)

        if(!verifyIsPaid){
            throw new Error(`user ${user.name} does not have access to paid features.`)
        }

        //mover nome para createDietResult
        const dietData = await this.dietRepository.create({
            dietName: dietName,
            prompt : prompt,
            userId
        })


        //mover create para o userRepository e mudar o nome para createDietInDatabase
        const result = await prisma.diets.create({
            data:{
                name: dietName,
                dietData : dietData,
                userId: user.id
            }
        })

        return result

    }


    //mover prisma.diets.delete para o userRepository
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

    async deleteAllDietsByUserId(userId: string){
        const checkIfUserHasDiets  = await this.dietRepository.verifyIfUserHasDiets(userId);

        if(!checkIfUserHasDiets){
            throw new Error("User don't have any diet registred")
        }

        const result = await this.dietRepository.deleteAllDietsByUserId(userId);

        return result
    }
}

export {DietUseCase}