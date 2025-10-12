import { createSlice } from '@reduxjs/toolkit';

const [isDark, setIsDark] = useState(false);

export const themeSlice = createSlice({
	name: 'theme',
	initialState: isDark,
	reducers: {
		toggleTheme: state => {
			state.value += 1;
		},
	},
});

// Action creators are generated for each case reducer function
export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;
