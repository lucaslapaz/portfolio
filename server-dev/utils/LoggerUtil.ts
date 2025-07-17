// LoggerUtil.ts
import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';

const accessLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.DailyRotateFile({
        filename: path.join('logs', 'access-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        // zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        )
    }),
  ]
});

const appLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.DailyRotateFile({
      filename: path.join('logs', 'app-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      )
    })
  ]
});

const logger = {
  info: (info: any) => {
    if (info && info.type == 'access') {
      accessLogger.info(info);
    } else {
      appLogger.info(info);
    }
  },
  error: (info: any) => {
    appLogger.error(info);
  }
};

export default logger;












/*

import winston from 'winston';
import 'winston-daily-rotate-file';

// Filtro para logs de acesso
const accessLogFilter = winston.format((info) => {
    return info.type === 'access' ? info : false;
})

// Filtro para todos os outros logs (não são de acesso)
const appLogFilter = winston.format((info) => {
    return info.type !== 'access' ? info : false;
})


const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [

        // Transporte para logs de acesso
        new winston.transports.DailyRotateFile({
            filename: 'logs/access-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            format: winston.format.combine(
                accessLogFilter(),
                winston.format.timestamp(),
                winston.format.json()
            )
        }),

        // Transporte para logs do app
        new winston.transports.DailyRotateFile({
            filename: 'logs/app-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            format: winston.format.combine(
                appLogFilter(),
                winston.format.timestamp(),
                winston.format.json()
            )
        })
    ]
});

export default logger;
*/