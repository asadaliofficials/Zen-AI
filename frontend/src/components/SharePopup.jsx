import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

const SharePopup = ({ show, id, onClose, sharing }) => {
	const [isLoading, setIsLoading] = useState(true);
	const [countdown, setCountdown] = useState(2);
	const [copied, setCopied] = useState(false);

	const chatUrl = `https://zen-ai.up.railway.app/c/read/${id}`;
	const msgUrl = `https://zen-ai.up.railway.app/m/read/${id}`;

	useEffect(() => {
		if (show) {
			setIsLoading(true);
			setCountdown(2);
			setCopied(false);

			const countdownInterval = setInterval(() => {
				setCountdown(prev => {
					if (prev <= 1) {
						clearInterval(countdownInterval);
						setIsLoading(false);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);

			return () => clearInterval(countdownInterval);
		}
	}, [show]);

	const handleCopy = () => {
		navigator.clipboard.writeText(sharing === 'chat' ? chatUrl : msgUrl);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<AnimatePresence>
			{show && (
				<>
					{/* Background overlay */}
					<motion.div
						className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
					/>

					{/* Popup box */}
					<motion.div
						initial={{ opacity: 0, scale: 0.9, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.9, y: 20 }}
						className="fixed z-60 inset-0 flex items-center justify-center"
					>
						<div
							className="w-full max-w-md rounded-2xl shadow-lg p-6
							bg-white text-black 
							dark:bg-[#1e1e1e] dark:text-white"
						>
							{/* Title */}
							<h2 className="text-lg font-semibold mb-2">
								{sharing === 'chat' ? 'Share Chat ' : 'Share Message'}
							</h2>

							{/* Description */}
							<p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
								{sharing === 'chat'
									? 'Share this chat with others using the link below.'
									: 'Share this message with others using the link below.'}
							</p>

							{/* Loading or URL Input */}
							<div className="mb-6 min-h-[60px] flex items-center justify-center">
								{isLoading ? (
									<div className="flex flex-col items-center space-y-3">
										<div className="w-8 h-8 border-3 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
										<p className="text-sm text-gray-500 dark:text-gray-400">
											Generating link... {countdown}s
										</p>
									</div>
								) : (
									<div className="w-full">
										<label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
											Share URL
										</label>
										<div className="flex items-center space-x-2">
											<input
												type="text"
												value={sharing === 'chat' ? chatUrl : msgUrl}
												readOnly
												className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                                 bg-gray-50 dark:bg-[#2a2a2a] 
                                 text-gray-700 dark:text-gray-300
                                 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
											/>
											<button
												onClick={handleCopy}
												className="p-2 rounded-lg transition-colors cursor-pointer
                                 bg-blue-600 hover:bg-blue-700 text-white"
												title="Copy URL"
											>
												{copied ? (
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width={20}
														height={20}
														viewBox="0 0 24 24"
													>
														<path
															fill="currentColor"
															d="M21 7L9 19l-5.5-5.5l1.41-1.41L9 16.17L19.59 5.59z"
														></path>
													</svg>
												) : (
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width={20}
														height={20}
														viewBox="0 0 15 15"
													>
														<path
															strokeWidth={2}
															fill="currentColor"
															d="M10 4V2.5a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5H4V5.5A1.5 1.5 0 0 1 5.5 4zM5.5 5a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5zm7-1A1.5 1.5 0 0 1 14 5.5v7a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 4 12.5V11H2.5A1.5 1.5 0 0 1 1 9.5v-7A1.5 1.5 0 0 1 2.5 1h7A1.5 1.5 0 0 1 11 2.5V4z"
														/>
													</svg>
												)}
											</button>
										</div>
									</div>
								)}
							</div>

							{/* Close Button */}
							{!isLoading && (
								<div className="flex justify-end">
									<button
										onClick={onClose}
										className="cursor-pointer px-4 py-2 rounded-md 
                             bg-blue-600 text-white 
                             hover:bg-blue-700 
                             transition-colors duration-200"
									>
										Close
									</button>
								</div>
							)}
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};

export default SharePopup;
