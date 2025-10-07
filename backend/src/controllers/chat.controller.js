import messageModel from '../models/message.model.js';
import geminiService from '../services/gemini.service.js';

export const chatController = async (socket, msg) => {
	try {
		const responce = await geminiService(msg);
    const chat = messageModel.create({
      chatId: "64b8f3f4c9e77b6f8c8e4d2a",
      userId: "64b8f3f4c9e77b6f8c8e4d2b",
      userMessage: msg,
      aiResponse: responce,
    });
		socket.emit('responce', responce);
	} catch (error) {
    console.error('Error in chatController:', error);
  }
};
