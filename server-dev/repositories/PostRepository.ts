import { FieldPacket, OkPacket, Pool, QueryResult, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import Post from "../models/Post";


export default class PostRepository {
    private db: Pool;
    constructor(db: Pool) {
        this.db = db;
    }

    /*
        | OkPacket -> DELETE, INSERT, UDPATE
        | OkPacket[] -> DELETE, INSERT, UDPATE
        | ResultSetHeader -> INSERT ... ON DUPLICATE KEY UPDATE;
        | ResultSetHeader[] -> INSERT ... ON DUPLICATE KEY UPDATE;
        | RowDataPacket[] -> SELECT
        | RowDataPacket[][] -> SELECT
        | ProcedureCallPacket;
    */

    async getPostById(idPost: number): Promise<Post | null> {
        const query = "SELECT p.id, p.title, p.formatted_title, p.description, p.content, p.creation_date, u.name FROM posts AS p INNER JOIN users AS u ON p.user_id = u.id WHERE p.id = ?;"
        const [rows]: [RowDataPacket[], any] = await this.db.query<RowDataPacket[]>(query, [idPost]);

        if (rows.length == 0) return null;

        const row = rows[0];

        // Faz a transformação explicita, evitando erros por causa do type assertion
        const post:Post = {
            id: row.id,
            title: row.title,
            formatted_title: row.formatted_title,
            description: row.description,
            content: row.content,
            creation_date: row.creation_date,
            name: row.name
        }

        //const post: Post = (rows as Post[])[0];
        return post;

    }

    async getPostByFormattedTitle(title: string): Promise<Post | null> {
        const query = "SELECT p.id, p.title, p.formatted_title, p.description, p.content, p.creation_date, u.name FROM posts AS p INNER JOIN users AS u ON p.user_id = u.id WHERE p.formatted_title = ?;"
        const [rows]: [RowDataPacket[], any] = await this.db.query<RowDataPacket[]>(query, [title]);
        
        if(rows.length == 0) return null;
        
        const post:Post = (rows as Post[])[0];
        return post;
    }

    async createPost(user_id:number, title: string, slug: string, description: string, content: string):Promise<Post | null>{
        const query:string = "INSERT INTO posts (user_id, title, formatted_title, description, content) VALUES (?, ?, ?, ?, ?);";
        
        const [result]: [ResultSetHeader, any] = await this.db.query<ResultSetHeader>(query, [
            user_id,
            title,
            slug,
            description,
            content
        ])

        if(result.affectedRows == 0) return null;

        let post:Post = {
            id: result.insertId,
            user_id: user_id,
            title: title,
            formatted_title: slug,
            description: description,
            content: content,
            creation_date: Date.now()
        }
        return post;
    }

    async updatePostById(postId: number, title: string, formatted_title: string, description: string, content: string): Promise<boolean> {
        
        /*ResultSetHeader {
            fieldCount: 0,
            affectedRows: 1,
            insertId: 0,
            info: 'Rows matched: 1  Changed: 1  Warnings: 0',
            serverStatus: 2,
            warningStatus: 0,
            changedRows: 1
        }*/
        
        const query = "UPDATE posts SET title = ?, formatted_title = ?, description = ?, content = ? WHERE id = ?";
        const [result]:[ResultSetHeader, any] = await this.db.query<ResultSetHeader>(query, [title, formatted_title, description, content, postId]);

        if(result.affectedRows == 1){
            return true;
        }else{
            return false;
        }
    }


    async updatePostByFormattedTitle(actualSlug: string, title: string, newSlug: string, description: string, content: string): Promise<boolean> {
        const query = "UPDATE posts SET title = ?, formatted_title = ?, description = ?, content = ? WHERE formatted_title = ?";
        const [result]:[ResultSetHeader, any] = await this.db.query<ResultSetHeader>(query, [title, newSlug, description, content, actualSlug]);
        
        if(result.affectedRows == 1){
            return true;
        }else{
            return false;
        }
    }

    async getLastListedPosts(amount: number = 15, page: number = 0, content_size: number = 10): Promise<Post[] | null> {
        const query = `
            SELECT p.id, p.title, left(p.content, ?) as content, p.formatted_title, p.creation_date, u.name, p.description
            FROM posts as p
            INNER JOIN users as u ON p.user_id = u.id
            WHERE p.is_listed = 1
            ORDER BY p.creation_date DESC  
            LIMIT ? OFFSET ?;
        `;
        const offset = page * amount;
        const [rows]:[RowDataPacket[], any] = await this.db.query<RowDataPacket[]>(query, [content_size, amount, offset]);
        
        if(rows.length == 0) return null;

        const posts: Post[] = rows as Post[];
        return posts;
    }
}