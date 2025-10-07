import gemini from '../config/gemini.config.js';
const geminiService = async msg => {
	const response = await gemini.models.generateContent({
		model: 'gemini-2.0-flash',
		contents: msg,
	});
	return response.text;
};

export default geminiService;
