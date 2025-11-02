// src/routes/App.routes.js or wherever your file is
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from '../components/AuthPage';
import HomeWrapper from '../components/HomeWrapper';
import NotFound from '../components/NotFound'
const AppRoutes = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<HomeWrapper />} />
				<Route path="/chat/:id" element={<HomeWrapper />} />
				<Route path="/auth" element={<AuthPage />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</Router>
	);
};

export default AppRoutes;
