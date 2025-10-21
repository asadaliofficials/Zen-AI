import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const TopBarSandbox = ({ models = [], selectedModel }) => {
	const [showModelDropdown, setShowModelDropdown] = useState(false);

	const handleModelSelection = id => {
		if (id === 'zen-1.5') return;
		toast.error('Please login to use this Feature!');
	};

	// Close dropdown when clicking outside is handled by parent Chat if desired.

	return (
		<div className="flex bg-transparent items-center justify-between p-4">
			<div className="flex bg-transparent items-center justify-center gap-8">
				{/* Logo */}
				<div className="flex items-center space-x-2">
					<div className="w-8 h-8 rounded flex items-center justify-center">
						<img src="images/logo.png" alt="logo" className="w-8 h-9" />
					</div>
					<span className={`text-lg font-semibold dark:text-white text-black`}>Zen-AI</span>
				</div>
				{/* Model Selection */}
				<div className="relative model-dropdown">
					<button
						onClick={() => setShowModelDropdown(!showModelDropdown)}
						className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg cursor-pointer transition-colors dark:bg-[#2a2a2a] dark:border-gray-600 dark:hover:bg-[#353535] dark:text-white bg-gray-50 border-gray-300 hover:bg-gray-100 text-black`}
					>
						<span className="text-sm font-medium">
							{models.find(m => m.id === selectedModel)?.name ?? selectedModel}
						</span>
						<svg
							className={`w-4 h-4 transition-transform ${showModelDropdown ? 'rotate-180' : ''}`}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</button>

					<AnimatePresence>
						{showModelDropdown && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								className={`absolute top-full left-0 mt-2 w-48 py-1 rounded-lg shadow-lg z-50 dark:bg-[#2a2a2a] dark:border-gray-600 bg-white border-gray-300`}
							>
								{models.map(model => (
									<button
										key={model.id}
										onClick={() => {
											handleModelSelection(model.id);
											setShowModelDropdown(false);
										}}
										className={`w-full cursor-pointer text-left px-3 py-2 text-sm transition-colors ${
											selectedModel === model.id
												? 'dark:bg-[#404040] dark:text-white bg-blue-50 text-blue-600'
												: 'dark:hover:bg-[#353535] dark:text-gray-300 hover:bg-gray-100 text-gray-700'
										}`}
									>
										<div className="flex items-center justify-between">
											<span>{model.name}</span>{' '}
											{model.name === 'zen-1.5' ? (
												''
											) : (
												<svg
													fill="currentColor"
													width="20px"
													height="20px"
													viewBox="-3.5 0 19 19"
													xmlns="http://www.w3.org/2000/svg"
													class="cf-icon-svg"
												>
													<path d="M11.182 8.927v6.912a.794.794 0 0 1-.792.792H1.61a.794.794 0 0 1-.792-.792V8.927a.794.794 0 0 1 .792-.792h.856V6.367a3.534 3.534 0 1 1 7.068 0v1.768h.856a.794.794 0 0 1 .792.792zm-2.756-2.56a2.426 2.426 0 1 0-4.852 0v1.768h4.852zM7.108 11.47a1.108 1.108 0 1 0-1.583 1.001v1.849a.475.475 0 0 0 .95 0v-1.849a1.108 1.108 0 0 0 .633-1.001z" />
												</svg>
											)}
											{selectedModel === model.id && (
												<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
													<path
														fillRule="evenodd"
														d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
														clipRule="evenodd"
													/>
												</svg>
											)}
										</div>
									</button>
								))}
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
			{/* Action Buttons */}
			<div className="flex items-center space-x-2">
				<button
					onClick={() => {
						handleModelSelection(null);
					}}
					className={`flex cursor-pointer items-center space-x-2 px-3 py-2 rounded-lg transition-colors dark:bg-gray-700/50 dark:hover:bg-gray-700/70 dark:text-red-400 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700`}
					title="Delete Chat"
				>
					<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
						/>
					</svg>
				</button>

				<button
					onClick={() => {
						handleModelSelection(null);
					}}
					className={`flex cursor-pointer items-center space-x-2 px-3 py-2 rounded-lg transition-colors dark:bg-gray-700/50 dark:hover:bg-gray-700/70 dark:text-white dark:hover:text-gray-100 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900`}
					title="Share Chat"
				>
					<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 5v8.5M15 7l-3-3l-3 3m-4 5v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"
						/>
					</svg>
				</button>
			</div>
		</div>
	);
};

export default TopBarSandbox;
