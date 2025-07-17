import { NextFunction, Response, Request } from 'express';
import fs from 'fs/promises';
import path from 'path';
import AppError from '../../utils/AppError';


const logsDir = path.join(__dirname, '../../../logs');

const example = {
    "level" : "info",
    "message" : {
        "duration" : 22,
        "geo" : null,
        "ip" : "::1",
        "method" : "GET",
        "status" : 200,
        "timestamp" : "2025-07-17T01:57:33.818Z",
        "type" : "access",
        "url" : "/admin",
        "userAgent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML,like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0"
    },
    "timestamp" : "2025-07-17T01:57:33.818Z"
}

export class AdminViewController{
    constructor(){

    }

    getAdminPage = async (request: Request, response: Response, next: NextFunction) : Promise<void> => {
        try{
            const files = await fs.readdir(logsDir);
            const logFileRegex = /^access-\d{4}-\d{2}-\d{2}\.log$/;
            const matchingFiles = files.filter(file => logFileRegex.test(file));
            const allLogs: any[] = [];

            for(const file of matchingFiles){
                const filePath = path.join(logsDir, file);
                const content = await fs.readFile(filePath, 'utf-8');

                const lines = content
                        .split('\n')
                        .filter(line => line.trim() !== '') // remove linhas vazias
                        .map(line => {
                            try{
                                return JSON.parse(line);
                            }catch{
                                return null;
                            }
                        })
                        .filter(entry => entry !== null);
                
                allLogs.push(...lines);
            }
            allLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            response.setHeader("Content-Type", "text/html");
            response.status(200);
            response.render("admin", {allLogs});
        }catch(err:any){
            let message: string = "ERROR(getAdminPage): Falha ao obter a página admin: " + err.message;
            console.log(message);
            next(new AppError(message, 500));
        }
        return;
    }
}