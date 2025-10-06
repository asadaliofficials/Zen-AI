import mongoose from 'mongoose';

import { MONGODB_URI } from './env.config.js';

const connectToDB = () => {
	mongoose
		.connect(MONGODB_URI)
		.then(() => console.log('MongoDB connected'))
		.catch(err => console.error('MongoDB connection error:', err));
};

export default connectToDB;
