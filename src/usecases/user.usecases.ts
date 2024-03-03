import { DietRepository } from "../interfaces/diet.interface";
import { UserCreate, UserRepository, User } from "../interfaces/user.interface";
import { DietRepositoryPrisma } from "../repositories/diet.repository";
import { UserRepositoryPrisma } from "../repositories/user.repository";

class UserUseCase {
  private userRepository: UserRepository;
  private dietsRepository : DietRepository;

  constructor() {
    this.userRepository = new UserRepositoryPrisma();
    this.dietsRepository = new DietRepositoryPrisma();
  }

  async create({ name, email, id}: UserCreate): Promise<User> {

    const result = await this.userRepository.create({ email, name, id });

    return result;
  }

  async delete(id:string) {
    const verifyIfUserExists = await this.userRepository.findById(id);

    if(!verifyIfUserExists){
      throw new Error("User don't exists")
    }

    const verifyIfUserHasDiets = await this.dietsRepository.verifyIfUserHasDiets(id)

    if (verifyIfUserHasDiets){
      await this.dietsRepository.deleteAllDietsByUserId(id)
    }

    const result = await this.userRepository.delete(id);

    return result

  }

  //implementar a lógica de segurança de um token mestre para apenas o stripe poder fazer a requisição
  async setUserPaid(id: string,) {
    const verifyIfUserExists = await this.userRepository.findById(id);

    if(!verifyIfUserExists){
      throw new Error("User don't exists")
    }


    const result = await this.userRepository.setUserPaid(id);

    return result


  }


  async verifyUserStatus(id: string){
    const result = await this.userRepository.checkIfUserPaid(id);

    return {
      isPaid: result
    }
  }

  async verifyUserEmail(id: string){
    const result = await this.userRepository.checkUserEmail(id);

    return {
      email: result
    }
  }


}

export { UserUseCase };
