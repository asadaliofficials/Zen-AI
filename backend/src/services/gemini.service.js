import gemini from '../config/gemini.config.js';
import customError from '../utils/customError.util.js';
const geminiService = async (contents, isNewChat) => {
	try {
		// Add instruction if it's a new chat
		if (isNewChat) {
			contents.unshift({
				role: 'user',
				parts: [
					{
						text:
							'After responding to the user query, also generate a short, relevant title for this conversation (maximum 5 words).' +
							' Respond in this exact format:\n\n' +
							'### Response:\n<your response here>\n\n' +
							'### Title:\n<your short title here>',
					},
				],
			});
		}

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
