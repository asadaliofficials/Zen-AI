import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import ResponseActions from './ResponseActions';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/monokai.css';
import { MarkdownMessage } from '../MarkdownMessage';
import { takeScreenshot } from '../../utils/screenshot.util';
import { getRandomName } from '../../utils/getRandomName.util';
import screenShotAudio from '../../assets/sound/screenshot.mp3';
import { useSelector } from 'react-redux';

// eslint-disable-next-line no-unused-vars
const MessagesList = ({
	messages,
	isDark,
	isTyping,
	handlers,
	uiState,
	chatId,
	isLoadingMore,
	onScroll,
	containerRef,
	isReading,
	isTemp
}) => {
	const playSound = () => {
		const audio = new Audio(screenShotAudio);
		audio.play();
	};

	const user = useSelector(state => state.user.user);

	const handleScreenshot = id => {
		const elem = document.getElementById(id);
		if (!elem) return;

		try {
			const name = getRandomName();
			playSound();

			// Detect theme
			const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

			// Store original color to restore later
			const originalBg = getComputedStyle(elem).backgroundColor;

			// Soft blink color depending on theme
			const blinkColor = isDark ? '#303030' : '#f2f2f2';

			// Apply blink effect
			elem.style.transition = 'background-color 0.3s ease';
			elem.style.backgroundColor = blinkColor;

			setTimeout(() => {
				takeScreenshot(elem, name);

				// Restore original color
				elem.style.backgroundColor = originalBg;

				// Optional: clear transition after restoring
				setTimeout(() => {
					elem.style.transition = '';
				}, 300);
			}, 300);
		} catch (error) {
			console.error('Screenshot failed:', error);
		}
	};

	return (
		<div
			ref={containerRef}
			onScroll={onScroll}
			className={`messages-container flex-1 overflow-y-auto p-4 space-y-6 dark:scrollbar-thin dark:scrollbar-track-transparent dark:scrollbar-thumb-gray-600 dark:hover:scrollbar-thumb-gray-500 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400`}
		>
			<div className="max-w-[1000px] w-full mx-auto">
				{/* Loading More Indicator */}
				{isLoadingMore && (
					<div className="flex justify-center mb-4">
						<div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
							<div className="w-4 h-4 border-2 border-t-transparent border-gray-500 dark:border-gray-400 rounded-full animate-spin"></div>
							<span className="text-sm">Loading more messages...</span>
						</div>
					</div>
				)}

				<AnimatePresence mode="wait" initial={false}>
					{messages.length < 1 ? (
						<p className="absolute top-[50%] left-[50%] sm:text-3xl -translate-[50%] text-xl text-black dark:text-white font-bold">
							What can I help with?
						</p>
				{	isTemp ? (<p className="absolute top-[60%] left-[50%] sm:text-xl -translate-x-[50%] -translate-y-[50%] text-md text-black dark:text-white font-bold">
							(Temporary Chat!)
						</p>) : ('')}
					)  : (
						<motion.div
							key={chatId}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.1 }}
						>
							{messages.map((message, index) => (
								<motion.div
									key={index || message._id || `${message.role}-${index}`}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 10 }}
									layout
									className={`flex mt-10 ${
										message.role === 'user' ? 'justify-end user-message' : 'justify-start'
									}`}
								>
									<div
										className={`max-w-3xl flex ${
											message.role === 'user' ? 'flex-row-reverse' : 'flex-row max-w-none w-full'
										} space-x-3`}
									>
										{/* Message Content */}
										<div className="flex flex-col w-full">
											<div
												id={message.id}
												className={`px-4 py-3 rounded-2xl ${
													message.role === 'user'
														? 'dark:bg-[#303030] dark:text-white bg-[#303030] text-white'
														: 'dark:bg-transparent dark:text-white bg-transparent text-black'
												}`}
											>
												{message.role === 'user' ? (
													<p className="whitespace-pre-wrap">{message.content}</p>
												) : (
													<div className="markdown-body w-full">
														<MarkdownMessage
															remarkPlugins={[remarkGfm]}
															rehypePlugins={[rehypeHighlight]}
															content={message.content}
														/>
													</div>
												)}
											</div>

											{/* Message Actions (only for AI messages) */}
											{message.role === 'model' && (
												<ResponseActions
													message={message}
													isDark={isDark}
													handlers={handlers}
													uiState={uiState}
													isSandbox={user?.userId ? false : true}
													handleScreenshot={handleScreenshot}
													isReading={isReading}
												/>
											)}
										</div>
									</div>
								</motion.div>
							))}
						</motion.div>
					)}
					{/* credit to chat owner */}
					{isReading && (
						<div className="text-lg text-center text-gray-500 dark:text-gray-400 mt-18">
							This is read-only chat shared by someone!
						</div>
					)}
				</AnimatePresence>

				{/* Typing Indicator */}
				<AnimatePresence>
					{isTyping && (
						<motion.div
							layout
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 10 }}
							className="flex justify-start"
						>
							<div className="flex space-x-3 ">
								<div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
									<span className="text-white text-sm font-medium">AI</span>
								</div>
								<div className={`px-4 py-3 rounded-2xl dark:bg-gray-800 bg-gray-100`}>
									<div className="flex space-x-1">
										<motion.div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></motion.div>
										<div
											className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
											style={{ animationDelay: '0.1s' }}
										/>
										<div
											className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
											style={{ animationDelay: '0.2s' }}
										/>
									</div>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default MessagesList;
