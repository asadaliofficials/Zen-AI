import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.config.js';

const getToken = (id, email) => {
	const token = jwt.sign({ id, email }, JWT_SECRET, { expiresIn: '30d' });
	return token;
};
export default getToken;
