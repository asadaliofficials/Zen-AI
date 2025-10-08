import { Router } from 'express';
import { createChatController } from '../controllers/chat.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { chatValidator } from '../validators/chat.validator.js';
import { reqValidationResult } from '../middlewares/reqValidationResult.middleware.js';

const router = Router();

router.post('/create', authMiddleware, chatValidator, reqValidationResult, createChatController);

export default router;
