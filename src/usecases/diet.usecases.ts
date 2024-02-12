import { Diets, PrismaPromise } from "@prisma/client";
import { prisma } from "../database/prisma-client";
import { Diet, DietCreate, DietRepository } from "../interfaces/diet.interface";
import { DietRepositoryPrisma } from "../repositories/diet.repository";
import { UserRepositoryPrisma } from "../repositories/user.repository";


class DietUseCase implements DietUseCase{
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

        const dietData = await this.dietRepository.createDietResult({
            prompt : prompt,
            userId
        })

        //mover create para o userRepository e mudar o nome para createDietInDatabase
        const result: any = await prisma.diets.create({
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
        //verificar se a dieta contém o userId utilizado na requisição

        const user = await this.userRepository.findById(userId)

        if(!user) {
            throw new Error('User not found')
        }  

        //verificar se o id da dieta existe

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

    async getAllDietsByUserId(userId : string): Promise<Diet[]>{

        const user = await this.userRepository.findById(userId)

        if(!user) {
            throw new Error('User not found')
        }  
        
        const diets = await this.dietRepository.getAllDietsByUserId(userId)
    
        return diets
    }
}

export {DietUseCase}