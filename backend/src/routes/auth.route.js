import { Router } from 'express';

import { authController } from '../controllers/auth.controller.js';
import { registerValidator } from '../../validators/register.validator.js';
import { reqValidationResult } from '../middlewares/reqValidationResult.middleware.js';

const router = Router();

router.post('/sign-up', registerValidator, reqValidationResult, authController);

export default router;
