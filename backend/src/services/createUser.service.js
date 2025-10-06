import bcrypt from 'bcrypt';

import UserModel from '../../models/auth.model.js';

export const createUser = async ({ name, email, password }) => {
	const hashedPassword = bcrypt.hash(password, 10);
	// You can add extra logic here, like:
	// - Hashing password
	// - Checking if user exists
	// - More complex validations or side effects
	const user = await UserModel.create({ name, email, password: hashedPassword });
	return user;
};
