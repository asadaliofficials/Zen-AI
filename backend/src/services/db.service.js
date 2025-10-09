import bcrypt from 'bcrypt';

import userModel from '../models/auth.model.js';
import customError from '../utils/customError.util.js';
import chatModel from '../models/chat.model.js';
import DeleteLogModel from '../models/deleteLog.model.js';

export const createUser = async (name, email, password) => {
	const isUserExists = await userModel.findOne({ email: email.toLowerCase() });
	if (isUserExists) throw customError(409, 'email already registered');

	const hashedPassword = await bcrypt.hash(password, 10);
	const user = await userModel.create({ name, email, password: hashedPassword });
	return user;
};

export const loginUserService = async (email, password) => {
	const user = await userModel.findOne({ email: email.toLowerCase() }).select('+password');

	if (!user) throw customError(401, 'email or password incorrect!');

	const decodeUser = await bcrypt.compare(password, user.password);
	if (!decodeUser) throw customError(401, 'email or password incorrect!');

	return user;
};

export const createChat = async (title, userId) => {
	try {
		const chat = await chatModel.create({ title, userId });
		return chat;
	} catch (error) {
		throw customError(500, 'MongoDB error');
	}
};

export const deleteChat = async (chatId, userId) => {
	try {
		const chat = await chatModel.findOneAndDelete({ _id: chatId, userId });
		if (!chat) throw customError(404, 'Chat not found or unauthorized');
		return chat;
	} catch (error) {
		throw customError(500, 'MongoDB error');
	}
};

export const deleteUser = async userId => {
	try {
		const user = await userModel.findOneAndDelete({ _id: userId });
		if (!user) throw customError(404, 'User not found or unauthorized');
		return user;
	} catch (error) {
		throw customError(500, 'MongoDB error');
	}
};

export const saveDeletes = async (type, data) => {
	try {
		if (!data) return;

		// Handle array of documents
		if (Array.isArray(data)) {
			if (data.length === 0) return;

			const logs = data.map(item => ({
				type: item.type || type, // use item's type if available
				deletedBy: item.deletedBy,
				originalId: item.originalId,
				data: item.data,
				deletedAt: item.deletedAt || new Date(),
			}));

			return await DeleteLogModel.insertMany(logs);
		}

		// Single document
		return await DeleteLogModel.create({
			type: data.type || type,
			deletedBy: data.deletedBy,
			originalId: data.originalId,
			data: data.data,
			deletedAt: data.deletedAt || new Date(),
		});
	} catch (error) {
		console.error('Failed to save delete log:', error);
	}
};
