import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import requestLogger from './middlewares/reqLogger.middleware.js';
import authRouter from './routes/auth.route.js';
import chatRouter from './routes/chat.route.js';

const app = express();

// Middleware setup
app.use(
	cors({
		origin: 'http://localhost:5173',
		credentials: true,
	})
);
app.use(express.json());
app.use(cookieParser());

// Request logging middleware
app.use(requestLogger);

// Routers
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/chat', chatRouter);

export default app;
