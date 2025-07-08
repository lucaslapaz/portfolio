import { NextFunction, request, Request, Response } from "express";
import AuthService from "../services/AuthService";
import ResponseHandler from "../utils/ResponseHandler";
import AppError from "../utils/AppError";

export default class AuthController{

    private authService:AuthService;

    constructor(authService:AuthService){
        this.authService = authService;
    }

    getLoginPage = async (request: Request, response: Response, next:NextFunction): Promise<void> => {
        try{
            response.setHeader("Content-Type", "text/html");
            response.status(200);
            response.render("login");
        }catch(err:any){
            let message:string = "ERROR(getLoginPage): Falha ao obter a página de login: " + err.message;
            next(new AppError(message, 500));
        }
        return;
    }

    postLogin = async (request: Request, response: Response) : Promise<void> => {
        try{
            let { username, password } = request.body;
            if(username.length < 5 || password.length < 5){
                ResponseHandler.error(response, "Usuário incorreto!");
                return;
            }

            const token:string | null = await this.authService.login(username, password);

            if(!token) {
                ResponseHandler.error(response, "Usuário ou senha incoreto.")
                return;
            }

            response.cookie("auth_token", token, {
                maxAge: 1000 * parseInt(process.env.COOKIE_EXPIRES_IN as string),
                httpOnly: true, // Não acessível por javascript -> proteção contra XSS
                sameSite: 'lax',
                secure: false
            })
            ResponseHandler.ok(response, { message: "Logado com sucesso." });

        }catch(err:any){
            console.error("Erro no postLogin: " + err.message);
            ResponseHandler.error(response, "Falha interna do servidor.");
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