import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
};

const messagesSlice = createSlice({
  name: "messages",
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
    setMessages(state, action) {
      state.messages = action.payload;
    },
    clearLastMessage(state) {
      state.messages.pop();
    },
    clearChat(state) {
      state.messages = [];
    },
  },
});

export const {
  addMessage,
  clearMessages,
  clearChat,
  clearLastMessage,
  setMessages,
} = messagesSlice.actions;
export default messagesSlice.reducer;
