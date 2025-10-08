import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
	{
		userID: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		title: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{ timestamps: true }
);
const chatModel = mongoose.model('chats', chatSchema);

export default chatModel;
