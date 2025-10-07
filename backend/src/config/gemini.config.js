import { GoogleGenAI } from '@google/genai';
import { configDotenv } from 'dotenv';
configDotenv();
// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const gemini = new GoogleGenAI({});

export default gemini;
