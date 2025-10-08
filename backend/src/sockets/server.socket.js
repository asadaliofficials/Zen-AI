import { Server } from 'socket.io';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';

import { chatController } from '../controllers/chat.controller.js';
import { messageValidator } from '../validators/message.validator.js';
export function setupSocket(server) {
	let io = new Server(server);

	io.on('connection', socket => {
		let userId = null;
		socket.on('message', obj => {
			try {
				const cookieHeader = socket.handshake.headers.cookie;
				if (!cookieHeader) return socket.emit('responce', { message: 'unauthorized' });

				const cookies = cookie.parse(cookieHeader);
				const token = cookies['token'];
				if (!token) return socket.emit('responce', { message: 'unauthorized' });

				const decoded = jwt.verify(token, process.env.JWT_SECRET);
				if (!decoded) return socket.emit('responce', { message: 'unauthorized' });
				userId = decoded.id;
			} catch (error) {
				console.log(error);
			}

			const { message, chatId } = JSON.parse(obj);
			if (!message || !chatId) {
				socket.emit('responce', { message: 'Message and Chat id are required' });
				return;
			}
			const errors = messageValidator(message, chatId);
			if (errors.length > 0) {
				socket.emit('responce', errors);
				return;
			}
			chatController(socket, message, chatId, userId);
		});

		// testing socket
		socket.on('test', () => {
			console.log(`test reply from the socket server`);
			socket.emit('test', 'test reply from the socket server');
		});

		socket.on('disconnect', () => {
			console.log(`Client disconnected: ${socket.id}`);
		});
	});
}
