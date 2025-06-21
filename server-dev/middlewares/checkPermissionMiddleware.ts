import { NextFunction, Request, Response } from "express";
import UserService from "../services/UserService";
import ResponseHandler from "../utils/ResponseHandler";

export default function checkPermissionMiddlewareFactory(userService:UserService){
    return function checkPermissionMiddleware(permission: number){
        return async (request: Request, response: Response, next: NextFunction) => {
            if(!request.user){
                //response.redirect("/unauthorized");
                // return;
                return ResponseHandler.error(response, "Você precisa estar logado e ter permissão para acessar esse conteúdo.")
            }
            const hasPermission:boolean = await userService.hasPermission(request.user, permission); 
            
            if(!hasPermission){
                ResponseHandler.error(response, "O usuário não possui permissão para acessar esse conteúdo.");
                return;
            }
            next();
        }
    }
}