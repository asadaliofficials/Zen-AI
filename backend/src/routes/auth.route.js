import { Router } from 'express';

import {
	deleteUserController,
	loginController,
	logoutController,
	registerController,
} from '../controllers/auth.controller.js';
import { registerValidator } from '../validators/register.validator.js';
import { reqValidationResult } from '../middlewares/reqValidationResult.middleware.js';
import { loginValidator } from '../validators/login.validator.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/sign-up', registerValidator, reqValidationResult, registerController);
router.post('/login', loginValidator, reqValidationResult, loginController);
router.get('/logout', logoutController);
router.delete('/delete/:id', authMiddleware, deleteUserController);

export default router;
