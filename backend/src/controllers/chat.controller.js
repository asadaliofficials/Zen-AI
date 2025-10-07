import messageModel from '../models/message.model.js';
import geminiService from '../services/gemini.service.js';

export const chatController = async (socket, msg, id) => {
	try {
		const responce = await messageModel.find({ chatId: id });

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
