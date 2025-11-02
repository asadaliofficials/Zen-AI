import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../config/env.config.js';

const authMiddleware = (req, res, next) => {
	const { token } = req.cookies;

	if (!token) {
		return res
			.status(401)
			.json({ success: false, statusCode: 401, message: 'Authorization token not found' });
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		req.user = {
			id: decoded.id,
			name: decoded.name,
			email: decoded.email,
		};

		next();
	} catch (error) {
		console.error('JWT verification error:', error.message);
		return res.status(401).json({ success: false, statusCode: 401, message: 'Invalid token' });
	}
};
export default authMiddleware;
