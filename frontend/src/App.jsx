import React, { useEffect } from 'react';
import AuthPage from './components/AuthPage';
import AppRoutes from './routes/App.routes.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
	useEffect(() => {
		// Check if system prefers dark mode
		const prefersDark =
			window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

		const root = window.document.documentElement;
		if (prefersDark) {
			root.classList.add('dark');
		} else {
			root.classList.remove('dark');
		}

		// Optional: Listen for changes in system theme and update dynamically
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handler = e => {
			if (e.matches) {
				root.classList.add('dark');
			} else {
				root.classList.remove('dark');
			}
		};
		mediaQuery.addEventListener('change', handler);

		// Cleanup listener on unmount
		return () => mediaQuery.removeEventListener('change', handler);
	}, []);

	return (
		<>
			<AppRoutes />
			<ToastContainer
				position="top-right"
				autoClose={3000}
				pauseOnHover
				theme="colored"
				hideProgressBar={true}
			/>
		</>
	);
};

export default App;
