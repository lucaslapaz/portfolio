import { NextFunction, request, Request, Response } from "express";
import AuthService from "../services/AuthService";
import ResponseHandler from "../utils/ResponseHandler";
import AppError from "../utils/AppError";
import JwtUtil  from "../utils/JwtUtil";
import Scheduler from "../utils/Scheduler";

export default class AuthController{

    private authService:AuthService;
    private csrfTokens:Map<string, { expiresat: number }> = new Map();
    private csrfTokensTTL: number = 5;
    private texto: string = "minha caralha";

    constructor(authService:AuthService){
        this.authService = authService;

        Scheduler.register({
            name: 'Limpar tokens CSTF expirados',
            intervalMs: 60 * 1000,
            callback: async () => {
                console.log('Executando setinterval. Quantidade de tokens na memória: ' + this.csrfTokens.size)
                const now = Date.now();
                for (const [token, { expiresat }] of this.csrfTokens.entries()) {
                    if (expiresat <= now) {
                        this.csrfTokens.delete(token);
                    }
                }
                console.log('Limpeza finalizada. Quantidade de tokens na memória: ' + this.csrfTokens.size)
            }
        })
    }

    getLoginPage = async (request: Request, response: Response, next:NextFunction): Promise<void> => {
        try{
            const expiresat = Date.now() + (this.csrfTokensTTL * 60 * 1000);
            const csrfToken = JwtUtil.generateToken({ expiresAt: expiresat });
            this.csrfTokens.set(csrfToken, { expiresat });

            response.setHeader("Content-Type", "text/html");
            response.status(200);
            response.render("login", {csrfToken});
        }catch(err:any){
            let message:string = "ERROR(getLoginPage): Falha ao obter a página de login: " + err.message;
            next(new AppError(message, 500));
        }
        return;
    }

    postLogin = async (request: Request, response: Response) : Promise<void> => {
        try{
            let { username, password, csrfToken } = request.body;
            if(username.length < 5 || password.length < 5){
                ResponseHandler.error(response, "Usuário incorreto!");
                return;
            }

            if(csrfToken == null){
                let msg: string = "A requisição foi enviada de um local não permitido.";
                console.log(msg);
                ResponseHandler.error(response, msg);
                return;
            }

            if(!this.csrfTokens.has(csrfToken)){
                let msg: string = "Token CSRF incorreto ou expirado!";
                console.log(msg)
                ResponseHandler.error(response, msg);
                return;
            }

            let tokenPayload:{ expiresat: number } | null;
            let expiresat: number = 0;

            try{
                tokenPayload = JwtUtil.verifyToken<{ expiresat: number }>(csrfToken);
                expiresat = tokenPayload.expiresat;
            }catch(err:any){
                let msg: string = "Token CSRF incorreto.";
                console.log(msg)
                ResponseHandler.error(response, msg);
                return;
            }

            this.csrfTokens.delete(csrfToken);

            const timestamp = Date.now();
            if(timestamp >= expiresat){
                let msg:string = "O formulário expirou, recarregue a página e tente novamente.";
                console.log(msg)
                ResponseHandler.error(response, msg);
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