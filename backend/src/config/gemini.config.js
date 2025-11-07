import { GoogleGenAI } from '@google/genai';
import { configDotenv } from 'dotenv';
configDotenv();

const gemini = new GoogleGenAI({});

export default gemini;
