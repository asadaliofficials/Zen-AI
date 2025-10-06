import { validationResult } from 'express-validator';

export const reqValidationResult = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({
			errors: errors.array(),
		});
	}
	next();
};
