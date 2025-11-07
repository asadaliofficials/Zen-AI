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
		if (res.statusCode === 304) return 'Not Modified';
		if (res.statusCode === 200) return 'OK';
		return `Request completed with status ${res.statusCode}`;
	},

	customErrorMessage(error, res) {
		return `Request failed with status ${res?.statusCode || 'unknown'}: ${error.message}`;
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
