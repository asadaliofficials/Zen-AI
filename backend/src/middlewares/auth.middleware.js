import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../config/env.config.js';

const authMiddleware = (req, res, next) => {
	const { token } = req.cookies;
	if (!token) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	try {
		const decoded = jwt.verify(token, JWT_SECRET);
		res.json({
			decoded,
		});
	} catch (error) {
		return res.status(401).json({ message: error.message || 'Unauthorized' });
	}
};
export default authMiddleware;
