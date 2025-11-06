import axios from 'axios';
import { REACT_ENV } from '../constants/react';

const axiosInstance = axios.create({
	baseURL:
		REACT_ENV === 'development'
			? 'http://localhost:3000/api/v1'
			: 'https://zen-ai.up.railway.app/api/v1',
	headers: {
		'Content-Type': 'application/json',
	},
});

export default axiosInstance;
