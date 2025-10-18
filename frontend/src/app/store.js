// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import messagesReducer from '../features/messages/messagesSlice';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
	reducer: {
		messages: messagesReducer,
		ui: uiReducer,
	},
});
