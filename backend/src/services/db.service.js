import bcrypt from 'bcrypt';

import UserModel from '../models/auth.model.js';
import customError from '../utils/customError.util.js';
import chatModel from '../models/chat.model.js';
import DeleteLogModel from '../models/deleteLog.model.js';

export const createUser = async (name, email, password) => {
	const isUserExists = await UserModel.findOne({ email: email.toLowerCase() });
	if (isUserExists) throw customError(409, 'email already registered');

	const hashedPassword = await bcrypt.hash(password, 10);
	const user = await UserModel.create({ name, email, password: hashedPassword });
	return user;
};

export const loginUserService = async (email, password) => {
	const user = await UserModel.findOne({ email: email.toLowerCase() }).select('+password');

	if (!user) throw customError(401, 'email or password incorrect!');

	const decodeUser = await bcrypt.compare(password, user.password);
	if (!decodeUser) throw customError(401, 'email or password incorrect!');

	return user;
};

export const createChat = async (title, userId) => {
	try {
		const user = await chatModel.create({ title, userId });
		return user;
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



export const saveDeletes = async (type, data) => {
	try {
		if (!data) return;

		// Handle array of documents
		if (Array.isArray(data)) {
			if (data.length === 0) return;

			const logs = data.map(item => ({
				type,
				deletedBy: item.userId || item.deletedBy, // support either key
				originalId: item._id,
				data: item.toObject ? item.toObject() : item,
				deletedAt: new Date(),
			}));

			return await DeleteLogModel.insertMany(logs);
		}

		// Handle single document
		const log = await DeleteLogModel.create({
			type,
			deletedBy: data.userId || data.deletedBy,
			originalId: data._id,
			data: data.toObject ? data.toObject() : data,
			deletedAt: new Date(),
		});

		return log;
	} catch (error) {
		console.error("Failed to save delete log:", error);
	}
};
