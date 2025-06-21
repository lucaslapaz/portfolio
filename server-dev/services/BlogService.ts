import Post from "../models/Post";
import PostRepository from "../repositories/PostRepository";

export default class BlogService{
    private postRepository:PostRepository;

    constructor(postRepository: PostRepository){
        this.postRepository = postRepository;
    }

    async getLastListedPosts():Promise<Array<Post> | null>{
        const lastListedPosts = await this.postRepository.getLastListedPosts();
        return lastListedPosts;
    }
}