// src/sockets/chat.socket.js
import { Server } from 'socket.io';
import geminiService from '../services/gemini.service.js';
export function setupSocket(server) {
	let io = new Server(server);

	io.on('connection', socket => {
		console.log(`🔌 Client connected: ${socket.id}`);

		socket.on('message', async msg => {
			const responce = await geminiService(msg);
			socket.emit('responce', responce);
		});


    // testing socket 
		socket.on('test', () => {
			console.log(`test reply from the socket server`);
			socket.emit('test', 'test reply from the socket server');
		});

		socket.on('disconnect', () => {
			console.log(`❌ Client disconnected: ${socket.id}`);
		});
	});
}
