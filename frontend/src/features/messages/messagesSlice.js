import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
	messages: [],
};

const messagesSlice = createSlice({
	name: 'messages',
	initialState,
	reducers: {
		addMessage: {
			reducer(state, action) {
				state.messages.push(action.payload);
			},
			// allow passing an id (server-assigned) and other optional fields
			prepare({ id = null, role, content, timestamp = null, loved = false }) {
				return {
					payload: {
						id: id || nanoid(),
						role,
						content,
						loved,
						timestamp: timestamp || new Date().toISOString(),
					},
				};
			},
		},
		clearMessages(state) {
			state.messages = [];
		},
		setMessages(state, action) {
			state.messages = action.payload;
		},
		clearLastMessage(state) {
			state.messages.pop();
		},
		clearChat(state) {
			state.messages = [];
		},
		changeLovedMessage(state, action) {
			const { messageId, loved } = action.payload;
			const message = state.messages.find(message => message.id === messageId);
			if (message) {
				message.loved = loved;
			}
		},
	},
});

export const {
	addMessage,
	clearMessages,
	clearChat,
	clearLastMessage,
	setMessages,
	changeLovedMessage,
} = messagesSlice.actions;
export default messagesSlice.reducer;
