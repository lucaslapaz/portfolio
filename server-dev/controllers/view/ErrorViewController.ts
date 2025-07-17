import { Request, Response } from "express";


export class ErrorViewController{

    getNotFoundPage = async (request:Request, response:Response) : Promise<void> => {
        response.setHeader("Content-Type", "text/html");
        response.status(200);
        response.render('404');
        return;
    }

    getUnauthorizedPage = async (request:Request, response:Response) : Promise<void> => {
        response.setHeader("Content-Type", "text/html");
        response.status(401);
        response.render('unauthorized');
        return;
    }
} 