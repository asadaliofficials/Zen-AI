// middleware/rateLimiter.js
import rateLimit from 'express-rate-limit';

//  API rate limiter
export const apiLimiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minute
	max: 100, // limit each IP to 100 requests per windowMs
	message: {
		success: false,
		statusCode: 429,
		message: 'Too many requests, please try again later.',
	},
	standardHeaders: true,
	legacyHeaders: false,
});
