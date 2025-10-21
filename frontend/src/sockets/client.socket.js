// src/socket.js
import { io } from 'socket.io-client';

const SERVER_URL = 'http://localhost:3000'; // change to your server

// 🧪 Guest /sandbox namespace
export const sandboxSocket = io(`${SERVER_URL}/sandbox`, {
	transports: ['websocket'],
});

// ⚡ Authenticated /user namespace
export const userSocket = io(`${SERVER_URL}/user`, {
	transports: ['websocket'],

	query: {
		temp: false,
	},
	withCredentials: true,
	autoConnect: false,
});
