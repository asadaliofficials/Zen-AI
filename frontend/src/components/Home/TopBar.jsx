import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TopBar = ({ isDark, toggleTheme, models = [], selectedModel, setSelectedModel }) => {
	const [showModelDropdown, setShowModelDropdown] = useState(false);

	// Close dropdown when clicking outside is handled by parent Chat if desired.

	return (
		<div className="flex bg-transparent items-center justify-between p-4">
			{/* Model Selection */}
			<div className="relative model-dropdown">
				<button
					onClick={() => setShowModelDropdown(!showModelDropdown)}
					className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${
						isDark
							? 'bg-[#2a2a2a] border-gray-600 hover:bg-[#353535] text-white'
							: 'bg-gray-50 border-gray-300 hover:bg-gray-100 text-black'
					}`}
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
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
					</svg>
				</button>

				<AnimatePresence>
					{showModelDropdown && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							className={`absolute top-full left-0 mt-2 w-48 py-1 rounded-lg shadow-lg z-50 ${
								isDark ? 'bg-[#2a2a2a] border-gray-600' : 'bg-white border-gray-300'
							}`}
						>
							{models.map(model => (
								<button
									key={model.id}
									onClick={() => {
										setSelectedModel(model.id);
										setShowModelDropdown(false);
									}}
									className={`w-full cursor-pointer text-left px-3 py-2 text-sm transition-colors ${
										selectedModel === model.id
											? isDark
												? 'bg-[#404040] text-white'
												: 'bg-blue-50 text-blue-600'
											: isDark
											? 'hover:bg-[#353535] text-gray-300'
											: 'hover:bg-gray-100 text-gray-700'
									}`}
								>
									<div className="flex items-center justify-between">
										<span>{model.name}</span>
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

			{/* Action Buttons */}
			<div className="flex items-center space-x-2">
				<button
					className={`flex cursor-pointer items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
						isDark
							? 'bg-gray-700/50 hover:bg-gray-700/70 text-red-400 '
							: 'bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700'
					}`}
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
					className={`flex cursor-pointer items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
						isDark
							? 'bg-gray-700/50 hover:bg-gray-700/70 text-white hover:text-gray-100'
							: 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
					}`}
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

				<button
					onClick={() => toggleTheme()}
					className={`flex cursor-pointer items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
						isDark
							? 'bg-gray-700/50 hover:bg-gray-700/70 text-white hover:text-gray-100'
							: 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
					}`}
					title="Toggle Theme"
				>
					{isDark ? (
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
							/>
						</svg>
					) : (
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
							/>
						</svg>
					)}
				</button>
			</div>
		</div>
	);
};

export default TopBar;
