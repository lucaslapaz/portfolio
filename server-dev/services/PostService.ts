import Post from "../models/Post";
import PostRepository from "../repositories/PostRepository";
import { generateSlug } from "../utils/PostUtils";

export default class PostService{
    
    private postRepository:PostRepository;

    constructor(postRepository:PostRepository){
        this.postRepository = postRepository;
    }   

    async getPostById(postId:number):Promise<Post | null>{
        return this.postRepository.getPostById(postId);
    }

    async getPostByFormattedTitle(title: string):Promise<Post | null>{
        return this.postRepository.getPostByFormattedTitle(title);
    }

    async createPost(user_id: number, title:string, description:string, content:string):Promise<Post | null>{
        const slug:string = generateSlug(title);
        return this.postRepository.createPost(user_id, title, slug, description, content);
    }

    async updatePostById(postId:number, title: string, description:string, content: string):Promise<boolean>{
        if(title.length < 5 || content.length < 5 || description.length < 5){
            console.log('Dados inválidos. Não foi possível atualizar os dados do post!');
            return false;
        }
        const slug = generateSlug(title);
        return this.postRepository.updatePostById(postId, title, slug, description, content);
    }

    async updatePostByFormattedTitle(postId:string, title: string, description:string, content: string):Promise<boolean>{
        if(title.length < 5 || content.length < 5 || description.length < 5){
            console.log('Dados inválidos. Não foi possível atualizar os dados do post!');
            return false;
        }
        const slug = generateSlug(title);
        return this.postRepository.updatePostByFormattedTitle(postId, title, slug, description, content);
    }
}