import bcrypt from 'bcrypt';

import UserModel from '../models/auth.model.js';
import customError from '../utils/customError.util.js';

export const createUser = async (name, email, password) => {
	const isUserExists = await UserModel.findOne({ email: email.toLowerCase() });
	if (isUserExists) throw customError(409, 'email already registered');

	const hashedPassword = await bcrypt.hash(password, 10);
	const user = await UserModel.create({ name, email, password: hashedPassword });
	return user;
};
