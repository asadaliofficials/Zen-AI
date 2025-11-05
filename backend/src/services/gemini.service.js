import gemini from '../config/gemini.config.js';
import customError from '../utils/customError.util.js';

const geminiService = async (contents, isNewChat) => {
	try {
		const response = await gemini.models.generateContent({
			model: 'gemini-2.0-flash',
			contents,
		});

		const fullText = response.text;

		// Regex to match both parts
		if (!isNewChat) {
			return { text: fullText, title: null };
		}
		const match = fullText.match(/### Response:\s*([\s\S]*?)\s*### Title:\s*(.+)/i);

		const text = match?.[1]?.trim() || fullText;
		const title = match?.[2]?.trim() || null;

		return {
			text,
			title,
		};
	} catch (error) {
		throw customError(500, error.message || 'Gemini API Error');
	}
};

export const generateVectors = async contents => {

	try {
		const response = await gemini.models.embedContent({
			model: 'gemini-embedding-001',
			contents,
			config: {
				outputDimensionality: 768,
			},
		});

		// Return the actual embedding vector
		return response.embeddings[0].values;
	} catch (err) {
		console.error('Embedding error:', err);
		throw err;
	}
};

export default geminiService;
