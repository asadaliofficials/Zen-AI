import { createUser } from '../services/createUser.service.js';
import getToken from '../utils/jwtToken.util.js';
import { NODE_ENV } from '../config/env.config.js';

export const authController = async (req, res) => {
	const { name, email, password } = req.body;

	try {
		const user = await createUser(name, email, password, res);
		console.log(user);
		const token = getToken(user._id, user.email);

		res.cookie('token', token, {
			httpOnly: true,
			secure: NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
		});

		res
			.status(201)
			.json({ message: 'account created successfully', email: user.email, name: user.name });
	} catch (error) {
		res.status(500).json({ message: 'Error while creating your account, please try again later!' });
	}
};
