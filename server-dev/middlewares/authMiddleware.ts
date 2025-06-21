import { NextFunction, Request, Response } from "express";
import AuthUser from "../models/AuthUser";
import { JwtUtil } from "../utils/JwtUtil";



declare global {
    namespace Express {
        interface Request {
            user?: AuthUser | null;  // ou qualquer outro tipo que você queira
        }
    }
}

export default function authMiddleware(request: Request, response: Response, next: NextFunction) {
    try{
        const cookies:Record<string, string> = request.cookies;
        request.user = null;

        if(cookies.auth_token != null){
            const payload:AuthUser = JwtUtil.verifyToken<AuthUser>(cookies.auth_token);
            request.user = {
                id: payload.id,
                authenticated: true,
                username: payload.username
            }
        }
    }catch(err:any){
        console.log('authMiddleware: token inválido ou erro ao validar token: ' + err.message);
    }

    // Torna acessível em todas as views
    response.locals.user = request.user;
    next();
}