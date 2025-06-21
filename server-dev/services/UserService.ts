import AuthUser from "../models/AuthUser";
import UserRepository from "../repositories/UserRepository";

export default class UserService{

    private userRepository: UserRepository;

    constructor(userRepository: UserRepository){
        this.userRepository = userRepository;
    }

    async hasPermission(user: AuthUser, required_permission: number) : Promise<boolean>{
        const permission:number = await this.userRepository.getPermission(user);
        return (permission < required_permission) ? false : true;
    }
}