import cookie from 'cookie';
import jwt from 'jsonwebtoken';
const getTokenFromSocket = socket => {
	try {
		const cookieHeader = socket.handshake.headers.cookie;
		if (!cookieHeader) return socket.emit('responce', { message: 'unauthorized' });

		const cookies = cookie.parse(cookieHeader);
		const token = cookies['token'];
		if (!token) return socket.emit('responce', { message: 'unauthorized' });

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (!decoded) return socket.emit('responce', { message: 'unauthorized' });
		return decoded.id;
	} catch (error) {
		console.log(error);
	}
};

export default getTokenFromSocket;
