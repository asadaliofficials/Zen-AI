// src/sockets/chat.socket.js
import { Server } from 'socket.io';

export function setupSocket(server) {
	let io = new Server(server);

	io.on('connection', socket => {
		console.log(`🔌 Client connected: ${socket.id}`);

		socket.on('message', msg => {
			console.log(`${socket.id} recieved ${msg}`);
		});

		socket.on('test', () => {
			console.log(`test reply from the socket server`);

			socket.emit('test', 'test reply from the socket server');
		});

		socket.on('disconnect', () => {
			console.log(`❌ Client disconnected: ${socket.id}`);
		});
	});
}
