/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import {Platform, SafeAreaView, StatusBar, useColorScheme} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import {store} from './src/redux';
import {RootNavigation} from './src/navigation/RootNavigation';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import 'react-native-url-polyfill/auto';
import {setup} from 'react-native-iap';
import {
  flushFailedPurchasesCachedAsPendingAndroid,
  initConnection,
} from 'react-native-iap';
setup({storekitMode: 'STOREKIT2_MODE'});

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  useEffect(() => {
    establishConnection();
  }, []);
  // Initialize IAP connection
  const establishConnection = async () => {
    try {
      await initConnection();
      if (Platform.OS === 'android') {
        await flushFailedPurchasesCachedAsPendingAndroid();
      }
    } catch (error) {
      console.error('Error in fetchData:', error);
    }
  };
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.primaryDarkColor : Colors.primaryColor,
  };
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <RootNavigation />
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
