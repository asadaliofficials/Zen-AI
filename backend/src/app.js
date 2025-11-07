// Dependencies Imports
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import requestLogger from './middlewares/reqLogger.middleware.js';
import authRouter from './routes/auth.route.js';
import chatRouter from './routes/chat.route.js';
import { apiLimiter } from './middlewares/rateLimiter.middleware.js';
import { NODE_ENV } from './config/env.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('trust proxy', 1);

// Middleware setup

app.use(
	cors({
		origin: NODE_ENV === 'production' ? 'https://zen-ai.up.railway.app' : 'http://localhost:5173',
		// origin: true,
		credentials: true,
	})
);

// Rate Limiter - Middleware
app.use(apiLimiter);

app.use(express.json());
app.use(cookieParser());

// Request logging middleware
app.use(requestLogger);

// test route
app.get('/api/v1/health', (req, res) => {
	res.json({ success: true, statusCode: 200, message: 'Server running fine 🚀' });
});

// Routers
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/chat', chatRouter);

// serve the frontend
if (NODE_ENV === 'production') {
	const frontendPath = path.join(__dirname, '../../frontend/dist');

	app.use(express.static(frontendPath));

	// Catch-all for React Router paths
	app.get('/*splat', (req, res) => {
		res.sendFile(path.join(frontendPath, 'index.html'));
	});
}

// ✅ 404 Handler (after all routes)
app.use((req, res) => {
	res.status(404).json({ success: false, statusCode: 404, message: 'Route not found' });
});

// ✅ Error Handler (last middleware in file)
app.use((err, req, res, next) => {
	console.error('Unhandled Error:', err);
	res.status(500).json({ success: false, statusCode: 500, message: 'Internal Server Error' });
});

export default app;
