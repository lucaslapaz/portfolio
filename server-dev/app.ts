import express, { RequestHandler } from "express";
import {Express, Request, Response, NextFunction} from "express"
import createRoutes from "./routes";
import path from "path";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


import MySQL from "./database/MySQL";
import PostController from "./controllers/PostController";
import PostService from "./services/PostService";
import PostRepository from "./repositories/PostRepository";
import HomeController from "./controllers/HomeController";
import BlogController from "./controllers/BlogController";
import ErrorController from "./controllers/ErrorController";
import AuthController from "./controllers/AuthController";
import AuthService from "./services/AuthService";
import UserRepository from "./repositories/UserRepository";
import authMiddleware from "./middlewares/authMiddleware";
import UserService from "./services/UserService";
import BlogService from "./services/BlogService";

import checkPermissionMiddlewareFactory from "./middlewares/checkPermissionMiddleware";
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware";
import notFoundMiddleware from "./middlewares/notFoundMiddleware";
import StatusService from "./services/StatusService";
import StatusController from "./controllers/StatusController";
import NotesService from "./services/NotesService";
import NotesController from "./controllers/NotesController";
import NotesRepository from "./repositories/NotesRepository";

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

// Inicizalização do singleton
const dbInstance = MySQL.getInstance();
const pool = dbInstance.getPool();

// Post
const postRepository = new PostRepository(pool);
const postService = new PostService(postRepository);
const postController = new PostController(postService);

// Home
const homeController = new HomeController();

// Blog
const blogService = new BlogService(postRepository);
const blogController = new BlogController(blogService);

// Trata páginas de erro
const errorController = new ErrorController();

// User
const userRepository = new UserRepository(pool);
const userService:UserService = new UserService(userRepository);

// Login
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

// Server Status
const statusService:StatusService = new StatusService();
const statusController:StatusController = new StatusController(statusService);

// Checar permissões do usuário logado
const checkPermissionMiddleware:Function = checkPermissionMiddlewareFactory(userService);

// Página de anotações
const notesRepository:NotesRepository = new NotesRepository();
const notesService:NotesService = new NotesService(notesRepository);
const notesController:NotesController = new NotesController(notesService);

app.use(
    createRoutes(
        checkPermissionMiddleware,
        postController, 
        homeController, 
        blogController, 
        errorController,
        authController,
        statusController,
        notesController
));

// Error
app.use(errorHandlerMiddleware);

// 404
app.use(notFoundMiddleware);