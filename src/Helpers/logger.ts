import winston from 'winston';
import 'winston-daily-rotate-file';

const transport = new winston.transports.DailyRotateFile({
  filename: './logs/errors/error-%DATE%.json',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20mb',
  maxFiles: '14d',
  level: 'error',
  eol: ','
});

const logger = winston.createLogger({
  handleExceptions: true,
  handleRejections: true,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  transports: [
    transport,
    new winston.transports.Console({
      level: 'info',
      format: winston.format.simple(),
    })
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: './logs/exceptions/exceptions.log',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
      )
    })
  ]
});

export default logger;
