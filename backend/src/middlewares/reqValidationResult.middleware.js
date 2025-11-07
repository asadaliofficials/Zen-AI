import { validationResult } from 'express-validator';

export const reqValidationResult = (req, res, next) => {
	const errors = validationResult(req);
	if (errors.isEmpty()) return next();

	res.status(422).json({
		success: false,
		statusCode: 422,
		message: 'Validation failed',
		errors: errors.array(),
	});
};
