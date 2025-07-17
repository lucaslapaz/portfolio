import { NextFunction, request, Request, Response } from "express";
import AuthService from "../../services/AuthService";
import ResponseHandler from "../../utils/ResponseHandler";
import AppError from "../../utils/AppError";
import JwtUtil  from "../../utils/JwtUtil";
import Scheduler from "../../utils/Scheduler";

import {csrfTokens, csrfTokensTTL} from '../api/AuthApiController';

export class AuthViewController{

    private authService:AuthService;

    constructor(authService:AuthService){
        this.authService = authService;
    }

    getLoginPage = async (request: Request, response: Response, next:NextFunction): Promise<void> => {
        try{
            const expiresat = Date.now() + (csrfTokensTTL * 60 * 1000);
            const csrfToken = JwtUtil.generateToken({ expiresAt: expiresat });
            csrfTokens.set(csrfToken, { expiresat });

            response.setHeader("Content-Type", "text/html");
            response.status(200);
            response.render("login", {csrfToken});
        }catch(err:any){
            let message:string = "ERROR(getLoginPage): Falha ao obter a página de login: " + err.message;
            next(new AppError(message, 500));
        }
        return;
    }

    getLogoutPage = async (request: Request, response: Response, next: NextFunction) : Promise<void> => {
        try{
            //console.log('chegou');
            response.cookie("auth_token", "", {
                maxAge: -1000,
                httpOnly: true, // Não acessível por javascript -> proteção contra XSS
                sameSite: 'lax',
                secure: false
            })
            response.redirect("/");
        }catch(err: any){
            let message:string = "ERROR(getLogouPage): Falha ao obter a página de logout: " + err.message;
            next(new AppError(message, 500));
        }
        return;
    }
}