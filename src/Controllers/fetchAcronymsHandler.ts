import { Request, Response, NextFunction } from 'express';
import AppError from '../Helpers/AppError';
import catchAsync from '../Helpers/catchAsync';
import messages from '../Helpers/messages';
import Op from '../Helpers/op';
import { filterAcronyms } from '../Helpers/util';

export default catchAsync(async function (req: Request, res: Response, next: NextFunction) {
  const acronymsDb = new Op(require('../../acronyms.json'), req.query).filter().paginate();
  if (!acronymsDb['acronyms'] || acronymsDb['acronyms'].length <= 0) {
    return next(new AppError(messages.ERR_DEF_FND, 404));
  }

  // Send response to client
  return res.status(200).setHeader('More-Result', acronymsDb['moreResult'] ? 'Yes' : 'No').json({
    status: 'success',
    data: acronymsDb
  });
});
