import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

import { addMessage, clearMessages, setMessages } from '../../features/messages/messagesSlice';
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
import { scrollToFullBottom, smartScroll } from '../../utils/autoScroll.util';

import TopBar from './TopBar';
import MessagesList from './MessagesList';
import Input from './Input';
import screenShotAudio from '../../assets/sound/screenshot.mp3';

import '../../css/chat.css';

const Chat = () => {
	const dispatch = useDispatch();
	const Navigate = useNavigate();
	const { id } = useParams();

	const messages = useSelector(state => state.messages.messages);
	const ui = useSelector(state => state.ui);
	const chatId = useSelector(state => state.chats.chatId);
	const [isNewChat, setIsNewChat] = useState(false);

	const cancelRef = useRef(null);
	const lastFetchedRef = useRef(null); // 🧠 Track last fetched chatId

	// 🟢 Fetch chat messages from backend
	const getChatMessages = async id => {
		try {
			console.log('Fetching chat messages for:', id);
			const response = await axios.get(`http://localhost:3000/api/v1/chat/${id}`, {
				withCredentials: true,
			});

			const chat = response.data.chat;
			const contents = response.data.messages.contents;

			document.title = chat.title || 'Chat';

			const formattedMessages = contents.flatMap(item => [
				{ role: 'user', content: item.userMessage },
				{ role: 'model', content: item.aiResponse },
			]);

			dispatch(setMessages(formattedMessages));
			scrollToFullBottom();
			console.log('Loaded messages:', formattedMessages);
		} catch (error) {
			console.error('Error fetching chat messages:', error);
			toast.error('Failed to load chat messages');
			Navigate('/');
		}
	};

	// 🧩 Prevent double fetching
	const safeGetChatMessages = id => {
		if (!id) return;
		if (lastFetchedRef.current === id) return;
		lastFetchedRef.current = id;
		if (!isNewChat) {
			getChatMessages(id);
		}
	};

	// 🟢 On first mount → use URL param
	useEffect(() => {
		console.log(id);
		if (id) {
			dispatch(setChatId(id));
			safeGetChatMessages(id);
		}
	}, []); // Run only once on mount

	// 🟢 When Redux chatId changes (sidebar click)
	useEffect(() => {
		if (chatId && chatId !== id) {
			Navigate(`/chat/${chatId}`, { replace: true });
			safeGetChatMessages(chatId);
		}
	}, [chatId]);

	// 🟢 Socket listener
	useEffect(() => {
		dispatch(clearMessages());

		userSocket.on('response', data => {
			try {
				if (!data.success) {
					dispatch(addMessage({ role: 'model', content: data.message }));
					scrollToFullBottom();
					throw new Error(data.message);
				}

				dispatch(addMessage({ role: 'model', content: data.content.text }));

				if (data.isNewChat) {
					dispatch(addOneChat({ title: data.content.title, id: data.content.chatId }));
					document.title = data.content.title;
					Navigate(`/chat/${data.content.chatId}`, { replace: true });
				}
				setIsNewChat(data.isNewChat);

				if (!chatId && data.content.chatId) {
					dispatch(setChatId(data.content.chatId));
				}
				if (!data.isNewChat) {
					smartScroll();
				}
			} catch (error) {
				toast.error(error.message);
			} finally {
				dispatch(setTyping(false));
				dispatch(setWaiting(false));
				dispatch(setCancelRequestId(null));
			}
		});

		return () => userSocket.off('response');
	}, []);

	// 🧩 Handlers (unchanged except simplified sendMessage)
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
			new Audio(screenShotAudio).play();
			dispatch(setScreenshotState({ messageId, value: true }));
			setTimeout(() => dispatch(setScreenshotState({ messageId, value: false })), 1500);
		},
		loveMessage: messageId => dispatch(toggleLove(messageId)),
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
		<div className="flex-1 flex flex-col h-screen dark:bg-[#212121] bg-white">
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
				onShareChat={() => {}}
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
