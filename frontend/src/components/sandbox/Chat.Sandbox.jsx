import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import '../../css/chat.css';
import MessagesList from '../home/MessagesList';
import Input from '../home/Input';
import screenShotAudio from '../../assets/sound/screenshot.mp3';

import { addMessage, clearChat } from '../../features/messages/messagesSlice';
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

	const findScrollContainer = el => {
		let cur = el;
		while (cur) {
			const style = window.getComputedStyle(cur);
			const overflowY = style.overflowY;
			if ((overflowY === 'auto' || overflowY === 'scroll') && cur.scrollHeight > cur.clientHeight) {
				return cur;
			}
			cur = cur.parentElement;
		}
		return null;
	};

	const scrollToFullBottom = () => {
		// Get the scrollable container
		const container = document.querySelector('.messages-container');
		if (!container) return;

		// Wait for next frame to ensure layout is updated (React just rendered)
		requestAnimationFrame(() => {
			// Optional: wait one more frame for animation-heavy DOM (Markdown, syntax highlighting)
			requestAnimationFrame(() => {
				container.scrollTo({
					top: container.scrollHeight,
					behavior: 'smooth',
				});
			});
		});
	};

	const scrollToSmartPosition = () => {
		// Find container reliably (start from any message element)
		const anyMessage = document.querySelector('.messages-container .flex.mt-10');
		if (!anyMessage) return;
		const container =
			findScrollContainer(anyMessage) || document.querySelector('.messages-container');
		if (!container) return;

		// Don't auto-scroll if user is far from bottom (reading older messages)
		const distanceFromBottom =
			container.scrollHeight - container.scrollTop - container.clientHeight;
		const DISTANCE_THRESHOLD = 2000; // px; tune as you like
		if (distanceFromBottom > DISTANCE_THRESHOLD) {
			// user is reading old messages — do not disturb
			return;
		}

		// Wait a frame to ensure the DOM layout has updated (helps with streaming / animations)
		requestAnimationFrame(() => {
			// second frame to be extra-safe (keeps it reliable)
			requestAnimationFrame(() => {
				// Find the last user message element
				const userMessages = container.querySelectorAll('.user-message');
				if (!userMessages.length) {
					// fallback: scroll to bottom
					container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
					return;
				}

				const lastUser = userMessages[userMessages.length - 1];

				// Last message element in container (the AI response)
				// We must find the actual message wrapper (the .flex.mt-10 element) as the "last message"
				const allMessageWrappers = container.querySelectorAll('.flex.mt-10');
				const lastMessageWrapper = allMessageWrappers[allMessageWrappers.length - 1];
				if (!lastMessageWrapper) {
					container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
					return;
				}

				// Get bounding rects relative to viewport
				const containerRect = container.getBoundingClientRect();
				const userRect = lastUser.getBoundingClientRect();
				const aiRect = lastMessageWrapper.getBoundingClientRect();

				// Compute positions relative to container's scrollTop
				// position of user's top inside container content (in px)
				const userTopRel = userRect.top - containerRect.top + container.scrollTop;
				const aiBottomRel =
					aiRect.top - containerRect.top + container.scrollTop + lastMessageWrapper.offsetHeight;

				const containerHeight = container.clientHeight;

				// If AI response fits below user's top within container viewport: scroll fully to bottom
				if (aiBottomRel - userTopRel <= containerHeight) {
					container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
				} else {
					// Otherwise scroll so the last user message is at (top - 50px)
					const desiredTop = Math.max(0, userTopRel - 50);
					container.scrollTo({ top: desiredTop, behavior: 'smooth' });
				}
			});
		});
	};

	const handleDeleteChat = () => {
		dispatch(clearChat());
		setChatId(null);
	};

	useEffect(() => {
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
				scrollToSmartPosition();

				if (!chatId && data.content.chatId) setChatId(data.content.chatId);
			} catch (error) {
				// dispatch(clearLastMessage());
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
