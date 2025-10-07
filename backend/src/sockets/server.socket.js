import { Server } from 'socket.io';
import { chatController } from '../controllers/chat.controller.js';
import { messageValidator } from '../validators/message.validator.js';
export function setupSocket(server) {
	let io = new Server(server);

	io.on('connection', socket => {
		socket.on('message', obj => {
			const { message, chatID } = JSON.parse(obj);
			if (!message || !chatID) {
				socket.emit('responce', { message: 'Message and Chat ID are required' });
				return;
			}
			const errors = messageValidator(message, chatID);
			if (errors.length > 0) {
				socket.emit('responce', errors);
				return;
			}
			chatController(socket, message, chatID);
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
