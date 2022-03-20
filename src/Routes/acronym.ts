import express from 'express'
import editAcronymHandler from '../Controllers/editAcronymHandler';
import fetchAcronymsHandler from '../Controllers/fetchAcronymsHandler';
import removeAcronymHandler from '../Controllers/removeAcronymHandler';
import saveAcronymHandler from '../Controllers/saveAcronymHandler';
import authorizationHandler from '../Middlewares/authorizationHandler';
import validateParamsHandler from '../Middlewares/validateParamsHandler';
const router = express.Router();

router.route('/')
    .get(fetchAcronymsHandler)
    .post(validateParamsHandler(['acronym', 'definition']), saveAcronymHandler);

//! NOTE: Since acronym can start with special characters, I changed from using params to body
router.delete('/', authorizationHandler, validateParamsHandler('acronym'), removeAcronymHandler);
router.put('/', authorizationHandler, validateParamsHandler(['definition', 'acronym']), editAcronymHandler);

export default router;
