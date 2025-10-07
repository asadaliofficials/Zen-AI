import { Router } from 'express';

import { loginController, registerController } from '../controllers/auth.controller.js';
import { registerValidator } from '../../validators/register.validator.js';
import { reqValidationResult } from '../middlewares/reqValidationResult.middleware.js';
import { loginValidator } from '../../validators/login.validator.js';

const router = Router();

router.post('/sign-up', registerValidator, reqValidationResult, registerController);
router.post('/login', loginValidator, reqValidationResult, loginController)

export default router;
