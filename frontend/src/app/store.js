// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import messagesReducer from '../features/messages/messagesSlice';
import chatsReducer from '../features/chats/chatSlice';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
	reducer: {
		messages: messagesReducer,
		ui: uiReducer,
		chats: chatsReducer,
	},
});
