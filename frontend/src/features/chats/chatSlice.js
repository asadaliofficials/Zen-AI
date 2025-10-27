import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	chats: [],
};

const chatSlice = createSlice({
	name: 'chats',
	initialState,
	reducers: {
		addOneChat(state, action) {
			state.chats.push(action.payload);
		},
		deleteOneChat(state, action) {
			state.chats = state.chats.filter(chat => chat.id !== action.payload);
		},
		addChats(state, action) {
			state.chats = action.payload;
		},
	},
});

export const { addChats, addOneChat, deleteOneChat } = chatSlice.actions;
export default chatSlice.reducer;
