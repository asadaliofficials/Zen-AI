import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
	chatId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'chats',
		// required: true,
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users',
		required: true,
	},
	userMessage: {
		type: String,
		required: true,
	},
	aiResponse: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const messageModel = mongoose.model('Message', messageSchema);

export default messageModel;
