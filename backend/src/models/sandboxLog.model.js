import mongoose from 'mongoose';

const sandboxLogSchema = new mongoose.Schema({
	chatId: {
		type: String,
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

const sandboxLogModel = mongoose.model('SandboxLog', sandboxLogSchema);

export default sandboxLogModel;
