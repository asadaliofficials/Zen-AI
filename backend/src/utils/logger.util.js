// logger.js
import pino from 'pino';
import fs from 'fs';
import path from 'path';
import rfs from 'rotating-file-stream';

// Resolve logs directory safely
const logDir = path.resolve('logs');

// Ensure logs directory exists
if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir);
}

let transport;

try {
	if (process.env.NODE_ENV !== 'production') {
		// Development: pretty-print logs
		transport = pino.transport({
			target: 'pino-pretty',
			options: {
				colorize: true,
				translateTime: 'SYS:standard',
				ignore: 'pid,hostname',
			},
		});
	} else {
		// Production: monthly rotating file
		const logStream = rfs.createStream('app.log', {
			interval: '1M', // rotate every month
			path: logDir,
		});

		transport = pino.transport({
			target: 'pino/file',
			options: { destination: logStream },
		});
	}
} catch (err) {
	console.error('Logger transport initialization failed:', err);
}

// Create logger instance
const logger = pino(
	{
		level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
		timestamp: pino.stdTimeFunctions.isoTime,
	},
	transport
);

export default logger;
