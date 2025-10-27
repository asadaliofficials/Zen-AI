import React from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import ResponceActions from './ResponceActions';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/monokai.css';
import { MarkdownMessage } from '../MarkdownMessage';
import { takeScreenshot } from '../../utils/screenshot.util';
import { getRandomName } from '../../utils/getRandomName.util';

const MessagesList = ({ messages, isDark, isTyping, handlers, uiState }) => {
	const handleScreenshot = id => {
		const elem = document.getElementById(id);
		if (!elem) return;

		try {
			const name = getRandomName();
			takeScreenshot(elem, name); // ✅ pass element and file name
		} catch (error) {
			console.error('Screenshot failed:', error);
		}
	};

	return (
		<div
			className={`messages-container flex-1 overflow-y-auto p-4 space-y-6 dark:scrollbar-thin dark:scrollbar-track-transparent dark:scrollbar-thumb-gray-600 dark:hover:scrollbar-thumb-gray-500 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400`}
		>
			<div className="max-w-[1000px] w-full mx-auto">
				<AnimatePresence initial={false}>
					{messages.length < 1 ? (
						<p className="absolute top-[50%] left-[50%] -translate-[50%] text-3xl text-black dark:text-white font-bold">
							What can I help with?
						</p>
					) : (
						messages.map(message => (
							<Motion.div
								key={message.id}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: 10 }}
								layout
								className={`flex mt-10 ${
									message.role === 'user' ? 'justify-end user-message' : 'justify-start'
								}`}
							>
								<div
									className={`max-w-3xl flex  ${
										message.role === 'user' ? 'flex-row-reverse' : 'flex-row max-w-none w-full'
									} space-x-3`}
								>
									{/* Message Content */}
									<div className="flex flex-col  w-full">
										<div
											id={message.id}
											className={`px-4 py-3 rounded-2xl   ${
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
											<ResponceActions
												message={message}
												isDark={isDark}
												handlers={handlers}
												uiState={uiState}
												isSandbox={true}
												handleScreenshot={handleScreenshot}
											/>
										)}
									</div>
								</div>
							</Motion.div>
						))
					)}
				</AnimatePresence>

				{/* Typing Indicator */}
				<AnimatePresence>
					{isTyping && (
						<Motion.div
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
										<Motion.div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></Motion.div>
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
						</Motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
};

export default MessagesList;
