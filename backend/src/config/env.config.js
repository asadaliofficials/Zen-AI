import { configDotenv } from 'dotenv';
configDotenv();
export const { PORT, MONGODB_URI, JWT_SECRET, NODE_ENV, GEMINI_API_KEY, PINECONE_API_KEY } =
	process.env;
