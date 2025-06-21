import User from "../models/User";
import UserRepository from "../repositories/UserRepository";
import { HashUtil } from "../utils/HashUtil";
import { JwtUtil } from "../utils/JwtUtil";

export default class AuthService{

    private userRepository:UserRepository;

    constructor(userRepository:UserRepository){
        this.userRepository = userRepository;
    }

    async login(username: string, password: string):Promise<string | null>{
        
        const user:User | null = await this.userRepository.getUserByUsername(username);
        if(!user) return null;

        const match:boolean = await HashUtil.compare(password, user.password);

        if(match){
            const token:string = JwtUtil.generateToken({ id: user.id, username: user.username });
            return token;
        }else{
            return null;
        }
    }
}