import express, { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import hpp from 'hpp';

import expressRateLimitHandler from './Middlewares/express-rate-limit-handler';
import AppError from './Helpers/AppError';
import globalErrorHandler from './Middlewares/globalErrorHandler';
import acronym from './Routes/acronym';

const app = express();

// Register middlewares
app.set('trust proxy', 1);

// Set security HTTP headers
app.use(helmet());

// Prevent HTTP Parameter Pollution attacks
app.use(hpp({
    whitelist: ['from', 'limit', 'search'],
    checkQuery: true,
    checkBody: false,
}));

// Implement CORS
app.use(cors());

app.use(express.static(`${__dirname}/protected`));
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: '10kb' }));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests= require(same API
app.use('*', expressRateLimitHandler);

// Data compression
app.use(compression());

// API Endpoints
app.use('/acronym', acronym);

// Page not found error handler
app.all('/*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use(globalErrorHandler);
export default app;