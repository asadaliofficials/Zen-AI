import { Server } from 'socket.io';
import { nanoid } from 'nanoid';

import { chatController, sandboxChatController } from '../controllers/chat.controller.js';
import { messageValidator } from '../validators/message.validator.js';
import getTokenFromSocket from '../utils/getToken.util.js';

export function setupSocket(server) {
	const io = new Server(server, {
		cors: {
			origin: '*', // adjust in production
			methods: ['GET', 'POST'],
		},
		connectionStateRecovery: {
			recoveryTimeout: 3 * 60, // 3 minutes
			attempts: 10, // try to recover connection 10 times
		},
	});

	// ================================
	// 🔒 /user namespace (authenticated)
	// ================================
	const userNamespace = io.of('/user');

	userNamespace.on('connection', socket => {
		socket.on('message', obj => {
			try {
				const userId = getTokenFromSocket(socket);
				if (!userId) {
					socket.emit('response', { message: 'Unauthorized socket' });
					return;
				}

				const { message, chatId } = JSON.parse(obj);
				const isNewChat = chatId === 'null';

				const errors = messageValidator(message, chatId);
				if (errors.length > 0) {
					socket.emit('response', errors);
					return;
				}

				const tempChat = socket.handshake.query.temp;
				chatController(socket, message, chatId, userId, isNewChat, tempChat);
			} catch (error) {
				console.error('Socket message error:', error);
				socket.emit('error', { message: 'Internal server error' });
			}
		});
	});

	// ================================
	// 🧪 /sandbox namespace (guest users)
	// ================================
	const sandboxNamespace = io.of('/sandbox');

	sandboxNamespace.on('connection', socket => {
		console.log(`🧪 Sandbox user connected: ${socket.id}`);

		socket.on('message', obj => {
			let { message, chatId } = JSON.parse(obj);
			const isNewChat = chatId === 'null';
			console.log(message, chatId, isNewChat);

			if (
				typeof message !== 'string' ||
				!message.trim() ||
				message.length < 1 ||
				message.length > 1000
			) {
				socket.emit('response', {
					message: 'Message must be between 1 and 1000 characters',
				});
				return;
			}

			if (isNewChat) {
				chatId = nanoid(20);
			}

			sandboxChatController(socket, message, chatId);
		});

		socket.on('disconnect', () => {
			console.log(`❌ Sandbox user disconnected: ${socket.id}`);
		});
	});
}
