import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.config.js';

const getToken = (id, name, email) => {
	const token = jwt.sign({ id, name, email }, JWT_SECRET, { expiresIn: '30d' });
	return token;
};
export default getToken;
