export interface User{
    id: string;
    email : string;
    name: string;
}

export interface UserCreate{
    id: string
    email: string
    name: string
}

export interface UserRepository{
    create(data: UserCreate): Promise<User>;
    delete(id:string): any;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    setUserPaid(id: string) : Promise<User | null>;
    checkIfUserPaid(id: string) : Promise<boolean>
}