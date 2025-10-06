// validators/authValidator.js
import { body } from('express-validator');

export const registerValidationMiddleware = [
	body('name')
		.trim()
		.notEmpty()
		.withMessage('Name is required')
		.isLength({ min: 3 })
		.withMessage('Name must be at least 3 characters'),

	body('email')
		.trim()
		.notEmpty()
		.withMessage('Email is required')
		.isEmail()
		.withMessage('Invalid email address')
		.normalizeEmail(),

	body('password')
		.trim()
		.notEmpty()
		.withMessage('Password is required')
		.isLength({ min: 6 })
		.withMessage('Password must be at least 6 characters'),
];
