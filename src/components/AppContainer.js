import React from 'react';
import {StatusBar, useColorScheme, View} from 'react-native';
import Loader from './Loader';
import colors from '../theme/colors';

const AppContainer = ({children, loading, backgroundColor = colors.white}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? colors.primaryDarkColor : colors.primaryColor,
  };
  return (
    <View
      style={{
        backgroundColor: backgroundColor ? backgroundColor : colors.white,
        flex: 1,
        flexDirection: 'column',
      }}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <Loader loading={loading} />
      {children}
    </View>
  );
};
export default AppContainer;
