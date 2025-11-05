// middleware/rateLimiter.js
import rateLimit from 'express-rate-limit';

// General API rate limiter (e.g. all API routes)
export const apiLimiter = rateLimit({
	windowMs: 2 * 60 * 1000, // 2 minutes
	max: 100, // limit each IP to 100 requests per windowMs
	message: { error: 'Too many requests, please try again later.' },
	standardHeaders: true, // Return rate limit info in RateLimit-* headers
	legacyHeaders: false,
});
