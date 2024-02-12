export interface Diet {
  id: string;
  name: string;
  dietData: string;
  userId: string
}

export interface DietCreate{
dietName: string
prompt: any,
userId: string
}

export interface DietCreateRepository{
  prompt: string;
  userId: string
}

export interface DietRepository{
createDietResult(data: DietCreateRepository) : Promise<string>
 deleteAllDietsByUserId(userId: string) : Promise<any>;
 verifyIfUserHasDiets(userId : string) : Promise<boolean>;
}

export interface DietUseCase {
  create({dietName ,prompt, userId}: DietCreate): Promise<any>;
  delete(id: string, userId: string): Promise<any>;
  deleteAllDietsByUserId(userId: string): Promise<any>;
}