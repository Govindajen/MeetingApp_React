import { configureStore } from '@reduxjs/toolkit';
import { getDefaultMiddleware } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import postsSlice from './slices/postsSlice';
import fetchSlice from './slices/fetchSlice';



const store = configureStore({
    reducer: {
        auth: authSlice,
        posts: postsSlice,
        users: fetchSlice,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store