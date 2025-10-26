import React, { useState, useRef } from 'react';

const Input = ({ onSend, onCancel, isDark, isWaiting }) => {
	const [inputMessage, setInputMessage] = useState('');
	const textareaRef = useRef(null);

	const handleSend = e => {
		e && e.preventDefault();
		const content = inputMessage.trim();
		if (!content || isWaiting) return;
		onSend(content);
		setInputMessage('');
		// reset height
		if (textareaRef.current) textareaRef.current.style.height = 'auto';
	};

	const handleKeyPress = e => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	return (
		<div className={`p-4 max-w-[1000px] mx-auto w-full`}>
			<form onSubmit={handleSend} className="relative">
				<div
					className={`relative rounded-2xl border transition-colors dark:bg-[#303030] dark:border-white/10 bg-gray-100 border-black/10`}
				>
					<textarea
						ref={textareaRef}
						value={inputMessage}
						onChange={e => {
							setInputMessage(e.target.value);
							const t = e.target;
							t.style.height = 'auto';
							t.style.height = Math.min(t.scrollHeight, 240) + 'px';
						}}
						onKeyDown={handleKeyPress}
						placeholder="Message Zen-AI..."
						rows="1"
						className={`w-full px-4 py-3 pr-20 resize-none transition-colors rounded-2xl focus:outline-none dark:bg-transparent dark:text-white dark:placeholder-gray-400 bg-transparent text-black placeholder-gray-500 dark:scrollbar-thin dark:scrollbar-track-transparent dark:scrollbar-thumb-gray-600 dark:hover:scrollbar-thumb-gray-500 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400`}
						style={{
							maxHeight: '240px',
							overflowY: 'auto',
						}}
					/>

					{/* Buttons inside input */}
					<div className="absolute right-4 bottom-2 flex items-center space-x-1">
						{/* Voice Input Button (hidden)*/}
						<button
							type="button"
							className={`hidden p-2 cursor-pointer rounded-lg transition-colors ${
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
						{isWaiting ? (
							<button
								type="button"
								onClick={onCancel}
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
	);
};

export default Input;
