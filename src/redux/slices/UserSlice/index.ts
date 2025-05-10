import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

export interface AuthenticationState {
    isAuthenticated: boolean;
}

const initialState: AuthenticationState = {
    isAuthenticated: false,
};

export const userSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        updateUser: (state, action: PayloadAction<boolean>) => {
            state.isAuthenticated = action.payload;
        },
    },
});

export const {updateUser} = userSlice.actions;

export default userSlice.reducer;
