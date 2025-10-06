import jwt from 'jsonwebtoken'

import { createUser } from '../services/createUser.service.js';
import { JWT_SECRET } from '../config/env.config.js';

export const authController = async (req, res) => {
	const { name, email, password } = req.body;

	const user = await createUser(name, email, password);

	cost token = jwt.sign()


	res.status(200).json({ message: 'all data recieved.', data: { name, email, password } });
};
