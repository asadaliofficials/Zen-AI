import chatModel from '../models/chat.model.js';
import messageModel from '../models/message.model.js';
import { createChat, deleteChat, saveDeletes } from '../services/db.service.js';
import geminiService from '../services/gemini.service.js';

export const getAllChatsController = async (req, res) => {
	const { id: userId } = req.user;
	try {
		const chats = await chatModel.find({ userId }).sort({ createdAt: -1 });
		return res.status(200).json({ chats });
	} catch (error) {
		return res
			.status(error.statusCode || 500)
			.json({ message: error.message || 'Internal server error' });
	}
};

export const chatController = async (socket, msg, id) => {
	try {
		const responce = (
			await messageModel.find({ chatId: id }).sort({ createdAt: -1 }).limit(10)
		).reverse();

		const contents = [];

		if (responce.length > 0) {
			responce.forEach(item => {
				contents.push({ role: 'user', parts: [{ text: item.userMessage }] });
				contents.push({ role: 'model', parts: [{ text: item.aiResponse }] });
			});
		}

		contents.push({ role: 'user', parts: [{ text: msg }] });

		const aiResponce = await geminiService(contents);
		const chat = messageModel.create({
			chatId: id,
			userId: '64b8f3f4c9e77b6f8c8e4d2b',
			userMessage: msg,
			aiResponse: aiResponce,
		});
		socket.emit('responce', aiResponce);
	} catch (error) {
		console.error('Error in chatController:', error);
	}
};

export const createChatController = async (req, res) => {
	const { title } = req.body;
	const { id } = req.user;

	try {
		const newChat = await createChat(title, id);
		return res.status(201).json({ message: 'Chat created successfully', chat: newChat });
	} catch (error) {
		return res
			.status(error.statusCode || 500)
			.json({ message: error.message || 'Internal server error' });
	}
};

export const deleteChatController = async (req, res) => {
	const { id } = req.params;
	const { id: userId } = req.user;

	// Delete chat and log
	const deletedChat = await deleteChat(id, userId);
	if (deletedChat) {
		deletedChat.userId = userId; // Attach userId for logging
		await saveDeletes('chat', deletedChat);
	}

	// Fetch and delete messages
	const messagesToDelete = await messageModel.find({ chatId: id });
	if (messagesToDelete.length > 0) {
		// Add userId to each message
		const enrichedMessages = messagesToDelete.map(msg => ({
			...msg.toObject(),
			userId,
		}));

		await saveDeletes('message', enrichedMessages);
		await messageModel.deleteMany({ chatId: id });
	}

	return res.status(200).json({ message: 'Chat and messages deleted', id });
};
