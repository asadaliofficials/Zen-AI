import express from 'express';
import { configDotenv } from 'dotenv';

import authRouter from './routes/auth.route.js';

configDotenv();
const app = express();

app.use(express.json());
app.use('/api/v1/auth', authRouter);

export default app;
