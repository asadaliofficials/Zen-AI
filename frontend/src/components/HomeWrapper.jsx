import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HomeSandbox from './sandbox/Home.Sandbox';
import Home from './home/Home';

const HomeWrapper = () => {
	const [showSandbox, setShowSandbox] = useState(null);

	// useEffect(() => {
	// 	axios
	// 		.get('http://localhost:3000/api/v1/chat/all', { withCredentials: true })
	// 		.then(response => {
	// 			if (!response.data.success) {
	// 				// setShowSandbox(true);
	// 			} else {
	// 				setShowSandbox(false);
	// 			}
	// 		})
	// 		.catch(error => {
	// 			console.error('Error fetching data:', error);
	// 			// setShowSandbox(true);
	// 		});
	// }, []);

	if (showSandbox === null) {
		return <HomeSandbox />;

		// return (
		// 	<>
		// 		<style>
		// 			{`
		//         .loader {
		//           display: block;
		//           max-width: 180px;
		// 					width: 100%;
		//           height: 4px;
		//           border-radius: 30px;
		//           position: relative;
		//           top: 50vh;
		//           left: 50vw;
		//           transform: translate(-50%, -50%);
		//         }

		//         .loader::before {
		//           content: "";
		//           position: absolute;
		//           background: #0071e2;
		//           top: 0;
		//           left: 0;
		//           width: 0%;
		//           height: 100%;
		//           border-radius: 30px;
		//           animation: moving 1s ease-in-out infinite;
		//         }

		//         @keyframes moving {
		//           50% {
		//             width: 100%;
		//           }

		//           100% {
		//             width: 0;
		//             right: 0;
		//             left: unset;
		//           }
		//         }
		//       `}
		// 		</style>
		// 		<div className="loader bg-gray-400 dark:bg-[#333]" />
		// 	</>
		// );
	}

	// return showSandbox ? <HomeSandbox /> : <Home />;
};

export default HomeWrapper;
