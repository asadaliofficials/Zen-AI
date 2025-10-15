import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: 'http://localhost:5000/api', // Replace with your backend URL
	headers: {
		'Content-Type': 'application/json',
	},
});

