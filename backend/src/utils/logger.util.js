// logger.js
import pino from 'pino';
import fs from 'fs';

// Ensure logs directory exists
if (!fs.existsSync('./logs')) {
	fs.mkdirSync('./logs');
}

let transport;

// Development: use pretty printing
if (process.env.NODE_ENV !== 'production') {
	transport = pino.transport({
		target: 'pino-pretty',
		options: {
			colorize: true,
			translateTime: 'SYS:standard',
			ignore: 'pid,hostname',
		},
	});
} else {
	// Production: write logs to a file
	transport = pino.transport({
		target: 'pino/file',
		options: {
			destination: './logs/app.log',
			mkdir: true,
			append: true,
		},
	});
} 
const logger = pino(
	{
		level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
	},
	transport
);

export default logger;
