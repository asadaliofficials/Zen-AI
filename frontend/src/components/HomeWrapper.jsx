import React, { useEffect, useState } from 'react';
import HomeSandbox from './sandbox/HomeSandbox';
import Home from './main/Home';
import { addChats } from '../features/chats/chatSlice';
import { useDispatch } from 'react-redux';
import { addUser } from '../features/user/userSlice';
import axiosInstance from '../services/axios.service';

const HomeWrapper = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(null);
	const [response, setResponse] = useState(null);
	const dispatch = useDispatch();

	useEffect(() => {
		let retryTimer;

		const fetchData = async () => {
			try {
				const response = await axiosInstance.get('/chat/all', {
					withCredentials: true,
				});

				if (!response.data.success) {
					setIsLoggedIn(false);
				} else {
					setResponse(response.data);
					dispatch(addChats(response.data.chats.contents.reverse()));

					dispatch(addUser(response.data.user));
					setIsLoggedIn(true);
				}
			} catch (error) {
				console.error('Error fetching data:', error);
				if (error.response.data.statusCode == '401') {
					setIsLoggedIn(false);
				}
			}
		};

		fetchData();

		return () => clearTimeout(retryTimer);
	}, []);

	// Loader while waiting
	if (isLoggedIn === null) {
		return (
			<>
				<style>
					{`
            .loader {
              display: block;
              max-width: 180px;
              width: 100%;
              height: 4px;
              border-radius: 30px;
              position: relative;
              top: 50vh;
              left: 50vw;
              transform: translate(-50%, -50%);
            }

            .loader::before {
              content: "";
              position: absolute;
              background: #0071e2;
              top: 0;
              left: 0;
              width: 0%;
              height: 100%;
              border-radius: 30px;
              animation: moving 1s ease-in-out infinite;
            }

            @keyframes moving {
              50% {
                width: 100%;
              }
              100% {
                width: 0;
                right: 0;
                left: unset;
              }
            }
          `}
				</style>
				<div className="loader bg-gray-400 dark:bg-[#333]" />
			</>
		);
	}

	return isLoggedIn ? <Home response={response} /> : <HomeSandbox />;
};

export default HomeWrapper;
