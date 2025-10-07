import { Server } from 'socket.io';
import { chatController } from '../controllers/chat.controller.js';
export function setupSocket(server) {
	let io = new Server(server);

	io.on('connection', socket => {

		socket.on('message', msg => {
			chatController(socket, msg);
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
