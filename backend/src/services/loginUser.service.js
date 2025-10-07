import bcrypt from 'bcrypt';

import UserModel from '../models/auth.model.js';
import customError from '../utils/customError.util.js';

export const loginUserService = async (email, password) => {
	const user = await UserModel.findOne({ email: email.toLowerCase() }).select('+password');

	if (!user) throw customError(401, 'email or password incorrect!');

	const decodeUser = await bcrypt.compare(password, user.password);
	if (!decodeUser) throw customError(401, 'email or password incorrect!');

	return user;
};
