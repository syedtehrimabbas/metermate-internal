/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {SafeAreaView, StatusBar, useColorScheme} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import {store} from './src/redux';
import {RootNavigation} from './src/navigation/RootNavigation';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import 'react-native-url-polyfill/auto';


function App(): React.JSX.Element {
    const isDarkMode = useColorScheme() === 'dark';
    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.primaryDarkColor : Colors.primaryColor,
    };
    return (
        // <GestureHandlerRootView style={{flex: 1}}>
            <Provider store={store}>
                <SafeAreaProvider>
                    <SafeAreaView/>
                    <StatusBar
                        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                        backgroundColor={backgroundStyle.backgroundColor}
                    />
                    <RootNavigation/>
                    <SafeAreaView/>
                </SafeAreaProvider>
            </Provider>
        // </GestureHandlerRootView>
    );
}

export default App;
