export interface Diet {
  id: string;
  name: string;
  dietData: string;
  userId: string
}

export interface DietCreate{
dietName: string
prompt: any,
userEmail: string
}

export interface DietCreateRepository{
  name: string;
  dietData: string;
  userId: string
}

export interface DietRepository{
 create(data: DietCreate) : Promise<string> /* tipar futuramente */
}