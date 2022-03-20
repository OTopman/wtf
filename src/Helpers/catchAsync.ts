/* eslint-disable require-jsdoc */
import { Request, Response, NextFunction } from 'express';

export default function (fn: Function) {
  return function (req: Request, res: Response, next: NextFunction) {
    fn(req, res, next).catch(next);
  };
};
