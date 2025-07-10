import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";
import ResponseHandler from "../utils/ResponseHandler";

export default function errorHandlerMiddleware(error: any, request: Request, response: Response, next: NextFunction): void {
    //console.error(error.message);
    let statusCode: number = 500;
    if(error instanceof AppError){
        statusCode = error.statusCode
        response.setHeader("Content-Type", "text/html");
        response.status(statusCode);

        switch(statusCode){
            case 500: // erro interno do servidor
                response.render('error');
                break;
            case 401: // unauthorized
                response.render('unauthorized');
                break;
            case 404: // not found
                response.render('404');
                break;
            default:
                response.render('error');
                break;
        }
        return;
    }

    ResponseHandler.error(response, error.message);
    console.error('ERROR(errorHandlerMiddleware): ' + error.message);
}