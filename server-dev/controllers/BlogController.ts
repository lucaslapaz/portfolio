import { Request, Response } from "express";
import BlogService from "../services/BlogService";
import Post from "../models/Post";
// import PostService from "../services/PostService";


export default class BlogController{
    
    private blogService:BlogService;

    constructor(blogService:BlogService){
        this.blogService = blogService;
    }

    getBlogPage = async (request:Request, response:Response) : Promise<void> => {
        try{
            const lastListedPosts = await this.blogService.getLastListedPosts();
            if(lastListedPosts){
                response.setHeader("Content-Type", "text/html");
                response.status(200);
                response.render('blog', {listedPosts: lastListedPosts});
            }
        }catch(err:any){
            console.log('BlogController->getBlog: ', err.message);
        }
    }
} 