import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HomeSandbox from './sandbox/Home.sandbox';
import Home from './home/Home';
import { addChats } from '../features/chats/chatSlice';
import { useDispatch } from 'react-redux';

const HomeWrapper = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(null);
	const [retryCount, setRetryCount] = useState(0);
	const [response, setResponse] = useState(null);
  const dispatch = useDispatch()

	useEffect(() => {
		let retryTimer;

		const fetchData = async () => {
			try {
				const response = await axios.get('http://localhost:3000/api/v1/chat/all', {
					withCredentials: true,
				});


				if (!response.data.success) {
					setIsLoggedIn(false);
				} else {
					setResponse(response.data);
          dispatch(addChats(response.data.chats))
					setIsLoggedIn(true);
				}
			} catch (error) {
				console.error('Error fetching data:', error);

				// retry after 3 seconds
				retryTimer = setTimeout(() => {
					setRetryCount(prev => prev + 1);
				}, 2000);
			}
		};

		fetchData();

		return () => clearTimeout(retryTimer);
	}, [retryCount]);

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
