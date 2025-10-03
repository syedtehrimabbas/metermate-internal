import React from 'react';
import {
  ImageBackground,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import Loader from './Loader';
import Colors from '../theme/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

const AppImageBackgroundContainer = ({
  children,
  loading,
  backgroundImage,
  backgroundColor  = Colors.white,
}) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: backgroundColor
      }}>
      <ImageBackground
        source={backgroundImage}
        style={styles.backgroundImage}
        resizeMode="cover">
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
          <Loader loading={loading} />
          {children}
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
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
