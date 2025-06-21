import { Response } from "express";

export default class ResponseHandler{
    static ok(response: Response, data: any) : Response{
        return response.status(200).json({ success: true, data });
    }

    static created(response: Response, message: string) : Response{
        return response.status(201).json({ sucess: true, message });
    }

    static notFound(response: Response, message: string) : Response{
        return response.status(404).json({ success: false, message});
    }

    static error(response: Response, message: string) : Response{
        return response.status(500).json({ success: false, message });
    }
}