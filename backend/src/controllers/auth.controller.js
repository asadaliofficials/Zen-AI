import { createUser } from '../services/db.service.js';
import getToken from '../utils/jwtToken.util.js';
import { NODE_ENV } from '../config/env.config.js';
import { loginUserService } from '../services/db.service.js';

export const registerController = async (req, res) => {
	const { name, email, password } = req.body;

	try {
		const user = await createUser(name, email, password);
		const token = getToken(user._id);

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
		res.status(error.statusCode || 500).json({ message: error.message || 'Something went wrong' });
	}
};

export const loginController = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await loginUserService(email, password);
		const token = getToken(user._id);

		res.cookie('token', token, {
			httpOnly: true,
			secure: NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
		});

		res.status(200).json({ message: 'loggedin successfully', email: user.email, name: user.name });
	} catch (error) {
		res.status(error.statusCode || 500).json({ message: error.message || 'Something went wrong' });
	}
};

export const logoutController = (_, res) => {
	res.clearCookie('token', {
		httpOnly: true,
		secure: NODE_ENV === 'production',
		sameSite: 'strict',
	});

	res.status(200).json({ message: 'Logged out successfully' });
};
