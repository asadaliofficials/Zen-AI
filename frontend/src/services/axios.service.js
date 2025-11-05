import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: 'https://zen-ai.up.railway.app/api/v1',
	headers: {
		'Content-Type': 'application/json',
	},
});

export default axiosInstance;
