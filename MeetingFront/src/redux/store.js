import { configureStore } from '@reduxjs/toolkit';
import { getDefaultMiddleware } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import fetchSlice from './slices/fetchSlice';



const store = configureStore({
    reducer: {
        auth: authSlice,
        users: fetchSlice,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store