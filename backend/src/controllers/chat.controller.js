import { generalInstructions } from '../constants/ai.constant.js';
import chatModel from '../models/chat.model.js';
import messageModel from '../models/message.model.js';
import sandboxLogModel from '../models/sandboxLog.model.js';
import { createChat, deleteChat, saveDeletes } from '../services/db.service.js';
import geminiService, { generateVectors } from '../services/gemini.service.js';
import { addVectors, searchVectors } from '../services/vectors.service.js';

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
		const contents = [
			{
				role: 'user',
				parts: [{ text: generalInstructions }],
			},
		];

		// Add title prompt for new permanent chats
		if (isNewChat && !tempChat) {
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

		const fetchedMessagesIds = [];

		// Fetch previous messages for context
		if (!isNewChat) {
			const model = tempChat ? sandboxLogModel : messageModel;
			const recentMessages = (
				await model.find({ chatId }).sort({ createdAt: -1 }).limit(5).lean()
			).reverse();

			recentMessages.forEach(item => {
				contents.push({ role: 'user', parts: [{ text: item.userMessage }] });
				contents.push({ role: 'model', parts: [{ text: item.aiResponse }] });
				fetchedMessagesIds.push(item._id.toString());
			});
		}

		let userMessageVectors;
		if (!tempChat) {
			// Generate user vector
			userMessageVectors = await generateVectors(msg);

			// Search for similar messages in Pinecone
			const similarMessages = await searchVectors(userMessageVectors, 5, { userId });
			const SIMILARITY_THRESHOLD = 0.5;

			const relevantMessages = similarMessages
				.filter(item => item.score >= SIMILARITY_THRESHOLD)
				.sort((a, b) => b.score - a.score)
				.slice(0, 2);

			relevantMessages.forEach(item => {
				if (!fetchedMessagesIds.includes(item.metadata.messageId)) {
					contents.push({
						role: item.metadata.role,
						parts: [
							{ text: `Context memory:\n${item.metadata.text}\nUse this context if relevant.` },
						],
					});
				}
			});
		}

		contents.push({ role: 'user', parts: [{ text: msg }] });

		const { text, title } = await geminiService(contents, isNewChat);

		// Create chat if new permanent chat
		if (isNewChat && !tempChat) {
			const newChat = await createChat(title || 'New Chat', userId);
			chatId = newChat._id;
		}

		let newMessage;
		if (!tempChat) {
			newMessage = await messageModel.create({
				chatId,
				userId,
				userMessage: msg,
				aiResponse: text,
				loved: false,
			});
		} else {
			await sandboxLogModel.create({ chatId, userMessage: msg, aiResponse: text });
		}

		socket.emit('response', {
			success: true,
			message: 'Response generated successfully',
			id: newMessage?._id,
			loved: false,
			statusCode: 200,
			isNewChat,
			tempChat: tempChat || false,
			content: { text, chatId, ...(title && { title }) },
		});

		// Save vectors in Pinecone for permanent chats
		if (!tempChat) {
			const aiResponseVectors = await generateVectors(text);
			const userMeta = { chatId, messageId: newMessage._id, userId, role: 'user', text: msg };
			const aiMeta = { chatId, messageId: newMessage._id, userId, role: 'model', text };

			await Promise.all([
				addVectors(`${newMessage._id}-user`, userMeta, userMessageVectors),
				addVectors(`${newMessage._id}-ai`, aiMeta, aiResponseVectors),
			]);
		}
	} catch (error) {
		socket.emit('response', {
			success: false,
			message: error.message.includes('Pinecone')
				? 'Memory service unavailable.'
				: 'AI model is busy. Please try again later.',
			statusCode: 503,
		});
		console.error('Error in chatController:', error);
	}
};

export const messageLoveController = async (req, res) => {
	const { id } = req.params;
	const { id: userId } = req.user;

	try {
		const message = await messageModel.findOne({ _id: id, userId });
		if (message) {
			message.loved = !message.loved;
			await message.save();
			return res
				.status(200)
				.json({ success: true, message: 'Message loved status updated', loved: message.loved });
		} else {
			return res.status(404).json({ success: false, message: 'Message not found' });
		}
	} catch (error) {
		return res
			.status(error.statusCode || 500)
			.json({ message: error.message || 'Internal server error' });
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
			await sandboxLogModel.find({ chatId: chatId }).sort({ createdAt: -1 }).limit(10).lean()
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

	return res.status(200).json({ success: true, message: 'Chat and messages deleted', id });
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
		if (!chat)
			return res
				.status(404)
				.json({ success: false, statusCode: 404, message: 'Chat not found or unauthorized' });

		const messages = await messageModel
			.find({ chatId: id })
			.sort({ createdAt: -1 })
			.skip(start)
			.limit(limit + 1)
			.lean();
		const hasMore = messages.length > limit;
		const contents = hasMore ? messages.slice(0, limit) : messages;

		return res.status(200).json({
			success: true,
			statusCode: 200,
			chat: { id: chat._id, title: chat.title, author: name },
			messages: {
				contents: contents.reverse(),
				count: contents.length,
				hasMore: hasMore,
			},
		});
	} catch (error) {
		return res
			.status(error.statusCode || 500)
			.json({ success: false, statusCode: 500, message: error.message || 'Internal server error' });
	}
};
export const getChatMessagesController = async (req, res) => {
	const { id } = req.params;
	const start = parseInt(req.query.start) || 0;
	const limit = 20; // fixed limit for pagination

	try {
		// Verify chat ownership
		const chat = await chatModel.findOne({ _id: id }).select('title');
		if (!chat)
			return res
				.status(404)
				.json({ success: false, statusCode: 404, message: 'Chat not found or unauthorized' });

		const messages = await messageModel
			.find({ chatId: id })
			.sort({ createdAt: -1 })
			.skip(start)
			.limit(limit + 1)
			.lean();
		const hasMore = messages.length > limit;
		const contents = hasMore ? messages.slice(0, limit) : messages;

		return res.status(200).json({
			success: true,
			statusCode: 200,
			chat: { id: chat._id, title: chat.title },
			messages: {
				contents: contents.reverse(), // reverse to maintain chronological order
				count: contents.length,
				hasMore: hasMore,
			},
		});
	} catch (error) {
		return res
			.status(error.statusCode || 500)
			.json({ success: false, statusCode: 500, message: error.message || 'Internal server error' });
	}
};
export const getOneMessageController = async (req, res) => {
	const { id } = req.params;

	try {
		const message = await messageModel.findOne({ _id: id });

		if (!message)
			return res
				.status(404)
				.json({ success: false, statusCode: 404, message: 'Message not found or unauthorized' });

		return res.status(200).json({
			success: true,
			statusCode: 200,
			messages: {
				contents: {
					userMessage: message.userMessage,
					aiResponse: message.aiResponse,
					loved: message.loved,
					id: message._id,
				},
			},
		});
	} catch (error) {
		return res
			.status(error.statusCode || 500)
			.json({ success: false, statusCode: 500, message: error.message || 'Internal server error' });
	}
};
