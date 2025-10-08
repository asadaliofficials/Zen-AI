import mongoose from 'mongoose';

const deleteLogSchema = new mongoose.Schema({
	type: {
		type: String,
		enum: ['chat', 'message', 'user'],
		required: true,
	},
	deletedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User', // Assuming you have a User model
		required: true,
	},
	deletedAt: {
		type: Date,
		default: Date.now,
	},
	originalId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
	data: {
		type: Object,
		required: true,
	},
});

const DeleteLogModel =  mongoose.model('DeleteLog', deleteLogSchema);

export default DeleteLogModel;