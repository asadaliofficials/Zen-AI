import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	isTyping: false,
	isWaitingForResponse: false,
	cancelRequestId: null,
	copyStates: {},
	screenshotStates: {},
	lovedMessages: {},
	readingMessageId: null,
	selectedModel: 'zen-1.5',
};

const uiSlice = createSlice({
	name: 'ui',
	initialState,
	reducers: {
		setTyping(state, action) {
			state.isTyping = !!action.payload;
		},
		setWaiting(state, action) {
			state.isWaitingForResponse = !!action.payload;
		},
		setCancelRequestId(state, action) {
			state.cancelRequestId = action.payload;
		},
		setCopyState(state, action) {
			const { messageId, value } = action.payload;
			state.copyStates[messageId] = value;
		},
		setScreenshotState(state, action) {
			const { messageId, value } = action.payload;
			state.screenshotStates[messageId] = value;
		},
		toggleLove(state, action) {
			const id = action.payload;
			state.lovedMessages[id] = !state.lovedMessages[id];
		},
		setReadingMessage(state, action) {
			state.readingMessageId = action.payload;
		},
		setSelectedModel(state, action) {
			state.selectedModel = action.payload;
		},
	},
});

export const {
	setTyping,
	setWaiting,
	setCancelRequestId,
	setCopyState,
	setScreenshotState,
	toggleLove,
	setReadingMessage,
	setSelectedModel,
} = uiSlice.actions;

export default uiSlice.reducer;
