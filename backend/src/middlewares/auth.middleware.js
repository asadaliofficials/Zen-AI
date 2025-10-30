import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../config/env.config.js';

const authMiddleware = (req, res, next) => {
	console.log('req comes in auth middleware');

	const { token } = req.cookies;
	if (!token) {
		return res.status(401).json({ success: false, statusCode: 401, message: 'Unauthorized' });
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
		return res.status(401).json({ success: false, statusCode: 401, message: 'Unauthorized' });
	}
};
export default authMiddleware;
