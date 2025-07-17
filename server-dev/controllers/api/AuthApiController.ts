import { NextFunction, request, Request, Response } from "express";
import AuthService from "../../services/AuthService";
import ResponseHandler from "../../utils/ResponseHandler";
import JwtUtil  from "../../utils/JwtUtil";
import Scheduler from "../../utils/Scheduler";

export const csrfTokens:Map<string, { expiresat: number }> = new Map();
export const csrfTokensTTL: number = 5;

export class AuthApiController{

    private authService:AuthService;

    constructor(authService:AuthService){
        this.authService = authService;

        Scheduler.register({
            name: 'Limpar tokens CSTF expirados',
            intervalMs: 60 * 1000,
            callback: async () => {
                //console.log('Executando setinterval. Quantidade de tokens na memória: ' + csrfTokens.size)
                const now = Date.now();
                for (const [token, { expiresat }] of csrfTokens.entries()) {
                    if (expiresat <= now) {
                        csrfTokens.delete(token);
                    }
                }
                //console.log('Limpeza finalizada. Quantidade de tokens na memória: ' + csrfTokens.size)
            }
        })
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
                ResponseHandler.error(response, msg);
                return;
            }

            if(!csrfTokens.has(csrfToken)){
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

            csrfTokens.delete(csrfToken);

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
}