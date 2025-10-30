import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';

import { toast } from 'react-toastify';

import '../../css/chat.css';
import TopBar from './TopBar';
import MessagesList from './MessagesList';
import Input from './Input';
import screenShotAudio from '../../assets/sound/screenshot.mp3';

import { addMessage, clearMessages } from '../../features/messages/messagesSlice';
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
import { addOneChat, setChatId, setTempChat } from '../../features/chats/chatSlice';
import { userSocket } from '../../sockets/client.socket';
import { useNavigate } from 'react-router-dom';
import { scrollToFullBottom, smartScroll } from '../../utils/autoScroll.util';
import axios from 'axios';

const Chat = () => {
	const dispatch = useDispatch();
	const Navigate = useNavigate();
	const messages = useSelector(state => state.messages.messages);
	const ui = useSelector(state => state.ui);
	const chatId = useSelector(state => state.chats.chatId);
	console.log(chatId);

	const handleShareChat = () => {};

	const cancelRef = useRef(null);

	const playSound = () => {
		const audio = new Audio(screenShotAudio);
		audio.play();
	};

	useEffect(() => {
		const getChatMessages = async () => {
			console.log('getting chat messages...');
			const response = await axios.get(`http://localhost:3000/api/v1/chat/${chatId}`, {
				withCredentials: true,
			});
			console.log(response);
		};
		if (chatId) {
			document.title = chatId;
			Navigate(`/chat/${chatId}`);
			getChatMessages();
		} else {
			Navigate(`/`);
		}
	}, [chatId]);

	useEffect(() => {
		dispatch(clearMessages());
		userSocket.on('response', data => {
			try {
				if (!data.success) {
					dispatch(
						addMessage({
							role: 'model',
							content: data.message,
						})
					);
					scrollToFullBottom();
					throw new Error(data.message);
				}
				dispatch(addMessage({ role: 'model', content: data.content.text }));
				if (data.isNewChat) {
					dispatch(addOneChat({ title: data.content.title, id: data.content.chatId }));
					document.title = data.content.title;
					Navigate(`/chat/${chatId}`);
				}
				smartScroll();

				if (!chatId && data.content.chatId) setChatId(data.content.chatId);
			} catch (error) {
				toast.error(error.message);
			} finally {
				dispatch(setTyping(false));
				dispatch(setWaiting(false));
				dispatch(setCancelRequestId(null));
			}
		});
		return () => {
			userSocket.off('response');
		};
	}, []);

	const handlers = {
		sendMessage: async ({ content }) => {
			if (!content || ui.isWaitingForResponse) return;
			dispatch(addMessage({ role: 'user', content }));
			dispatch(setWaiting(true));
			dispatch(setTyping(true));

			setTimeout(() => scrollToFullBottom(), 100);

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
				onShareChat={handleShareChat}
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

export default Chat;
