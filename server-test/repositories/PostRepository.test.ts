import dotenv from "dotenv";
import MySQL from "../../server-dev/database/MySQL";
import PostRepository from "../../server-dev/repositories/PostRepository";
import { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import Post from "../../server-dev/models/Post";

dotenv.config();

describe("Testes PostRepository", () => {

    let dbInstance:MySQL
    let db:Pool
    let postRepository:PostRepository

    beforeAll(() => {
        dbInstance = MySQL.getInstance();
        db = dbInstance.getPool();
        postRepository = new PostRepository(db);
    })

    afterAll(() => {
        db.end();
    })

    describe("Testes da função getPostById", () => {
        it("Parâmetro 0", async() => {
            const result = await postRepository.getPostById(0);
            expect(result).toBe(null);
        })

        it("Parâmetro 1", async() => {
            const repositoryPost = await postRepository.getPostById(1);
            expect(repositoryPost).toMatchObject({id: 1});
        })
    });

    describe("Testes da função getPostByFormattedTitle", () => {
        //it()
    })

})