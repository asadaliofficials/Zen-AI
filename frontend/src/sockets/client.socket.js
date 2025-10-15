// src/socket.js
import { io } from 'socket.io-client';

const SERVER_URL = 'http://localhost:3000'; // change to your server

// ⚡ Authenticated /user namespace
export const userSocket = token =>
	io(`${SERVER_URL}/user`, {
		transports: ['websocket'],
		auth: {
			token,
		},
		query: {
			temp: false, // optional query param if needed
		},
	});

// 🧪 Guest /sandbox namespace
export const sandboxSocket = io(`${SERVER_URL}/sandbox`, {
	transports: ['websocket'],
});
