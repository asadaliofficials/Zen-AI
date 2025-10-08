import { Router } from 'express';
import {
	createChatController,
	deleteChatController,
	getAllChatsController,
} from '../controllers/chat.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { chatValidator } from '../validators/chat.validator.js';
import { reqValidationResult } from '../middlewares/reqValidationResult.middleware.js';
import { get } from 'mongoose';

const router = Router();

router.post('/create', authMiddleware, chatValidator, reqValidationResult, createChatController);
router.get('/delete/:id', authMiddleware, deleteChatController);
router.get('/all', authMiddleware, getAllChatsController);

export default router;
