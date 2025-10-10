import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';

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

	const handleSendMessage = e => {
		e.preventDefault();
		if (!inputMessage.trim()) return;

		const newMessage = {
			id: messages.length + 1,
			role: 'user',
			content: inputMessage,
			timestamp: new Date(),
		};

		setMessages(prev => [...prev, newMessage]);
		setInputMessage('');
		setIsTyping(true);

		// Simulate AI response
		setTimeout(() => {
			const aiResponse = {
				id: messages.length + 2,
				role: 'assistant',
				content:
					'This is a simulated AI response. In a real application, this would be the actual AI response.',
				timestamp: new Date(),
			};
			setMessages(prev => [...prev, aiResponse]);
			setIsTyping(false);
		}, 2000);
	};

	const handleCopyMessage = content => {
		navigator.clipboard.writeText(content);
		// You could add a toast notification here
	};

	const handleLikeMessage = messageId => {
		// Handle like functionality
		console.log('Liked message:', messageId);
	};

	const handleShareMessage = messageId => {
		// Handle share functionality
		console.log('Shared message:', messageId);
	};

	const handleReadAloud = content => {
		if ('speechSynthesis' in window) {
			const utterance = new SpeechSynthesisUtterance(content);
			speechSynthesis.speak(utterance);
		}
	};

	return (
		<div className={`flex-1 flex flex-col h-screen ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
			{/* Header */}
			<div
				className={`flex items-center justify-between p-4 border-b ${
					isDark ? 'border-gray-700' : 'border-gray-200'
				}`}
			>
				<h1 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-black'}`}>Zen-AI</h1>
				<div className="flex items-center space-x-2">
					<button
						className={`p-2 rounded-lg transition-colors ${
							isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
						}`}
						title="Delete Chat"
					>
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
							/>
						</svg>
					</button>
					<button
						className={`p-2 rounded-lg transition-colors ${
							isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
						}`}
						title="Share Chat"
					>
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
							/>
						</svg>
					</button>
					<button
						className={`p-2 rounded-lg transition-colors ${
							isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
						}`}
						title="Temp Chat"
					>
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</button>
					<button
						onClick={() => setIsDark(!isDark)}
						className={`p-2 rounded-lg transition-colors ${
							isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
						}`}
						title="Toggle Theme"
					>
						{isDark ? (
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
								/>
							</svg>
						) : (
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

			{/* Messages Container */}
			<div className="flex-1 overflow-y-auto p-4 space-y-6">
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
							<div
								className={`w-8 h-8 rounded-full flex items-center justify-center ${
									message.role === 'user'
										? 'bg-blue-500'
										: 'bg-gradient-to-r from-purple-500 to-pink-500'
								}`}
							>
								{message.role === 'user' ? (
									<span className="text-white text-sm font-medium">U</span>
								) : (
									<span className="text-white text-sm font-medium">AI</span>
								)}
							</div>

							{/* Message Content */}
							<div className="flex flex-col">
								<div
									className={`px-4 py-3 rounded-2xl ${
										message.role === 'user'
											? isDark
												? 'bg-blue-600 text-white'
												: 'bg-blue-500 text-white'
											: isDark
											? 'bg-gray-800 text-white'
											: 'bg-gray-100 text-black'
									}`}
								>
									<p className="whitespace-pre-wrap">{message.content}</p>
								</div>

								{/* Message Actions (only for AI messages) */}
								{message.role === 'assistant' && (
									<div className="flex items-center space-x-2 mt-2 ml-2">
										<button
											onClick={() => handleCopyMessage(message.content)}
											className={`p-1.5 rounded-lg transition-colors ${
												isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
											}`}
											title="Copy"
										>
											<svg
												className="w-4 h-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
												/>
											</svg>
										</button>
										<button
											onClick={() => handleLikeMessage(message.id)}
											className={`p-1.5 rounded-lg transition-colors ${
												isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
											}`}
											title="Like"
										>
											<svg
												className="w-4 h-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V18m-7-8a2 2 0 01-2-2V5a2 2 0 012-2h4a2 2 0 012 2v3a2 2 0 01-2 2H7z"
												/>
											</svg>
										</button>
										<button
											onClick={() => handleShareMessage(message.id)}
											className={`p-1.5 rounded-lg transition-colors ${
												isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
											}`}
											title="Share"
										>
											<svg
												className="w-4 h-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
												/>
											</svg>
										</button>
										<button
											onClick={() => handleReadAloud(message.content)}
											className={`p-1.5 rounded-lg transition-colors ${
												isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
											}`}
											title="Read Aloud"
										>
											<svg
												className="w-4 h-4"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
												/>
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
							exit={{ opacity: 0, y: 20 }}
							className="flex justify-start"
						>
							<div className="flex space-x-3">
								<div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
									<span className="text-white text-sm font-medium">AI</span>
								</div>
								<div className={`px-4 py-3 rounded-2xl ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
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

			{/* Input Area */}
			<div className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
				<form onSubmit={handleSendMessage} className="flex items-end space-x-3">
					<div className="flex-1">
						<textarea
							value={inputMessage}
							onChange={e => setInputMessage(e.target.value)}
							placeholder="Message Zen-AI..."
							rows="1"
							className={`w-full px-4 py-3 rounded-2xl resize-none transition-colors ${
								isDark
									? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-gray-600'
									: 'bg-gray-100 border-gray-300 text-black placeholder-gray-500 focus:border-gray-400'
							} border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
							onInput={e => {
								e.target.style.height = 'auto';
								e.target.style.height = e.target.scrollHeight + 'px';
							}}
						/>
					</div>
					<button
						type="button"
						className={`p-3 rounded-2xl transition-colors ${
							isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-200'
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
					<button
						type="submit"
						disabled={!inputMessage.trim()}
						className={`p-3 rounded-2xl transition-colors ${
							inputMessage.trim()
								? isDark
									? 'bg-blue-600 hover:bg-blue-700 text-white'
									: 'bg-blue-500 hover:bg-blue-600 text-white'
								: isDark
								? 'bg-gray-700 text-gray-500 cursor-not-allowed'
								: 'bg-gray-300 text-gray-500 cursor-not-allowed'
						}`}
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
				</form>
			</div>
		</div>
	);
};

export default Chat;
