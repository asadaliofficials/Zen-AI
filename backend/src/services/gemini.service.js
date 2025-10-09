import gemini from '../config/gemini.config.js';
import customError from '../utils/customError.util.js';
const geminiService = async (contents) => {
	try {

		const response = await gemini.models.generateContent({
			model: 'gemini-2.0-flash',
			contents,
		});

		const fullText = response.text;

		// Regex to match both parts
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

export default geminiService;
