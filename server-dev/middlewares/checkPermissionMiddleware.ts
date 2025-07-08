import { NextFunction, Request, RequestHandler, Response } from "express";
import UserService from "../services/UserService";
import ResponseHandler from "../utils/ResponseHandler";
import AppError from "../utils/AppError";

export default function checkPermissionMiddlewareFactory(userService:UserService):Function{
    return function checkPermissionMiddleware(permission: number):RequestHandler{
        return async (request: Request, response: Response, next: NextFunction) => {
            if(!request.user){
                let message: string = "Você precisa estar logado e ter permissão para acessar esse conteúdo.";
                next(new AppError(message, 401))
                return;
            }
            const hasPermission:boolean = await userService.hasPermission(request.user, permission); 
            
            if(!hasPermission){
                let message: string = "O usuário não possui permissão para acessar esse conteúdo.";
                next(new AppError(message, 401))
                return;
            }
            next();
        }
    }
}