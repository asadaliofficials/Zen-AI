import express from 'express';

import cookieParser from 'cookie-parser';

import authRouter from './routes/auth.route.js';
import chatRouter from './routes/chat.route.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/chat', chatRouter);

export default app;
