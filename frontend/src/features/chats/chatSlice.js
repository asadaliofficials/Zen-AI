import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	chats: [],
	chatId: null,
	isTemp: false,
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
		setChatId(state, action) {
			state.chatId = action.payload;
		},
		setTempChat(state, action) {
			state.isTemp = action.payload;
		},
	},
});

export const { addChats, addOneChat, deleteOneChat, setChatId, setTempChat } = chatSlice.actions;
export default chatSlice.reducer;
