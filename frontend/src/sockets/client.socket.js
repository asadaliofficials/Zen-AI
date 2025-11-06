// src/socket.js
import { io } from 'socket.io-client';
import { REACT_ENV } from '../constants/react.js';

const SERVER_URL = REACT_ENV === 'development' ? 'http://localhost:3000' : 'https://zen-ai.up.railway.app'; // change to your server

// 🧪 Guest /sandbox namespace
export const sandboxSocket = io(`${SERVER_URL}/sandbox`, {
	transports: ['websocket'],
	autoConnect: false,
});

// const isTemp = window.location.search.includes("temporary=true");

// ⚡ Authenticated /user namespace
export const userSocket = io(`${SERVER_URL}/user`, {
	transports: ['websocket'],

	// query: {
	//   temp: isTemp,
	// },
	withCredentials: true,
	autoConnect: false,
});
