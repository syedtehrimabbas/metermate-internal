import {AppState} from 'react-native';
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createClient, processLock} from '@supabase/supabase-js';

const PUBLIC_SUPABASE_URL = 'https://puxbrtbjpgtxoidnlwch.supabase.co';
const PUBLIC_SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1eGJydGJqcGd0eG9pZG5sd2NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNTk1NTUsImV4cCI6MjA1OTYzNTU1NX0.JA_jQApUsRsRuCWQn5bz9eBIDhOtE_gs14VRjRAKkIw';

export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    lock: processLock,
  },
});

AppState.addEventListener('change', state => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});
