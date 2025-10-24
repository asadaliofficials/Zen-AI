// validators/messageValidator.js

export function messageValidator(message, chatId) {
	const errors = [];

	if (typeof message !== 'string' || !message.trim()) {
		errors.push({ field: 'message', message: 'Message is required' });
	} else if (message.length < 1 || message.length > 10000) {
		errors.push({ field: 'message', message: 'Message must be between 1 and 10000 characters' });
	}

	const isMongoId = /^[a-f\d]{24}$/i.test(chatId);
	const isNullValue = chatId === null || chatId === 'null';

	if (!isNullValue && !isMongoId) {
		errors.push({ field: 'chatId', message: 'Invalid Chat Id' });
	}

	return errors;
}
