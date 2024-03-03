import { error } from "console";
import { prisma } from "../database/prisma-client";
import { User, UserCreate, UserRepository } from "../interfaces/user.interface";

class UserRepositoryPrisma implements UserRepository {
  async create(data: UserCreate): Promise<User> {
    const result = await prisma.user.create({
        data: {
            id: data.id,
            name: data.name,
            email: data.email
        }
    })
    return result;
  }

  async delete(id: string){
    const result = await prisma.user.delete({
      where:{
        id
      }
    })
    return result;
  }

  async findByEmail(email: string): Promise<User | null>{
    if(email){
         const result = await prisma.user.findFirst({
        where: {
            email
        }
    })
    return result || null
    }
    //TOFIX:
    throw new Error(`Cannot find user with email: ${email}`)

  }
   //TOFIX:
   //VALIDADOR SE EXISTE O ID RECEBIDO.
  async findById(id: string): Promise<User | null> {
    const result = await prisma.user.findFirst({
      where: {
        id
      }
    })
    
    return result || null
  }

  async setUserPaid(id: string): Promise<User | null>{
    const result = await prisma.user.update({
      where:{
        id
      },
      data: {
        isPaid: true
      }
    })

    return result || null
  }

  async checkIfUserPaid(id: string): Promise<boolean>{

    const user = await prisma.user.findFirst({
        where:{
            id: id,
            isPaid: true
        }
    })

    if(user){
        return true
    }

    return false
}

async checkUserEmail(id: string): Promise<string>{

  const user = await prisma.user.findFirst({
    where: {
      id
    }
  })

  if(user){
      return user.email
  }

  return ''
}
}

export { UserRepositoryPrisma };
