import { Pool, RowDataPacket } from "mysql2/promise";
import User from "../models/User";
import AuthUser from "../models/AuthUser";

export default class UserRepository{

    private db:Pool;

    constructor(db:Pool){
        this.db = db;
    }

    async getUserByUsername(username: string): Promise<User | null>{
        const query:string = "SELECT id, username, name, email, creation_date, password FROM users WHERE username = ?;";
        const [rows]:[RowDataPacket[], any] = await this.db.query<RowDataPacket[]>(query, [username]);
        
        if(rows.length == 0) return null;
        
        const user:User = rows[0] as User;
        return user;
    }

    async getPermission(user: AuthUser): Promise<number>{
        const query = "SELECT permission FROM users WHERE id = ? AND username = ?;";
        const [rows]:[RowDataPacket[], any] = await this.db.query<RowDataPacket[]>(query, [user.id, user.username]);
        
        if(rows.length == 0) return 0;
        
        const permission:number = (rows[0] as { permission: number }).permission;
        return permission;
    }

}