import { Router } from 'express';

import { authController } from '../controllers/auth.controller.js';

const router = Router();

router.post('/sign-up', authController);

export default router;