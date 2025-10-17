import React, { useEffect } from 'react';
import axios from 'axios';
import HomeSandbox from './sandbox/Home.Sandbox';
import Home from './home/Home';

const HomeWrapper = () => {
	useEffect(() => {
		axios.get('http://localhost:3000/api/v1/auth/me').then(response => {
			if (response.data.success) {
				return <HomeSandbox />;
			} else {
				return <Home />;
			}
		});
	}, []);

	return <div>Home</div>;
};

export default HomeWrapper;
