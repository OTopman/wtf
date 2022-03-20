import { Request, Response, NextFunction } from 'express';
import { inputValidation } from '../Helpers/util';
import AppError from '../Helpers/AppError';


/**
 *
 * @param {Array | string} props
 * @return {function}
 */
export default function (props: string | Array<string>) {
  if (typeof props === 'string') {
    props = props.split(',');
  }

  props = props instanceof Array ? props : [props];

  return function (req: Request, res: Response, next: NextFunction) {
    let message = '(';
    for (let i = 0; i < props.length; i++) {
      let propNotExists = false;
      if (req.method === 'GET') {
        propNotExists = !req.params[props[i]] && !req.query[props[i]];

        // eslint-disable-next-line guard-for-in
        for (const key in { ...req.params, ...req.query }) {
          if (req.params[key] && typeof req.params[key] !== 'object') {
            req.params[key] = inputValidation(req.params[key]);
          }

          if (req.query[key] && typeof req.query[key] !== 'object') {
            const element: any = req.query[key];
            req.query[key] = inputValidation(element);
          }
        }
      } else {
        propNotExists = !req.body[props[i]];
        for (const key in req.body) {
          if (req.body[key] && typeof req.body[key] !== 'object') {
            req.body[key] = inputValidation(req.body[key]);
          }
        }
      }
      if (propNotExists) {
        message += props[i] + ', ';
      }
    }
    if (message !== '(') {
      return next(new AppError(`These fields are required: ${message.slice(0, -2)})`, 400));
    }
    next();
  };
};
