import chatModel from '../models/chat.model.js';
import messageModel from '../models/message.model.js';
import { createChat, deleteChat, saveDeletes } from '../services/db.service.js';
import geminiService from '../services/gemini.service.js';

export const getAllChatsController = async (req, res) => {
	const { id: userId } = req.user;
	try {
		const chats = await chatModel.find({ userId }).sort({ createdAt: -1 }).select('-userId');
		return res.status(200).json({
			user: { userName: req.user.name, userEmail: req.user.email },
			chats: {
				contents: chats,
				count: chats.length,
			},
		});
	} catch (error) {
		return res
			.status(error.statusCode || 500)
			.json({ message: error.message || 'Internal server error' });
	}
};

export const chatController = async (socket, msg, chatId, userId, isNewChat) => {
	try {
		const contents = [];

		if (!isNewChat) {
			const responce = (
				await messageModel.find({ chatId: chatId }).sort({ createdAt: -1 }).limit(10)
			).reverse();

			if (responce.length > 0) {
				responce.forEach(item => {
					contents.push({ role: 'user', parts: [{ text: item.userMessage }] });
					contents.push({ role: 'model', parts: [{ text: item.aiResponse }] });
				});
			}
		}

		// Add current user message
		contents.push({ role: 'user', parts: [{ text: msg }] });

		// Add system prompt for title generation if it's a new chat
		if (isNewChat) {
			contents.unshift({
				role: 'user',
				parts: [
					{
						text:
							'After responding to the user query, also generate a short, relevant title for this conversation (maximum 5 words).' +
							' Respond in this exact format:\n\n' +
							'### Response:\n<your response here>\n\n' +
							'### Title:\n<your short title here>',
					},
				],
			});
		}

		const { text, title } = await geminiService(contents, isNewChat);

		// If it's a new chat, create it and get the chatId
		if (isNewChat) {
			const newChat = await createChat(title || 'New Chat', userId);
			chatId = newChat._id;
		}
		await messageModel.create({
			chatId: chatId,
			userId: userId,
			userMessage: msg,
			aiResponse: text,
		});
		socket.emit('responce', title ? { text, title } : { text });
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
