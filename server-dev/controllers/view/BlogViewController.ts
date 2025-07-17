import { NextFunction, Request, Response } from "express";
import BlogService from "../../services/BlogService";
import AppError from "../../utils/AppError";
// import PostService from "../../services/PostService";


export class BlogViewController{
    
    private blogService:BlogService;

    constructor(blogService:BlogService){
        this.blogService = blogService;
    }

    getBlogPage = async (request:Request, response:Response, next:NextFunction) : Promise<void> => {
        try{
            const lastListedPosts = await this.blogService.getLastListedPosts();
            response.setHeader("Content-Type", "text/html");
            response.status(200);
            response.render('blog', {listedPosts: lastListedPosts});
        }catch(err:any){
            let message: string = "ERROR(getBlogPage): Falha ao obter a página do blog: " + err.message;
            next(new AppError(message, 500));
        }
        return;
    }
} 