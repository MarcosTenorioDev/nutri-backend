import { UserCreate, UserRepository, User } from "../interfaces/user.interface";
import { UserRepositoryPrisma } from "../repositories/user.repository";

class UserUseCase {
  private userRepository: UserRepository;
  constructor() {
    this.userRepository = new UserRepositoryPrisma();
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


}

export { UserUseCase };
