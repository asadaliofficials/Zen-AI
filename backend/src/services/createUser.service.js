import bcrypt from 'bcrypt';

import UserModel from '../../models/auth.model.js';

export const createUser = async (name, email, password, res) => {
	const hashedPassword = await bcrypt.hash(password, 10);

	// - Checking if user exists
	const isUserExists = await UserModel.findOne({ email: email.toLowerCase() });

	if (isUserExists) return res.status(409).json({ message: 'email already registered' });

	const user = await UserModel.create({ name, email, password: hashedPassword });
	return user;
};
