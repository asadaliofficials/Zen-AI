import { setupSocket } from './src/sockets/chat.socket.js';

import http from 'http';

import app from './src/app.js';
import { PORT } from './src/config/env.config.js';
import connectToDB from './src/config/db.config.js';

const httpServer = http.createServer(app);
setupSocket(httpServer);

httpServer.listen(PORT, () => {
	console.log(`server is listening on http://localhost:${PORT}`);
	connectToDB();
});