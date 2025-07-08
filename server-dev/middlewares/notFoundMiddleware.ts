import { NextFunction, Request, Response } from "express";

export default function notFoundMiddleware(request: Request, response: Response, next: NextFunction): void {
    response.setHeader("Content-Type", "text/html");
    response.status(404);
    response.render('404');
    return;
}