import React from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import Loader from './Loader';
import colors from '../theme/colors';

const AppContainer = ({children, loading, backgroundColor = colors.white}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={[styles.container, {backgroundColor}]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <SafeAreaView style={styles.safeArea}>
        <Loader loading={loading} />
        {children}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});

export default AppContainer;
