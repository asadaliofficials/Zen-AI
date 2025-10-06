import { configDotenv } from 'dotenv';
configDotenv();
export const { PORT, MONGODB_URI, JWT_SECRET, NODE_ENV } = process.env;
