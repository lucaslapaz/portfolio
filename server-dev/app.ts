import express, { RequestHandler } from "express";
import {Express, Request, Response, NextFunction} from "express"
import { routes } from "./routes";
import path from "path";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authMiddleware from "./middlewares/authMiddleware";
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware";
import notFoundMiddleware from "./middlewares/notFoundMiddleware";
import { accessLogger } from "./middlewares/accessLoggerMiddleware";

// Configurar para usar o arquivo .env como variáveis de ambiente
dotenv.config();

export const app:Express = express();

// Configurar template engine usado pelo express
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configurar limitador de acesso
app.use(rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 5 * 20,
    message: { success: false, data: { message: "Muitas requisições, tente novamente daqui a pouco."}}
}));

// Usado para fazer o parser do cookie recebido na requisição. Acessível em request.cookies
app.use(cookieParser());

// Converte o payload da requisição em json
app.use(express.json());

// Configuração de arquivos estáticos
app.use(express.static(path.join(__dirname, "../public")));

// Logs com informação de quem acessou o site
app.use(accessLogger);

// Middleware pra autenticar usuário usando o token jwt recebido via cookie
// Colocado após o express.static pra não ser chamado em cada arquivo requisitado.
app.use(authMiddleware);

// Cookies dev - teste, remover depois
app.use((req:Request, res:Response, next:NextFunction) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    next();
});

// Criar as rotas
app.use(routes);

// Error
app.use(errorHandlerMiddleware);

// 404
app.use(notFoundMiddleware);