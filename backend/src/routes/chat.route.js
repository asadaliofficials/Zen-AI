import { Router } from 'express';
import { createChatController } from '../controllers/chat.controller.js';

const router = Router();

router.post('/create', createChatController);

export default router;
