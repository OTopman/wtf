import { Request, Response, NextFunction } from 'express';

/**
 *
 * Send error in development environment
 *
 * @param {Error | AppError} err - Error object
 * @param {Response} res - Response object
 */
const sendDevelopmentError = (err: any, res: Response) => {
  return res.status(err.statusCode || 500).json({
    status: err.status,
    message: err.message,
    error: err,
    stackTrace: err.stack,
  });
};

/**
 *
 * Send error in production environment
 *
 * @param {AppError | Error} err - Error object
 * @param {Response} res - Response object
 */
const sendProductionError = (err: any, res: Response) => {
  // console.log(err);
  if (err.isOperational) {
    return res.status(err.statusCode || 500).json({
      status: err.status,
      message: err.message,
    });
  } else {
    return res.status(500).json({
      status: 'failed',
      message: 'Something went very wrong!',
    });
  }
};
/**
 * This will handle global error
 *
 * @param {AppError} err
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export default function globalErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  // Handle production error
  if (process.env.NODE_ENV === 'production') {
    sendProductionError(err, res);
  } else if (process.env.NODE_ENV === 'development') {
    sendDevelopmentError(err, res);
  }
};
// export default globalErrorHandler;
