import { NextFunction, Request, Response } from "express";
import PostService from "../../services/PostService";
import Post from "../../models/Post";
import AppError from "../../utils/AppError";


export class PostViewController{
    
    private postService:PostService;

    constructor(postService:PostService){
        this.postService = postService;
    }

    getPostByIdPage = async (request:Request, response:Response, next: NextFunction) : Promise<void> => {
        try{
            const postId:string = request.params.postId;
            const idIsInteger:boolean = /^[0-9]+$/.test(postId);
            let post:Post | null = null;

            if(idIsInteger){
                post = await this.postService.getPostById(parseInt(postId));
            }else{
                if(postId.length > 4){
                    post = await this.postService.getPostByFormattedTitle(postId);
                }else{
                    next(); // Redireciona para o middleware 404
                    return;
                }
            }
            
            if(post != null){
                const date = new Date(post.creation_date);
                const optionsData: Intl.DateTimeFormatOptions = { // Define a localidade (português do Brasil) e a timeZone
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    timeZone: 'America/Sao_Paulo'
                };

                const optionsHora: Intl.DateTimeFormatOptions = {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                    timeZone: 'America/Sao_Paulo'
                };

                const dataFormatada = new Intl.DateTimeFormat('pt-BR', optionsData).format(date);
                const horaFormatada = new Intl.DateTimeFormat('pt-BR', optionsHora).format(date);
                const resultado = `${dataFormatada} | ${horaFormatada}`;

                response.setHeader("Content-Type", "text/html");
                response.status(200);
                response.render('post', { title: post.title, content: post.content, creation_date: `${dataFormatada} | ${horaFormatada}`, author: post.name});
            }else{
                next(); // Redireciona para o middleware 404
            }
        }catch(err: any){
            let message:string = "ERROR(getPostByIdPage): Falha ao obter a página do post: " + err.message;
            next(new AppError(message, 500))
        }
        return;

    }

    getEditPostByIdPage = async (request: Request, response: Response, next:NextFunction) : Promise<void> => {
        try{

            const postId:string = request.params.postId;
            const idIsInteger:boolean = /^[0-9]+$/.test(postId);

            let post:Post | null = null;

            if(idIsInteger){
                post = await this.postService.getPostById(parseInt(postId));
            }else{
                if(postId.length > 4){
                    post = await this.postService.getPostByFormattedTitle(postId);
                }else{
                    next(new AppError("O id do post especificado é muito curto.", 404)); // Direciona para a página notfound
                    return;
                }
            }

            if(post != null){
                const date = new Date(post.creation_date);
                // Define a localidade (português do Brasil) e a timeZone
                const optionsData: Intl.DateTimeFormatOptions = {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    timeZone: 'America/Sao_Paulo'
                };

                const optionsHora: Intl.DateTimeFormatOptions = {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                    timeZone: 'America/Sao_Paulo'
                };

                // Formata data
                const dataFormatada = new Intl.DateTimeFormat('pt-BR', optionsData).format(date);
                // Formata hora
                const horaFormatada = new Intl.DateTimeFormat('pt-BR', optionsHora).format(date);

                // Monta no formato final
                const resultado = `${dataFormatada} | ${horaFormatada}`;
                response.setHeader("Content-Type", "text/html");
                response.status(200);
                response.render('post-editor', {
                        type: 'edit',
                        title: post.title, 
                        content: post.content, 
                        description: post.description,
                        creation_date: `${dataFormatada} | ${horaFormatada}`, 
                        author: post.name
                    }
                );
            }else{
                // Define o status como '302 Found' e header Location com valor de destino
                response.redirect("/post/new");
            }
        }catch(err: any){
            let message:string = "ERROR(getEditPostByIdPage): Falha ao obter a página do editor de post: " + err.message;
            next(new AppError(message, 500))
        }
        return;
    }

    getCreatePostPage = async (request: Request, response: Response, next:NextFunction) : Promise<void> => {
        try{
            response.setHeader("Content-Type", "text/html");
            response.status(200);
            response.render('post-creator')
        }catch(err: any){
            let message:string = "ERROR(getCreatePostPage): Falha ao obter a página de criação de post: " + err.message;
            next(new AppError(message, 500));
        }
        return;
    }
}