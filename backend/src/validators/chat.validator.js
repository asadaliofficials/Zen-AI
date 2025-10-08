// validators/authValidator.js
import { body } from 'express-validator';

export const chatValidator = [
	body('title')
		.trim()
		.notEmpty()
		.withMessage('title is required')
		.isLength({ min: 6 })
		.withMessage('title must be at least 6 characters')
		.isLength({ max: 100 }),
];
