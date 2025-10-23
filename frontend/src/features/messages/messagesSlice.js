import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
	messages: [
		{
			id: nanoid(),
			role: 'user',
			content: 'Hello! How can you help me today?',
			timestamp: new Date().toISOString(),
		},
		{
			id: nanoid(),
			role: 'model',
			content: `### Here's some Express code

**Steps:**
1. Install dependencies
\n
2. Run the server

\`\`\`javascript
const express = require('express');
const app = express();
app.get('/', (req, res) => res.send('Hello World!'));
app.listen(3000);
\`\`\``,
			timestamp: new Date().toISOString(),
		},
	],
};

const messagesSlice = createSlice({
	name: 'messages',
	initialState,
	reducers: {
		addMessage: {
			reducer(state, action) {
				state.messages.push(action.payload);
			},
			prepare({ role, content }) {
				return {
					payload: {
						id: nanoid(),
						role,
						content,
						timestamp: new Date().toISOString(),
					},
				};
			},
		},
		clearMessages(state) {
			state.messages = [];
		},
		clearLastMessage(state) {
			state.messages.pop();
		},
		clearChat(state) {
			state.messages = [];
		},
		replaceLastAssistantMessage(state, action) {
			// Replace the last model message content (useful for streaming)
			const lastIndex = [...state.messages].reverse().findIndex(m => m.role === '');
			if (lastIndex === -1) return;
			const idx = state.messages.length - 1 - lastIndex;
			state.messages[idx] = { ...state.messages[idx], ...action.payload };
		},
	},
});

export const {
	addMessage,
	clearMessages,
	clearChat,
	clearLastMessage,
	replaceLastAssistantMessage,
} = messagesSlice.actions;
export default messagesSlice.reducer;
