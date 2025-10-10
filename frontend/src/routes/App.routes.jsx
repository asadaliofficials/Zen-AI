// src/routes/App.routes.js or wherever your file is
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from '../components/AuthPage';
import HomePage from '../components/Home'; // Add this
const AppRoutes = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/auth" element={<AuthPage />} />
			</Routes>
		</Router>
	);
};

export default AppRoutes;
