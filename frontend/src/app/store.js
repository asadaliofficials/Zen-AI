import { configureStore } from '@reduxjs/toolkit';

// reducers
import { toggleTheme } from '../features/theme/themeSlice.js';
export const store = configureStore({
	reducer: { toggleTheme },
});
