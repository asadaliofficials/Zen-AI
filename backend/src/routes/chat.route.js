import { Router } from 'express';
import { createChatController } from '../controllers/chat.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { chatValidator } from '../validators/chat.validator.js';

const router = Router();

router.post('/create', authMiddleware, chatValidator, createChatController);

export default router;
