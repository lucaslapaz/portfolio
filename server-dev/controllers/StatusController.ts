import { Request, Response } from "express";
import ResponseHandler from "../utils/ResponseHandler"
import StatusService from "../services/StatusService";

export default class StatusController{

    private statusService:StatusService;
        
    constructor(statusService:StatusService){
        this.statusService = statusService;
    }

    getServerStatus = async (request: Request, response: Response) => {
        try{
            const status = this.statusService.getServerStatus();
            ResponseHandler.ok(response, status);
            return;
        }catch(err:any){
            ResponseHandler.error(response, "Erro ao obter o status do servidor: " + err.message);
        }     
    }
}