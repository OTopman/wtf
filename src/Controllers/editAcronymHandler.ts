import { Request, Response, NextFunction } from "express";
import AppError from "../Helpers/AppError";
import catchAsync from "../Helpers/catchAsync";
import messages from "../Helpers/messages";
import { editAcronym, getAcronymKeys } from "../Helpers/util";
import validateParamsHandler from "../Middlewares/validateParamsHandler";

export default catchAsync(async function (req: Request, res: Response, next: NextFunction) {
    const acronymsDb: any[] = require('../../acronyms.json');
    const { acronym, definition } = req.body;

    // Check if acronym exists
    const keys = getAcronymKeys(acronymsDb);
    if (!keys.includes(String(acronym).toLowerCase())) {
        return next(new AppError(messages.ERR_DEF_FND, 404));
    }

    // Edit record
    if (!editAcronym(acronym, definition)) {
        return next(new AppError(messages.ERR_REQ_FAILED, 500));
    }

    // Send response to client
    return res.status(200).json({
        status: 'success',
        message: 'Record edited.'
    });
});