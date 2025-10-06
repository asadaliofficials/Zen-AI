import app from './src/app.js';

import { PORT } from './src/config/env.config.js';

app.listen(PORT, () => {
	console.log(`server is listening on http://localhost:${PORT}`);
});
