import { generalInstructions } from '../constants/ai.constant.js';
import chatModel from '../models/chat.model.js';
import messageModel from '../models/message.model.js';
import sandboxLogModel from '../models/sandboxLog.model.js';
import { createChat, deleteChat, saveDeletes } from '../services/db.service.js';
import geminiService from '../services/gemini.service.js';

export const getAllChatsController = async (req, res) => {
	const { id: userId } = req.user;
	try {
		const chats = await chatModel.find({ userId }).sort({ createdAt: -1 }).select('-userId');
		return res.status(200).json({
			success: true,
			user: { userName: req.user.name, userEmail: req.user.email, userId: req.user.id },
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

export const chatController = async (socket, msg, chatId, userId, isNewChat, tempChat) => {
	try {
		const contents = [];
		contents.push({
			role: 'user',
			parts: [
				{
					text: generalInstructions,
				},
			],
		});

		if (!isNewChat) {
			let response;
			if (!tempChat) {
				response = (
					await messageModel.find({ chatId: chatId }).sort({ createdAt: -1 }).limit(10)
				).reverse();
			} else {
				response = (
					await sandboxLogModel.find({ chatId: chatId }).sort({ createdAt: -1 }).limit(10)
				).reverse();
			}

			if (response.length > 0) {
				response.forEach(item => {
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
							'After responding to the user query, also generate a short, relevant title for this conversation in English only (maximum 5 words).' +
							' Respond in this exact format:\n\n' +
							'### Response:\n<your response here>\n\n' +
							'### Title:\n<your short title here>',
					},
				],
			});
		}

		const { text, title } = await geminiService(contents, isNewChat);

		// If it's a new chat, create it and get the chatId
		if (isNewChat && !tempChat) {
			const newChat = await createChat(title || 'New Chat', userId);
			chatId = newChat._id;
		}
		if (!tempChat) {
			await messageModel.create({
				chatId: chatId,
				userId: userId,
				userMessage: msg,
				aiResponse: text,
			});
		} else {
			await sandboxLogModel.create({
				chatId: chatId,
				userMessage: msg,
				aiResponse: text,
			});
		}
		socket.emit('response', {
			success: true,
			message: 'Response generated successfully',
			statusCode: 200,
			isNewChat: isNewChat,
			tempChat: tempChat || false,
			content: {
				text,
				chatId,
				...(title && { title }),
			},
		});
	} catch (error) {
		socket.emit('response', {
			success: false,
			message: 'AI Model is overloaded, Please try again later!',
			statusCode: 503,
		});
		console.error('Error in chatController:', error);
	}
};

export const sandboxChatController = async (socket, msg, chatId) => {
	try {
		const contents = [];

		contents.push({
			role: 'user',
			parts: [
				{
					text: generalInstructions,
				},
			],
		});

		const response = (
			await sandboxLogModel.find({ chatId: chatId }).sort({ createdAt: -1 }).limit(10)
		).reverse();

		if (response.length > 0) {
			response.forEach(item => {
				contents.push({ role: 'user', parts: [{ text: item.userMessage }] });
				contents.push({ role: 'model', parts: [{ text: item.aiResponse }] });
			});
		}

		contents.push({ role: 'user', parts: [{ text: msg }] });

		const { text, title } = await geminiService(contents);

		await sandboxLogModel.create({
			chatId: chatId,
			userMessage: msg,
			aiResponse: text,
		});
		socket.emit('response', {
			success: true,
			message: 'ai responded successfully',
			content: { text, chatId },
		});
	} catch (error) {
		socket.emit('response', {
			success: false,
			message: 'AI Model is overloaded.',
			chatId,
		});
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

export const chatMessagesController = async (req, res) => {
	const { id } = req.params;
	const { id: userId, name } = req.user;
	// get start index from query params
	const start = parseInt(req.query.start) || 0;
	const limit = 20; // fixed limit for pagination

	try {
		// Verify chat ownership
		const chat = await chatModel.findOne({ _id: id, userId }).select('title');
		if (!chat) return res.status(404).json({ message: 'Chat not found or unauthorized' });

		const messages = await messageModel
			.find({ chatId: id })
			.sort({ createdAt: -1 })
			.skip(start)
			.limit(limit + 1);
		const hasMore = messages.length > limit;
		const contents = hasMore ? messages.slice(0, limit) : messages;

		return res.status(200).json({
			chat: { id: chat._id, title: chat.title, author: name },
			messages: {
				contents: contents.reverse(), // reverse to maintain chronological order
				count: messages.length,
				hasMore: hasMore,
			},
		});
	} catch (error) {
		return res
			.status(error.statusCode || 500)
			.json({ message: error.message || 'Internal server error' });
	}
};
