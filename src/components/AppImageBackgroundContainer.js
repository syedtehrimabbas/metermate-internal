import React from 'react';
import {
  ImageBackground,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import Loader from './Loader';
import Colors from '../theme/colors';

const AppImageBackgroundContainer = ({children, loading, backgroundImage}) => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.rootContainer}>
      <ImageBackground
        source={backgroundImage}
        style={styles.backgroundImage}
        resizeMode="cover">
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor="transparent"
          translucent
        />
        <SafeAreaView style={styles.safeArea}>
          <Loader loading={loading} />
          {children}
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: Colors.accentColor,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});

export default AppImageBackgroundContainer;
