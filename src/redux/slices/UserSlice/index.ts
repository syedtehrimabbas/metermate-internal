import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';
import MeterMateEncryptedStorage from '../../../LocalStorage';

export type SubscriptionStatus = 'active' | 'expired' | 'cancelled';

export interface SubscriptionHistoryItem {
  productId: string;
  purchaseTime: number;
  status: SubscriptionStatus;
}

export interface SubscriptionState {
  activeSubscription: 'monthly' | 'yearly' | null;
  subscriptionHistory: SubscriptionHistoryItem[];
}

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
  subscription: SubscriptionState;
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
  subscription: {
    activeSubscription: null,
    subscriptionHistory: [],
  },
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
        action.payload,
      );
    },
    clearUser: state => {
      state.userObject = getInitState();
      MeterMateEncryptedStorage.clearAll().then(r => {});
    },
    updateSubscription: (
      state,
      action: PayloadAction<{
        activeSubscription: 'monthly' | 'yearly' | null;
        history?: SubscriptionHistoryItem[];
      }>,
    ) => {
      state.subscription.activeSubscription = action.payload.activeSubscription;
      if (action.payload.history) {
        state.subscription.subscriptionHistory = action.payload.history;
      }
      MeterMateEncryptedStorage.setItem(
        MeterMateEncryptedStorage.SUBSCRIPTION_KEY,
        state.subscription,
      );
    },
    clearSubscription: state => {
      state.subscription = {
        activeSubscription: null,
        subscriptionHistory: [],
      };
      MeterMateEncryptedStorage.removeItem(
        MeterMateEncryptedStorage.SUBSCRIPTION_KEY,
      );
    },
  },
});
export const {updateUser, clearUser, updateSubscription, clearSubscription} =
  userSlice.actions;

export default userSlice.reducer;
