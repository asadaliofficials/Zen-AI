import gemini from '../config/gemini.config.js';
import customError from '../utils/customError.util.js';
const geminiService = async msg => {
	try {
		const response = await gemini.models.generateContent({
			model: 'gemini-2.0-flash',
			contents: msg,
		});
		return response.text;
	} catch (error) {
		throw customError(500, error.message || 'Gemini API Error');
	}
};

export default geminiService;
