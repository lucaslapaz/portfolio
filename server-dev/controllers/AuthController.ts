import { request, Request, Response } from "express";
import AuthService from "../services/AuthService";
import ResponseHandler from "../utils/ResponseHandler";

export default class AuthController{

    private authService:AuthService;

    constructor(authService:AuthService){
        this.authService = authService;
    }

    getLoginPage = async (request: Request, response: Response): Promise<void> => {
        response.setHeader("Content-Type", "text/html");
        response.status(200);
        response.render("login");
        return;
    }

    // getLogout = async (request: Request, response: Response): Promise<void> => {
    //     response.setHeader("Content-Type", "text/html");
    //     response.status(200);
    //     response.render("logout");
    //     return;
    // }

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
            ResponseHandler.ok(response, { message: "Logado com sucesso1" });
            return;

        }catch(err:any){
            console.log("Erro no postLogin: " + err.message);
            ResponseHandler.error(response, err.message);
        }
        return;
    }

    getLogoutPage = async (request: Request, response: Response) : Promise<void> => {
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
            
        }
    }
}