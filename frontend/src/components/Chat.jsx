import React, { useState, useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';

import screenShotAudio from '../assets/sound/screenshot.mp3';

import '../css/chat.css';
const Chat = () => {
	const [isDark, setIsDark] = useState(false);
	const [messages, setMessages] = useState([
		{
			id: 1,
			role: 'user',
			content: 'Hello! How can you help me today?',
			timestamp: new Date(),
		},
		{
			id: 2,
			role: 'assistant',
			content:
				"Hello! I'm here to help you with a wide variety of tasks. I can assist you with writing, coding, analysis, creative projects, problem-solving, and much more. What would you like to work on today?",
			timestamp: new Date(),
		},
	]);
	const [inputMessage, setInputMessage] = useState('');
	const [isTyping, setIsTyping] = useState(false);
	const [selectedModel, setSelectedModel] = useState('zen-3.5');
	const [showModelDropdown, setShowModelDropdown] = useState(false);
	const [copyStates, setCopyStates] = useState({});
	const [lovedMessages, setLovedMessages] = useState(new Set());
	const [readingMessage, setReadingMessage] = useState(null);
	const [screenshotStates, setScreenshotStates] = useState({});
	const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
	const [cancelRequest, setCancelRequest] = useState(null);
	const models = [
		{ id: 'zen-1.5', name: 'Zen-1.5' },
		{ id: 'zen-2.0', name: 'Zen-2.0' },
		{ id: 'zen-3.0', name: 'Zen-3.0' },
		{ id: 'zen-3.5', name: 'Zen-3.5' },
	];

	// System theme detection
	useEffect(() => {
		const checkSystemTheme = () => {
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			setIsDark(prefersDark);
		};

		checkSystemTheme();

		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		mediaQuery.addEventListener('change', checkSystemTheme);

		return () => mediaQuery.removeEventListener('change', checkSystemTheme);
	}, []);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = event => {
			if (showModelDropdown && !event.target.closest('.model-dropdown')) {
				setShowModelDropdown(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [showModelDropdown]);

	const handleSendMessage = e => {
		e.preventDefault();
		if (!inputMessage.trim() || isWaitingForResponse) return;

		const newMessage = {
			id: messages.length + 1,
			role: 'user',
			content: inputMessage.trim(),
			timestamp: new Date(),
		};

		setMessages(prev => [...prev, newMessage]);
		setInputMessage('');
		setIsWaitingForResponse(true);
		setIsTyping(true);

		// Reset textarea height
		const textarea = document.querySelector('textarea');
		if (textarea) {
			textarea.style.height = 'auto';
		}

		// Scroll to bottom when user sends message
		setTimeout(() => scrollToBottom(), 100);

		// Simulate AI response
		const timeoutId = setTimeout(() => {
			const aiResponse = {
				id: messages.length + 2,
				role: 'assistant',
				content:
					'This is a simulated AI response. In a real application, this would be the actual AI response.',
				timestamp: new Date(),
			};
			setIsTyping(false);
			setIsWaitingForResponse(false);
			setCancelRequest(null);
			setTimeout(() => {
				setMessages(prev => [...prev, aiResponse]);
			}, 500);

			// Scroll to bottom only if user is near bottom
			setTimeout(() => {
				if (isNearBottom()) {
					scrollToBottom();
				}
			}, 700);
		}, 2000);

		setCancelRequest(timeoutId);
	};

	const handleKeyPress = e => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage(e);
		}
	};

	const isNearBottom = () => {
		const messagesContainer = document.querySelector('.messages-container');
		if (!messagesContainer) return false;

		const { scrollTop, scrollHeight, clientHeight } = messagesContainer;
		return scrollHeight - scrollTop - clientHeight < 100;
	};

	const scrollToBottom = () => {
		const messagesContainer = document.querySelector('.messages-container');
		if (messagesContainer) {
			messagesContainer.scrollTop = messagesContainer.scrollHeight;
		}
	};

	const handleCancelRequest = () => {
		if (cancelRequest) {
			clearTimeout(cancelRequest);
		}
		setIsWaitingForResponse(false);
		setIsTyping(false);
		setCancelRequest(null);
	};

	const handleCopyMessage = (content, messageId) => {
		navigator.clipboard.writeText(content);

		// Show success icon for 1.5 seconds
		setCopyStates(prev => ({ ...prev, [messageId]: true }));
		setTimeout(() => {
			setCopyStates(prev => ({ ...prev, [messageId]: false }));
		}, 1500);
	};
	const handleScreenshot = messageId => {
		// Show success icon for 1.5 seconds
		playSound();
		setScreenshotStates(prev => ({ ...prev, [messageId]: true }));
		setTimeout(() => {
			setScreenshotStates(prev => ({ ...prev, [messageId]: false }));
		}, 1500);
	};

	const handleLoveMessage = messageId => {
		setLovedMessages(prev => {
			const newSet = new Set(prev);
			if (newSet.has(messageId)) {
				newSet.delete(messageId);
			} else {
				newSet.add(messageId);
			}
			return newSet;
		});
	};

	const handleShareMessage = messageId => {
		// Handle share functionality - will be implemented later
		console.log('Shared message:', messageId);
	};

	const handleReadAloud = (content, messageId) => {
		if (readingMessage === messageId) {
			// Stop reading
			speechSynthesis.cancel();
			setReadingMessage(null);
		} else {
			// Start reading
			if ('speechSynthesis' in window) {
				speechSynthesis.cancel(); // Stop any current reading
				const utterance = new SpeechSynthesisUtterance(content);
				utterance.onend = () => setReadingMessage(null);
				speechSynthesis.speak(utterance);
				setReadingMessage(messageId);
			}
		}
	};

	const playSound = () => {
		const audio = new Audio(screenShotAudio);
		audio.play();
	};

	return (
		<div className={`flex-1 flex flex-col h-screen ${isDark ? 'bg-[#212121]' : 'bg-white'}`}>
			{/* Top Bar */}
			<div className="flex items-center justify-between p-4">
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
							{models.find(model => model.id === selectedModel)?.name}
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

					{/* Dropdown Menu */}
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
						{/* <span className="text-sm font-medium">Delete</span> */}
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
						{/* <span className="text-sm font-medium">Share</span> */}
					</button>

					<button
						onClick={() => setIsDark(!isDark)}
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
						{/* <span className="text-sm font-medium">Theme</span> */}
					</button>
				</div>
			</div>

			{/* Messages Container */}
			<div
				className={`messages-container flex-1 overflow-y-auto p-4 space-y-6 ${
					isDark
						? 'scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500'
						: 'scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400'
				}`}
			>
				<div className="max-w-[1000px] w-full mx-auto">
					{messages.map(message => (
						<motion.div
							key={message.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
						>
							<div
								className={`max-w-3xl flex ${
									message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
								} space-x-3`}
							>
								{/* Avatar */}
								{/* <div
								className={`w-8 h-8 rounded-full flex items-center justify-center ${
									message.role === 'user'
										? 'bg-[#303030]'
										: 'bg-gradient-to-r from-purple-500 to-pink-500'
								}`}
							>
								{message.role === 'user' ? (
									<span className="text-white text-sm font-medium">U</span>
								) : (
									<span className="text-white text-sm font-medium">AI</span>
								)}
							</div> */}

								{/* Message Content */}
								<div className="flex flex-col">
									<div
										className={`px-4 py-3 rounded-2xl ${
											message.role === 'user'
												? isDark
													? 'bg-[#303030] text-white'
													: 'bg-[#303030] text-white'
												: isDark
												? 'bg-transparent text-white'
												: 'bg-transparent text-black'
										}`}
									>
										<p className="whitespace-pre-wrap">{message.content}</p>
									</div>

									{/* Message Actions (only for AI messages) */}
									{message.role === 'assistant' && (
										<div className="flex items-center space-x-2 mt-2 ml-2">
											{/* copy button */}
											<button
												onClick={() => handleCopyMessage(message.content, message.id)}
												className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
													isDark ? 'hover:bg-[#303030] text-white' : 'hover:bg-gray-200 text-black'
												}`}
												title="Copy"
											>
												{copyStates[message.id] ? (
													<svg
														xmlns="http://www.w3.org/2000/svg"
														width={18}
														height={18}
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
														width={18}
														height={18}
														viewBox="0 0 15 15"
													>
														<path
															strokeWidth={2}
															fill="currentColor"
															d="M10 4V2.5a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5H4V5.5A1.5 1.5 0 0 1 5.5 4zM5.5 5a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5zm7-1A1.5 1.5 0 0 1 14 5.5v7a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 4 12.5V11H2.5A1.5 1.5 0 0 1 1 9.5v-7A1.5 1.5 0 0 1 2.5 1h7A1.5 1.5 0 0 1 11 2.5V4z"
														></path>
													</svg>
												)}
											</button>

											{/* screenshot button  */}
											<button
												onClick={() => handleScreenshot(message.id)}
												className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
													isDark ? 'hover:bg-[#303030] text-white' : 'hover:bg-gray-200 text-black'
												}`}
												title="Screenshot"
											>
												{screenshotStates[message.id] ? (
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
														viewBox="0 0 24 24"
													>
														<path
															fill="currentColor"
															d="M6.25 3A3.25 3.25 0 0 0 3 6.25v11.5A3.25 3.25 0 0 0 6.25 21h11.5A3.25 3.25 0 0 0 21 17.75V6.25A3.25 3.25 0 0 0 17.75 3zM4.5 6.25c0-.966.784-1.75 1.75-1.75h11.5c.966 0 1.75.784 1.75 1.75v11.5a1.75 1.75 0 0 1-1.75 1.75H6.25a1.75 1.75 0 0 1-1.75-1.75zM8 7.5a.5.5 0 0 0-.5.5v2.25a.75.75 0 0 1-1.5 0V8a2 2 0 0 1 2-2h2.25a.75.75 0 0 1 0 1.5zm0 9a.5.5 0 0 1-.5-.5v-2.25a.75.75 0 0 0-1.5 0V16a2 2 0 0 0 2 2h2.25a.75.75 0 0 0 0-1.5zM16.5 8a.5.5 0 0 0-.5-.5h-2.25a.75.75 0 0 1 0-1.5H16a2 2 0 0 1 2 2v2.25a.75.75 0 0 1-1.5 0zm-.5 8.5a.5.5 0 0 0 .5-.5v-2.25a.75.75 0 0 1 1.5 0V16a2 2 0 0 1-2 2h-2.25a.75.75 0 0 1 0-1.5z"
														></path>
													</svg>
												)}
											</button>
											<button
												onClick={() => handleLoveMessage(message.id)}
												className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
													isDark ? 'hover:bg-[#303030] text-white' : 'hover:bg-gray-200 text-black'
												}`}
												title="Love"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width={18}
													height={18}
													viewBox="0 0 48 48"
												>
													<path
														fill={lovedMessages.has(message.id) ? 'currentColor' : 'none'}
														stroke="currentColor"
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={4}
														d="M15 8C8.925 8 4 12.925 4 19c0 11 13 21 20 23.326C31 40 44 30 44 19c0-6.075-4.925-11-11-11c-3.72 0-7.01 1.847-9 4.674A10.99 10.99 0 0 0 15 8"
													></path>
												</svg>
											</button>
											<button
												onClick={() => handleShareMessage(message.id)}
												className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
													isDark ? 'hover:bg-[#303030] text-white' : 'hover:bg-gray-200 text-black'
												}`}
												title="Share"
											>
												<svg
													className="w-5 h-5"
													fill="none"
													stroke="currentColor"
													viewBox="0 0 24 24"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={1.5}
														d="M12 5v8.5M15 7l-3-3l-3 3m-4 5v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"
													/>
												</svg>
											</button>
											<button
												onClick={() => handleReadAloud(message.content, message.id)}
												className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
													readingMessage === message.id
														? isDark
															? 'bg-[#303030] text-white'
															: 'bg-gray-200 text-black'
														: isDark
														? 'hover:bg-[#303030] text-white'
														: 'hover:bg-gray-200 text-black'
												}`}
												title="Read Aloud"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width={18}
													height={18}
													viewBox="0 0 24 24"
												>
													<path
														fill="none"
														stroke="currentColor"
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M2 14.959V9.04C2 8.466 2.448 8 3 8h3.586a.98.98 0 0 0 .707-.305l3-3.388c.63-.656 1.707-.191 1.707.736v13.914c0 .934-1.09 1.395-1.716.726l-2.99-3.369A.98.98 0 0 0 6.578 16H3c-.552 0-1-.466-1-1.041M16 8.5c1.333 1.778 1.333 5.222 0 7M19 5c3.988 3.808 4.012 10.217 0 14"
													></path>
												</svg>
											</button>
										</div>
									)}
								</div>
							</div>
						</motion.div>
					))}

					{/* Typing Indicator */}
					<AnimatePresence>
						{isTyping && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 10 }}
								className="flex justify-start"
							>
								<div className="flex space-x-3 max-w-3xl">
									<div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
										<span className="text-white text-sm font-medium">AI</span>
									</div>
									<div
										className={`px-4 py-3 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}
									>
										<div className="flex space-x-1">
											<div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
											<div
												className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
												style={{ animationDelay: '0.1s' }}
											></div>
											<div
												className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
												style={{ animationDelay: '0.2s' }}
											></div>
										</div>
									</div>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>

			{/* Input Area */}
			<div className={`p-4 max-w-[1000px] mx-auto w-full`}>
				<form onSubmit={handleSendMessage} className="relative">
					<div
						className={`relative rounded-2xl border transition-colors ${
							isDark ? 'bg-[#303030] border-white/10' : 'bg-gray-100 border-black/10'
						}`}
					>
						<textarea
							value={inputMessage}
							onChange={e => setInputMessage(e.target.value)}
							onKeyDown={handleKeyPress}
							placeholder="Message Zen-AI..."
							rows="1"
							className={`w-full px-4 py-3 pr-20 resize-none transition-colors rounded-2xl focus:outline-none ${
								isDark
									? 'bg-transparent text-white placeholder-gray-400'
									: 'bg-transparent text-black placeholder-gray-500'
							} ${
								isDark
									? 'scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500'
									: 'scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400'
							}`}
							style={{
								maxHeight: '240px', // 10 lines * 24px line height
								overflowY: 'auto',
							}}
							onInput={e => {
								const textarea = e.target;
								textarea.style.height = 'auto';
								const newHeight = Math.min(textarea.scrollHeight, 240); // Max 10 lines
								textarea.style.height = newHeight + 'px';
							}}
						/>

						{/* Buttons inside input */}
						<div className="absolute right-4 bottom-2 flex items-center space-x-1">
							{/* Voice Input Button */}
							<button
								type="button"
								className={`p-2 cursor-pointer rounded-lg transition-colors ${
									isDark
										? 'hover:bg-gray-600/50 text-gray-400 hover:text-gray-300'
										: 'hover:bg-gray-200 text-gray-600 hover:text-gray-800'
								}`}
								title="Voice Input"
							>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
									/>
								</svg>
							</button>

							{/* Send/Cancel Button */}
							{isWaitingForResponse ? (
								<button
									type="button"
									onClick={handleCancelRequest}
									className={`p-2 cursor-pointer rounded-lg transition-colors ${
										isDark ? 'bg-white  text-black' : 'bg-black  text-white'
									}`}
									title="Cancel Request"
								>
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
								</button>
							) : (
								<button
									type="submit"
									disabled={!inputMessage.trim()}
									className={`p-2 rounded-lg transition-colors ${
										inputMessage.trim()
											? isDark
												? 'bg-blue-600 cursor-pointer hover:bg-blue-700 text-white'
												: 'bg-blue-500 cursor-pointer hover:bg-blue-600 text-white'
											: isDark
											? 'bg-gray-700 text-gray-500 cursor-not-allowed'
											: 'bg-gray-300 text-gray-500 cursor-not-allowed'
									}`}
									title="Send Message"
								>
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
										/>
									</svg>
								</button>
							)}
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Chat;
