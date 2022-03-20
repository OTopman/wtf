import { Request, Response, NextFunction } from 'express';

import AppError from '../Helpers/AppError';
import catchAsync from '../Helpers/catchAsync';
import messages from '../Helpers/messages';

export default catchAsync(async function (req: Request, res: Response, next: NextFunction) {
  const headers = req.headers;
  if (!headers['authorization']) {
    return next(new AppError(messages.ERR_AUTH_KEY, 400));
  }

  const authorization = headers['authorization'].split(' ');
  if (authorization.length < 1) {
    return next(new AppError(messages.ERR_INV_AUTH_KEY, 400));
  }

  // Check if the access token is business or on the platform
  if (req.method === 'GET') {
    Object.assign(req.query, { isLoggedIn: true, expiredAt: new Date().getTime() + 30 * 60 * 1000 });
    Object.assign(req.params, { isLoggedIn: true, expiredAt: new Date().getTime() + 30 * 60 * 1000 });
  } else {
    Object.assign(req.body, { isLoggedIn: true, expiredAt: new Date().getTime() + 30 * 60 * 1000 });
  }
  next();
});
