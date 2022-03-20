import { Request, Response, NextFunction } from "express";
import catchAsync from "../Helpers/catchAsync";
import { getAcronymKeys, saveAcronyms } from "../Helpers/util";
import AppError from '../Helpers/AppError';
import messages from "../Helpers/messages";

export default catchAsync(async function (req: Request, res: Response, next: NextFunction) {
    const acronymsDB = require('../../acronyms.json');
    const { acronym, definition } = req.body;

    // Check if acronym exists
    const existingKeys = getAcronymKeys(acronymsDB);
    if (existingKeys.includes(acronym.toLowerCase())) {
        return next(new AppError(messages.ERR_DEF_EXIST, 400));
    }

    // Save acronym
    const data: any = {};
    data[acronym] = definition;
    acronymsDB.push(data);
    saveAcronyms(acronymsDB);

    // Send response to client
    return res.status(201).json({
        status: 'success',
        message: 'Request completed.'
    });
});