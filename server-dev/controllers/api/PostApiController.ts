import { NextFunction, Request, Response } from "express";
import PostService from "../../services/PostService";
import ResponseHandler from "../../utils/ResponseHandler";
import Post from "../../models/Post";
import AppError from "../../utils/AppError";


export class PostApiController{
    
    private postService:PostService;

    constructor(postService:PostService){
        this.postService = postService;
    }

    postCreatePost = async (request: Request, response: Response) :Promise<void> => {
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
                ResponseHandler.ok(response, post);
            }else{
                ResponseHandler.error(response, "Houve algum erro ao tentar criar o post!");
            }

        }catch(err:any){
            ResponseHandler.error(response, "Houve algum erro ao tentar criar o post!");
            
        }
        return;
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
                    ResponseHandler.error(response, "O título especificado é muito curto.");
                    return;
                }
            }
            ResponseHandler.ok(response, {message: "Alterações aplicadas com sucesso."});

        }catch(err:any){
            ResponseHandler.error(response, "Falha ao atualizar as informações do post.")
        }
        return;

    }
}