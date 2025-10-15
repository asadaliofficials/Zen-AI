// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '../features/theme/themeSlice';
import messagesReducer from '../features/messages/messagesSlice';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
	reducer: {
		theme: themeReducer,
		messages: messagesReducer,
		ui: uiReducer,
	},
});
