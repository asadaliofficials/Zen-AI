// features/theme/themeSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	isDark: false,
};

export const themeSlice = createSlice({
	name: 'theme',
	initialState,
	reducers: {
		toggleTheme: state => {
			state.isDark = !state.isDark;
		},
		setTheme: (state, action) => {
			state.isDark = !!action.payload;
		},
	},
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
