import React from 'react';
import AuthPage from './components/AuthPage';
import AppRoutes from './routes/App.routes.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { store } from './app/store.js';
import { Provider } from 'react-redux';

const App = () => {
	return (
		<>
			<Provider store={store}>
				<AppRoutes />
				<ToastContainer
					position="top-right"
					autoClose={3000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
					theme="colored"
				/>
			</Provider>
		</>
	);
};

export default App;
