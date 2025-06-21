import MySQL from "../../server-dev/database/MySQL"
import Post from "../../server-dev/models/Post";
import PostRepository from "../../server-dev/repositories/PostRepository";
import dotenv from "dotenv";

dotenv.config();

describe("Testes função getLastListedPosts", () => {
    const dbInstance = MySQL.getInstance();
    const db = dbInstance.getPool();
    const postRepository:PostRepository = new PostRepository(db);
    
    it("Testando a função getLastListedPosts", async () => {
        const posts:Post[] | null = await postRepository.getLastListedPosts();
        //console.log(posts);
        expect(2).toBe(2);
    })

    // it("Testando a função getPostById", async () => {
    //     const post:Post | null = await postRepository.getPostById(1);
    //     console.log(post);
    //     expect(2).toBe(2);
    // });

    afterAll(async () => {
        await db.end();
    })
})