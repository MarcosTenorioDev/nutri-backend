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
    const result = await prisma.user.findFirst({
        where: {
            email
        }
    })

    return result || null
  }

  async findById(id: string): Promise<User | null> {
    const result = await prisma.user.findFirst({
      where: {
        id
      }
    })
    
    return result || null
  }
}

export { UserRepositoryPrisma };
