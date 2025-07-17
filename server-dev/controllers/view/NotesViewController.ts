import { NextFunction, Request, Response } from "express";
import NotesService from "../../services/NotesService";
import AppError from "../../utils/AppError";
import FileMetada from "../../models/FileMetadata";
import ResponseHandler from "../../utils/ResponseHandler";

export class NotesViewController{
    private notesService: NotesService;

    constructor(notesService:  NotesService){
        this.notesService = notesService;
    }

    getNotesPage = async (request: Request, response: Response, next: NextFunction): Promise<void> => {
        try{
            response.status(200);
            response.setHeader("Content-Type", "text/html");
            response.render("notes");
        }catch(err: any){
            let message:string = "ERROR(getNotesPage): Falha ao obter a página de notas." + err.message;
            next(new AppError(message, 500));
        }
        return;
    }
}