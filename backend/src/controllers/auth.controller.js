import { createUser, deleteUser, saveDeletes } from '../services/db.service.js';
import getToken from '../utils/jwtToken.util.js';
import { NODE_ENV } from '../config/env.config.js';
import { loginUserService } from '../services/db.service.js';
import chatModel from '../models/chat.model.js';
import messageModel from '../models/message.model.js';

export const registerController = async (req, res) => {
	const { name, email, password } = req.body;

	try {
		const user = await createUser(name, email, password);
		const token = getToken(user._id, user.name, user.email);

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
		const token = getToken(user._id, user.name, user.email);

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

export const deleteUserController = async (req, res) => {
	const { id: userId } = req.params;

	try {
		const deleteLogs = [];

		// 1. Delete user
		const deletedUser = await deleteUser(userId);
		if (deletedUser) {
			deleteLogs.push({
				type: 'user',
				deletedBy: userId,
				originalId: deletedUser._id,
				data: deletedUser.toObject(),
				deletedAt: new Date(),
			});
		}

		// 2. Get all user's chats
		const chats = await chatModel.find({ userId });
		if (chats.length > 0) {
			// Add deleted chat logs
			for (const chat of chats) {
				deleteLogs.push({
					type: 'chat',
					deletedBy: userId,
					originalId: chat._id,
					data: chat.toObject(),
					deletedAt: new Date(),
				});
			}

			// 3. Get and log messages from each chat
			for (const chat of chats) {
				const messages = await messageModel.find({ chatId: chat._id });

				if (messages.length > 0) {
					for (const msg of messages) {
						deleteLogs.push({
							type: 'message',
							deletedBy: userId,
							originalId: msg._id,
							data: msg.toObject(),
							deletedAt: new Date(),
						});
					}

					// Delete messages
					await messageModel.deleteMany({ chatId: chat._id });
				}
			}

			// Delete all chats
			await chatModel.deleteMany({ userId });
		}

		// 4. Save all deletes at once
		await saveDeletes('batch', deleteLogs); // 'batch' is just a placeholder type; it will be ignored internally

		return res.status(200).json({
			message: 'User and all associated data deleted successfully',
			user: deletedUser,
		});
	} catch (error) {
		console.error('Error deleting user and related data:', error);
		return res
			.status(error.statusCode || 500)
			.json({ message: error.message || 'Internal server error' });
	}
};
