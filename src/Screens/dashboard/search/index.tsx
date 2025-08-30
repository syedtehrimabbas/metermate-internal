import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {AppImages} from '../../../images';
import colors from '../../../theme/colors.js';
import {AppFonts} from '../../../fonts';
import {scaledFontWidth} from '../../../utils/AppUtils.js';
import SearchBar from '../../../components/searchbar';
import {useDispatch, useSelector} from 'react-redux';
import MyProfileScreen from '../../profile/MyProfile.tsx';
import {useFocusEffect} from '@react-navigation/native';
import AppImageBackgroundContainer from '../../../components/AppImageBackgroundContainer';

type Props = {
  navigation: any;
};
const SearchScreen = ({navigation}: Props) => {
  const dispatch = useDispatch(); // Access dispatch
  const reduxUserObject = useSelector(
    (state: any) => state.userInfo.userObject,
  );
  const [userObject, setUserObject] = useState(reduxUserObject);

  useFocusEffect(
    useCallback(() => {
      setUserObject(reduxUserObject); // sync with latest Redux value on focus
    }, [reduxUserObject]),
  );

  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [imageSource, setImageSource] = useState(
    !imageError && userObject?.localUserData?.profile_photo
      ? {uri: userObject.localUserData.profile_photo}
      : AppImages.user_placeholder_default,
  );

  useEffect(() => {
    if (!imageError && userObject?.localUserData?.profile_photo) {
      setImageSource({uri: userObject.localUserData.profile_photo});
    } else {
      setImageSource(AppImages.user_placeholder_default);
    }
  }, [userObject, imageError]);
  return (
    <AppImageBackgroundContainer
      backgroundImage={AppImages.lines_vector}
      loading={false}
      children={
        <View style={styles.container}>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <Pressable
              style={styles.parent}
              onPress={() => {
                navigation.navigate(MyProfileScreen);
              }}>
              <View style={styles.imageContainer}>
                {imageLoading && !imageError && (
                  <ActivityIndicator
                    style={styles.loader}
                    size="large"
                    color="#888"
                  />
                )}
                <Image
                  style={styles.icon}
                  resizeMode="cover"
                  source={imageSource}
                  onLoadStart={() => setImageLoading(true)}
                  onLoadEnd={() => setImageLoading(false)}
                  onError={e => {
                    setImageLoading(false);
                  }}
                />
              </View>
            </Pressable>
            {/*<Pressable
              style={[styles.frameParent, styles.parentFlexBox]}
              onPress={() => {
                dispatch(clearUser()); // User is authenticated
              }}>
              <View style={[styles.logIn04Parent, styles.parentFlexBox]}>
                <Image
                  style={styles.logIn04Icon}
                  resizeMode="cover"
                  source={AppImages.logout}
                />
                <Text style={styles.userEmail}>{'logout'}</Text>
              </View>
            </Pressable>*/}
          </View>

          <Text style={styles.findText}>Find</Text>
          <Text style={styles.electricProviderLabel}>Electric Provider</Text>
          <SearchBar navigation={navigation} />
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    padding: 20,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    borderRadius: 100,
    flex: 1,
    height: '100%',
    overflow: 'hidden',
    width: '100%',
    backgroundColor: 'rgba(151, 148, 148, 0.46)',
  },
  loader: {
    position: 'absolute',
    zIndex: 1,
  },
  parent: {
    height: 48,
    width: 48,
  },
  parentFlexBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logIn04Icon: {
    width: 24,
    height: 24,
    overflow: 'hidden',
  },
  userEmail: {
    fontSize: 13,
    letterSpacing: 0,
    lineHeight: 20,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
    color: '#000',
    textAlign: 'left',
  },
  logIn04Parent: {
    width: 63,
    flexDirection: 'row',
    gap: 6,
  },
  frameParent: {
    borderRadius: 118,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    width: 120,
    paddingHorizontal: 15,
    paddingVertical: 12,
    overflow: 'hidden',
  },
  findText: {
    fontSize: scaledFontWidth(13),
    letterSpacing: 0,
    lineHeight: 20,
    fontFamily: AppFonts.general_regular,
    color: colors.textColor,
    textAlign: 'left',
    marginTop: 20,
  },
  electricProviderLabel: {
    fontSize: scaledFontWidth(28),
    letterSpacing: -0.6,
    lineHeight: 34,
    fontWeight: '500',
    fontFamily: AppFonts.general_regular,
    color: colors.textColor,
    textAlign: 'left',
    marginTop: 10,
  },
});
export default SearchScreen;
