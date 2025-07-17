import { NextFunction, Request, Response } from "express";
import NotesService from "../../services/NotesService";
import FileMetada from "../../models/FileMetadata";
import ResponseHandler from "../../utils/ResponseHandler";

export class NotesApiController{
    private notesService: NotesService;

    constructor(notesService:  NotesService){
        this.notesService = notesService;
    }

    getMetadaList = async (request: Request, response: Response, next:NextFunction): Promise<void> => {
        try{
            const path:string = typeof request.query.path == "string" ? request.query.path as string : "";
            const filesList:FileMetada[] | null = await this.notesService.getFilesList(path);

            if(!filesList){
                let message:string = "ERROR(getNotesPage): Falha ao obter a lista de arquivos.";
                ResponseHandler.error(response, message);
                return;
            }
            ResponseHandler.ok(response, filesList);
        }catch(err: any){
            ResponseHandler.error(response, "Falha ao obter lista de arquivos.");
        }   
        return;
    }

    getFileContent = async (request: Request, response: Response, next:NextFunction): Promise<void> => {
        try{
            const path:string | null = typeof request.query.path === "string" ? request.query.path : null;

            if(!path){
                ResponseHandler.error(response, "É necessário fornecer um valor válido para o query param path.");
                return
            }

            const content:string | null = await this.notesService.getFileContent(path);

            if(content){
                ResponseHandler.ok(response, {path, content});
                return;
            }

            ResponseHandler.error(response, "Arquivo não encontrado.");

        } catch(err: any){
            ResponseHandler.error(response, "Falha ao obter o conteúdo do arquivo.");
        }
        return;
    }
}