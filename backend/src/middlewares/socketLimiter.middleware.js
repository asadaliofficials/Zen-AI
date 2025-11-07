// lib/socketRateLimiter.js
const userMessageCounts = new Map();

export function socketRateLimiter({ limit, interval, eventName = 'rateLimit' }) {
	return function (socket, next) {
		if (!userMessageCounts.has(socket.id)) {
			userMessageCounts.set(socket.id, []);
			// Auto cleanup after a while to prevent memory leaks
			setTimeout(() => userMessageCounts.delete(socket.id), interval * 2);
		}

		socket.onAny((event, ...args) => {
			if (event === eventName) return; // avoid recursion if user sends same event

			const now = Date.now();
			const key = `${socket.id}:${event}`;
			const timestamps = userMessageCounts.get(key) || [];

			// Filter out old timestamps outside interval
			const recent = timestamps.filter(t => now - t < interval);
			recent.push(now);
			userMessageCounts.set(key, recent);

			if (recent.length > limit) {
				socket.emit(eventName, {
					success: false,
					message: 'Rate limit exceeded. Please wait a moment before sending more messages.',
				});
				return;
			}

			// Optional: debug log (only in development)
			if (process.env.NODE_ENV === 'development') {
				console.debug(`[RateLimiter] ${socket.id} - ${event}: ${recent.length}/${limit}`);
			}
		});

		socket.on('disconnect', () => {
			// Cleanup all event keys for this socket
			for (const key of userMessageCounts.keys()) {
				if (key.startsWith(`${socket.id}:`)) {
					userMessageCounts.delete(key);
				}
			}
		});

		next();
	};
}
