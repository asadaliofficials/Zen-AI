// validators/messageValidator.js

export function messageValidator(message, chatID) {
	const errors = [];

	if (typeof message !== 'string' || !message.trim()) {
		errors.push({ field: 'message', message: 'Message is required' });
	} else if (message.length < 1 || message.length > 1000) {
		errors.push({ field: 'message', message: 'Message must be between 1 and 1000 characters' });
	}

	const isMongoId = /^[a-f\d]{24}$/i.test(chatID);
	if (!chatID || !isMongoId) {
		errors.push({ field: 'chatID', message: 'Invalid or missing Chat ID' });
	}

	return errors;
}
