// lib/socketRateLimiter.js
const userMessageCounts = new Map();

/**
 * Rate limiter middleware for Socket.IO
 * @param {Object} options - Config object
 * @param {number} options.limit - Number of allowed events
 * @param {number} options.interval - Time window in milliseconds
 * @param {string} [options.eventName='error'] - Event name to emit when limited
 * @returns {Function} - A wrapper function to limit socket events
 */
export function socketRateLimiter({ limit, interval, eventName = 'rateLimit' }) {
	return function (socket, next) {
		userMessageCounts.set(socket.id, []);

		socket.onAny((event, ...args) => {
			if (event === eventName) return; // avoid recursion if user sends the same event name

			const now = Date.now();
			const timestamps = userMessageCounts.get(socket.id) || [];

			// Filter out old timestamps outside interval
			const recent = timestamps.filter(t => now - t < interval);
			recent.push(now);
			userMessageCounts.set(socket.id, recent);

			if (recent.length > limit) {
				socket.emit(eventName, {
					success: false,
					message: `Rate limit exceeded. Please wait a moment before sending more messages.`,
				});
				return;
			}
		});

		socket.on('disconnect', () => {
			userMessageCounts.delete(socket.id);
		});

		next();
	};
}
