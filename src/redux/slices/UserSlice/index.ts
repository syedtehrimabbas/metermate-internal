import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';
import MeterMateEncryptedStorage from '../../../LocalStorage';

export interface AuthenticationState {
  userObject: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
    expires_in: number;
    token_type: string;
    user: {
      app_metadata: {
        provider: string;
      };
      aud: string;
      confirmed_at: string;
      created_at: string;
      email: string;
      email_confirmed_at: string;
      id: string;
      is_anonymous: boolean;
      last_sign_in_at: string;
      phone: string;
      role: string;
      updated_at: string;
      user_metadata: {
        email_verified: boolean;
      };
    };
  };
}

const getInitState = () => {
  return {
    access_token: '',
    expires_at: 1,
    expires_in: 1,
    refresh_token: '',
    token_type: 'bearer',
    user: {
      app_metadata: {
        provider: '',
      },
      aud: 'authenticated',
      confirmed_at: '',
      created_at: '',
      email: '',
      email_confirmed_at: '',
      id: '',
      is_anonymous: false,
      last_sign_in_at: '',
      phone: '',
      role: 'authenticated',
      updated_at: '',
      user_metadata: {
        email_verified: false,
      },
    },
  };
};
const initialState: AuthenticationState = {
  userObject: getInitState(),
};

export const userSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    updateUser: (
      state,
      action: PayloadAction<AuthenticationState['userObject']>,
    ) => {
      state.userObject = action.payload;
      MeterMateEncryptedStorage.setItem(
        MeterMateEncryptedStorage.USER_KEY,
        JSON.stringify(action.payload),
      );
    },
    clearUser: state => {
      state.userObject = getInitState();
      MeterMateEncryptedStorage.clearAll().then(r => {});
    },
  },
});
export const {updateUser, clearUser} = userSlice.actions;

export default userSlice.reducer;
