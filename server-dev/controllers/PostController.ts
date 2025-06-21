import { NextFunction, Request, Response } from "express";
import PostService from "../services/PostService";
import ResponseHandler from "../utils/ResponseHandler";
import Post from "../models/Post";


export default class PostController{
    
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
                    console.error("O título especificado é muito curto.");
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
                next(); // Vai chegar no middleware 404
            }
        }catch(err: any){
            response.status(500).json({message: (err as Error).message});
        }
        return;
    }

    getEditPostByIdPage = async (request: Request, response: Response) : Promise<void> => {
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
                    console.error("O título especificado é muito curto.");
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
                response.redirect("/post/new")
            }
        }catch(err: any){
            response.status(500).json({message: (err as Error).message});
        }
    }

    getCreatePostPage = async (request: Request, response: Response) : Promise<void> => {
        try{
            response.setHeader("Content-Type", "text/html");
            response.status(200);
            response.render('post-creator')
        }catch(err: any){
            response.status(500).json({message: (err as Error).message});
        }
    }

    createPost = async (request: Request, response: Response) :Promise<void> => {
        try{
            if(!request.user || !request.user.id) {
                ResponseHandler.error(response, "Você precisa estar autenticado para poder postar.");
                return;
            }
            
            const {title, description, content } = request.body
            const user_id:number = request.user.id;

            if(title.length < 5 || description.length < 5 || content.length < 5){
                ResponseHandler.error(response, "Os dados recebidos não cumprem as exigências.");
                return;
            }

            const post:Post | null = await this.postService.createPost(user_id, title, description, content);

            if(post){
                ResponseHandler.ok(response, post)
            }else{
                ResponseHandler.error(response, "Houve algum erro ao tentar criar o post!");
            }

        }catch(err:any){
            console.log(err.message);
        }
    }

    patchPostById = async (request: Request, response: Response) : Promise<void> => {
        try{
            const postId:string = request.params.postId;
            const idIsInteger:boolean = /^[0-9]+$/.test(postId);

            const {title, description, content} = request.body;
            let sucess: boolean = false;

            if(idIsInteger){
                sucess = await this.postService.updatePostById(parseInt(postId), title, description, content);
            }else{
                if(postId.length > 4){
                    sucess = await this.postService.updatePostByFormattedTitle(postId, title, description, content);
                }else{
                    console.error("O título especificado é muito curto.");
                }
            }
        }catch(err:any){
            response.status(500).json({message: (err as Error).message})
        }
    }
}