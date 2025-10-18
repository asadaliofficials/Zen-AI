import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

import { ToastContainer, toast } from 'react-toastify';

import '../../css/chat.css';
import TopBar from '../home/TopBar';
import MessagesList from '../home/MessagesList';
import Input from '../home/Input';
import screenShotAudio from '../../assets/sound/screenshot.mp3';

import { addMessage, clearLastMessage } from '../../features/messages/messagesSlice';
import {
	setTyping,
	setWaiting,
	setCancelRequestId,
	setCopyState,
	setScreenshotState,
	toggleLove,
	setReadingMessage,
	setSelectedModel,
} from '../../features/ui/uiSlice';
// import { toggleTheme, setTheme } from '../../features/theme/themeSlice';
import { userSocket } from '../../sockets/client.socket';

const ChatSandbox = () => {
	const dispatch = useDispatch();
	const messages = useSelector(state => state.messages.messages);
	const ui = useSelector(state => state.ui);
	const [chatId, setChatId] = useState(null);

	const cancelRef = useRef(null);

	const playSound = () => {
		const audio = new Audio(screenShotAudio);
		audio.play();
	};

	const scrollToBottom = () => {
		const messagesContainer = document.querySelector('.messages-container');
		if (messagesContainer) messagesContainer.scrollTop = messagesContainer.scrollHeight;
	};

	const isNearBottom = () => {
		const messagesContainer = document.querySelector('.messages-container');
		if (!messagesContainer) return false;
		const { scrollTop, scrollHeight, clientHeight } = messagesContainer;
		return scrollHeight - scrollTop - clientHeight < 100;
	};

	// useEffect(() => {
	// 	userSocket.on('response', data => {
	// 		try {
	// 			if (!data.success) {
	// 				throw new Error(data.message);
	// 			}
	// 			dispatch(addMessage({ role: 'model', content: data.content.text }));
	// 			if (isNearBottom()) scrollToBottom();
	// 			if (!chatId && data.content.chatId) setChatId(data.content.chatId);
	// 		} catch (error) {
	// 			dispatch(clearLastMessage());
	// 			toast.error(error.message);
	// 		} finally {
	// 			dispatch(setTyping(false));
	// 			dispatch(setWaiting(false));
	// 			dispatch(setCancelRequestId(null));
	// 		}
	// 	});
	// 	return () => {
	// 		userSocket.off('response');
	// 	};
	// }, []);
	const handlers = {
		sendMessage: async ({ content }) => {
			if (!content || ui.isWaitingForResponse) return;
			dispatch(addMessage({ role: 'user', content }));
			dispatch(setWaiting(true));
			dispatch(setTyping(true));

			setTimeout(() => scrollToBottom(), 100);

			userSocket.emit('message', JSON.stringify({ message: content, chatId: chatId || 'null' }));
		},
		cancelRequest: () => {
			if (cancelRef.current) {
				clearTimeout(cancelRef.current);
				cancelRef.current = null;
			}
			dispatch(setWaiting(false));
			dispatch(setTyping(false));
			dispatch(setCancelRequestId(null));
		},
		copyMessage: (content, messageId) => {
			navigator.clipboard.writeText(content);
			dispatch(setCopyState({ messageId, value: true }));
			setTimeout(() => dispatch(setCopyState({ messageId, value: false })), 1500);
		},
		screenshot: messageId => {
			playSound();
			dispatch(setScreenshotState({ messageId, value: true }));
			setTimeout(() => dispatch(setScreenshotState({ messageId, value: false })), 1500);
		},
		loveMessage: messageId => dispatch(toggleLove(messageId)),
		shareMessage: messageId => console.log('Share message', messageId),
		readAloud: (content, messageId) => {
			const readingId = ui.readingMessageId;
			if (readingId === messageId) {
				speechSynthesis.cancel();
				dispatch(setReadingMessage(null));
			} else {
				if ('speechSynthesis' in window) {
					speechSynthesis.cancel();
					const utter = new SpeechSynthesisUtterance(content);
					utter.onend = () => dispatch(setReadingMessage(null));
					speechSynthesis.speak(utter);
					dispatch(setReadingMessage(messageId));
				}
			}
		},
		setModel: modelId => dispatch(setSelectedModel(modelId)),
	};

	return (
		<div className={`flex-1 flex flex-col h-screen dark:bg-[#212121] bg-white`}>
			<TopBar
				setShowModel={() => {}}
				models={[
					{ id: 'zen-1.5', name: 'zen-1.5' },
					{ id: 'zen-2.0', name: 'zen-2.0' },
					{ id: 'zen-3.5', name: 'zen-3.5' },
					{ id: 'zen-4.0', name: 'zen-4.0' },
				]}
				selectedModel={ui.selectedModel}
				setSelectedModel={id => handlers.setModel(id)}
				toggleTheme={() => handlers.toggleTheme()}
			/>

			<MessagesList messages={messages} isTyping={ui.isTyping} handlers={handlers} uiState={ui} />

			<Input
				onSend={content => handlers.sendMessage({ content })}
				onCancel={() => handlers.cancelRequest()}
				isWaiting={ui.isWaitingForResponse}
			/>
		</div>
	);
};

export default ChatSandbox;
