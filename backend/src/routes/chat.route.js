import { Router } from 'express';
import {
	chatMessagesController,
	createChatController,
	deleteChatController,
	getAllChatsController,
} from '../controllers/chat.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { chatValidator } from '../validators/chat.validator.js';
import { reqValidationResult } from '../middlewares/reqValidationResult.middleware.js';
import { get } from 'mongoose';

const router = Router();

router.post(
	'/create',
	authMiddleware,
	(req, res, next) => {
		// send response as this service is temporary unavailable
		return res.status(503).json({ message: 'Service temporarily unavailable' });
	},
	chatValidator,
	reqValidationResult,
	createChatController
);
router.get('/delete/:id', authMiddleware, deleteChatController);
router.get('/all', authMiddleware, getAllChatsController);
router.get('/:id', authMiddleware, chatMessagesController);

export default router;
