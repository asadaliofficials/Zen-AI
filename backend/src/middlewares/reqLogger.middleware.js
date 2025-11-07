// middlewares/requestLogger.js
import pinoHttp from 'pino-http';
import logger from '../utils/logger.util.js';

const requestLogger = pinoHttp({
	logger,
	customLogLevel(res, err) {
		if (err || res.statusCode >= 500) return 'error';
		if (res.statusCode >= 400) return 'warn';
		return 'info';
	},

	customSuccessMessage(res) {
		const status =
			typeof res?.statusCode !== 'undefined' && res.statusCode !== null
				? res.statusCode
				: 'unknown';
		if (status === 304) return 'Not Modified';
		if (status === 200) return 'OK';
		return `Request completed with status ${status}`;
	},

	customErrorMessage(error, res) {
		const status =
			typeof res?.statusCode !== 'undefined' && res.statusCode !== null
				? res.statusCode
				: 'unknown';
		return `Request failed with status ${status}: ${error.message}`;
	},

	serializers: {
		req(req) {
			return { method: req.method, url: req.url, ip: req.ip };
		},
		res(res) {
			return { statusCode: res.statusCode };
		},
	},

	customProps: (req, res) => ({
		responseTime: res.responseTime,
	}),
});

export default requestLogger;
