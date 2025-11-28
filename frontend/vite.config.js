import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [
		react({
			babel: {
				plugins: [['react-compiler', { target: 'react' }]],
			},
		}),
		tailwindcss(),
	],
});
