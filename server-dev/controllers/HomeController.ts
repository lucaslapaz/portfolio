import { Request, Response } from "express";
import PostService from "../services/PostService";


export default class HomeController{
    
    // private postService:PostService;

    // constructor(postService:PostService){
    //     this.postService = postService;
    // }

    getHomePage = async (request:Request, response:Response) : Promise<void> => {
        response.setHeader("Content-Type", "text/html");
        response.status(200);
        response.render('home', { user : request.user ? request.user : null });
        return;
    }
} 