import { NextFunction, Request, Response } from "express";
import PostService from "../services/PostService";
import AppError from "../utils/AppError";


export default class HomeController {

    // private postService:PostService;

    // constructor(postService:PostService){
    //     this.postService = postService;
    // }

    getHomePage = async (request: Request, response: Response, next:NextFunction): Promise<void> => {
        try {
            response.setHeader("Content-Type", "text/html");
            response.status(200);
            response.render('home', { user: request.user ? request.user : null });
        }catch(err:any){
            let message:string = "ERROR(getHomePage): Falha ao obter a página home: " + err.message;
            next(new AppError(message, 500));
        }
        return;
    }
} 