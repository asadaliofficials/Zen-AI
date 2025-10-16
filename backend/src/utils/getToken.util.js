import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import {JWT_SECRET} from '../config/env.config.js';
const getTokenFromSocket = socket => {
	try {
		const cookieHeader = socket.handshake.headers.cookie;
		if (!cookieHeader) return null;

		const cookies = cookie.parse(cookieHeader);
		const token = cookies['token'];
		if (!token) return null;

		const decoded = jwt.verify(token, JWT_SECRET);
		return decoded?.id || null;
	} catch (error) {
		console.error('JWT Error:', error);
		return null;
	}
};

export default getTokenFromSocket;
