import {configureStore} from '@reduxjs/toolkit';
import userReducer from '../slices/UserSlice';

export const store = configureStore({
    reducer: {
        userInfo: userReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
