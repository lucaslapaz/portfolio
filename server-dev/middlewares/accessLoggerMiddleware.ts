import geoip from 'geoip-lite';
import logger from '../utils/LoggerUtil';
import { NextFunction, Request, Response } from 'express';

export function accessLogger(request: Request, response: Response, next: NextFunction){
    const start = Date.now();

    response.on('finish', () => {
        const duration = Date.now() - start;
        const ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress;

        // Geo localização
        let geo = undefined;
        if(typeof ip === 'string'){
            geo = geoip.lookup(ip);
        }

        logger.info({
            type: "access",
            ip,
            method: request.method,
            url: request.originalUrl,
            status: response.statusCode,
            userAgent: request.headers['user-agent'],
            referer: request.headers['referer'],
            duration,
            timestamp: new Date().toISOString(),
            geo
        });
    });

    next();
}