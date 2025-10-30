import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import '../../css/chat.css';
import MessagesList from '../home/MessagesList';
import Input from '../home/Input';
import screenShotAudio from '../../assets/sound/screenshot.mp3';

import { addMessage, clearChat, clearMessages } from '../../features/messages/messagesSlice';
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
import TopBarSandbox from './TopBar.sandbox';
import { sandboxSocket } from '../../sockets/client.socket';
import { toast } from 'react-toastify';
import mdToPlainText from '../../utils/mdToText.util';
import { scrollToFullBottom, smartScroll } from '../../utils/autoScroll.util';

const ChatSandbox = () => {
	// dispatch(addMessage({ role: 'model', content: `` }));

	const dispatch = useDispatch();
	const messages = useSelector(state => state.messages.messages);
	const ui = useSelector(state => state.ui);
	const [chatId, setChatId] = useState(null);

	const cancelRef = useRef(null);

	const playSound = () => {
		const audio = new Audio(screenShotAudio);
		audio.play();
	};

	const handleDeleteChat = () => {
		dispatch(clearChat());
		setChatId(null);
	};

	useEffect(() => {
		dispatch(clearMessages());
		sandboxSocket.on('response', data => {
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
			sandboxSocket.off('response');
		};
	}, []);
	const handlers = {
		sendMessage: async ({ content }) => {
			if (!content || ui.isWaitingForResponse) return;
			dispatch(addMessage({ role: 'user', content }));
			dispatch(setWaiting(true));
			dispatch(setTyping(true));

			setTimeout(() => scrollToFullBottom(), 100);

			if (!sandboxSocket.connected) {
				setTimeout(() => {
					dispatch(
						addMessage({
							role: 'model',
							content:
								'Failed to connect with server, check you internet connection or try again later!',
						})
					);
					scrollToFullBottom();
					dispatch(setTyping(false));
					dispatch(setWaiting(false));
					dispatch(setCancelRequestId(null));
				}, 1000);
				return;
			}

			sandboxSocket.emit('message', JSON.stringify({ message: content, chatId: chatId || 'null' }));
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
			const plainText = mdToPlainText(content);
			navigator.clipboard.writeText(plainText);
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

			// Remove Markdown symbols
			const plainText = mdToPlainText(content);

			if (readingId === messageId) {
				speechSynthesis.cancel();
				dispatch(setReadingMessage(null));
			} else {
				if ('speechSynthesis' in window) {
					speechSynthesis.cancel();
					const utter = new SpeechSynthesisUtterance(plainText.trim());
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
			<TopBarSandbox
				setShowModel={() => {}}
				models={[
					{ id: 'zen-1.5', name: 'zen-1.5' },
					{ id: 'zen-2.0', name: 'zen-2.0' },
					{ id: 'zen-3.5', name: 'zen-3.5' },
					{ id: 'zen-4.0', name: 'zen-4.0' },
				]}
				selectedModel={ui.selectedModel}
				handleDeleteChat={handleDeleteChat}
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
