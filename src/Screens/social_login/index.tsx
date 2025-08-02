import React, {useState} from 'react';
import {
  Alert,
  Image,
  ImageSourcePropType,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../../theme/colors';
import {AppImages} from '../../images';
import {AppFonts} from '../../fonts';
import {getScaledHeight, scaledFontWidth} from '../../utils/AppUtils.js';
import {supabase} from '../../utils/supabase.ts';
import {useDispatch} from 'react-redux';
import {updateUser} from '../../redux';
import AppContainer from '../../components/AppContainer';

type SocialButtonProps = {
  onPress: () => void; // Simple function type for onPress
  icon: ImageSourcePropType;
  title: string;
};

const SocialButton: React.FC<SocialButtonProps> = ({onPress, icon, title}) => {
  const styles = StyleSheet.create({
    buttonContainer: {
      borderRadius: 16,
      marginTop: 12,
      backgroundColor: '#f6f7f3',
      width: '90%',
      height: 50,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 32,
      paddingVertical: 12,
      gap: 10,
    },
    iconStyle: {
      width: 24,
      height: 24,
      overflow: 'hidden',
    },
    buttonTitle: {
      fontSize: scaledFontWidth(12),
      lineHeight: 22,
      fontWeight: '500',
      fontFamily: AppFonts.general_regular,
      color: '#000',
      textAlign: 'left',
    },
  });

  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
      <Image style={styles.iconStyle} resizeMode="cover" source={icon} />
      <Text style={styles.buttonTitle}>{title}</Text>
    </TouchableOpacity>
  );
};
type Props = {
  navigation: any;
};
const SocialLogin = ({navigation}: Props) => {
  React.useEffect(() => {
    const handleDeepLink = async ({url}) => {
      console.log('Received deep link:', url);

      // Extract the access_token and other params from the URL
      const params = new URLSearchParams(url.split('#')[1]);
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      const expiresIn = params.get('expires_in');

      if (accessToken) {
        const {
          data: {session, user},
          error,
        } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          console.error('Error setting session:', error.message);
          setLoading(false);
          Alert.alert(
            'SignIn error',
            'Unable to retrieve user data. Please try again.',
          );
        } else {
          console.log('Login successful:', user);

          // Now store the user data in your user_profiles table
          await storeUserData(user, session);
        }
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, []);

  // const redirectUrl = 'https://puxbrtbjpgtxoidnlwch.supabase.co/auth/v1/callback';
  // const redirectTo = Linking.createURL('login-callback');  // as we are not using expo so expo linking will not be used

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const redirectTo = 'myapp://login-callback';

  const signInWithProvider = async authProvider => {
    console.log('Signing redirectTo: ', redirectTo);

    setLoading(true);
    const {data, error} = await supabase.auth.signInWithOAuth({
      provider: authProvider,
      options: {
        redirectTo,
      },
    });

    if (error) {
      Alert.alert('Login error', error.message);
      setLoading(false);
    } else {
      // This will open the browser
      console.log('Redirecting to:', data.url);
      // You can use Linking to open the URL in the browser
      Linking.openURL(data.url);
    }
    setLoading(false);
  };

  const storeUserData = async (user, session) => {
    try {
      // First check if user already exists in user_profiles
      const {data: existingUser, error: fetchError} = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // If user doesn't exist, create a new record
      if (!existingUser || fetchError) {
        const localUserData = {
          id: user.id,
          name: user.user_metadata?.full_name || user.user_metadata?.name || '',
          email: user.email || '',
          promo_code: '',
          profile_photo:
            user.user_metadata?.avatar_url || user.user_metadata?.picture || '',
        };

        const {error: insertError} = await supabase
          .from('user_profiles')
          .insert([localUserData]);

        if (insertError) {
          Alert.alert('Error saving user data:', insertError.message);
        } else {
          console.log('User profile created successfully');

          // Update session with additional user data if needed
          const updatedSession = {
            ...session,
            localUserData: localUserData,
          };

          dispatch(updateUser(updatedSession));

          navigation.navigate('ChooseSubscriptionScreen', {
            returnToDashboard: false,
          });
        }
      } else {
        console.log('User already exists in profiles');

        const userData = {
          id: user.id,
          name: user.user_metadata?.name || existingUser?.name || '',
          email: user.email || existingUser?.email || '',
          profile_photo:
            user.user_metadata?.picture || existingUser?.profile_photo || '',
          promo_code: existingUser?.promo_code || '',
        };

        const {error} = await supabase.from('user_profiles').upsert(userData);

        if (error) {
          Alert.alert('Error saving user data:', error.message);
        } else {
          const updatedSession = {
            ...session,
            localUserData: userData,
          };

          dispatch(updateUser(updatedSession));
        }

        // Navigate to appropriate screen
        navigation.navigate('ChooseSubscriptionScreen', {
          returnToDashboard: false,
        });
        // use following when subscription work is done
        // navigation.navigate(existingUser.subscription_status ? 'HomeScreen' : 'ChooseSubscriptionScreen');
      }
    } catch (error) {
      console.error('Error storing user data:', error.message);
      Alert.alert('Error', 'Failed to save user data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContainer
      loading={loading}
      children={
        <View style={styles.container}>
          <Image
            style={{
              width: 48,
              height: 48,
              resizeMode: 'contain',
            }}
            source={AppImages.logo_png}
          />
          <Text style={styles.title}>
            Metermate: Your Energy Efficiency Companion
          </Text>
          <Text style={styles.letsMakeEnergy}>
            Let's make energy management simple and efficient.
          </Text>

          <SocialButton
            onPress={() => {
              navigation.navigate('SignupScreen');
            }}
            icon={AppImages.mail}
            title="Continue with Email"
          />

          <SocialButton
            onPress={() => {
              //By Facebook
              signInWithProvider('facebook');
            }}
            icon={AppImages.facebook}
            title="Continue with Facebook"
          />

          <SocialButton
            onPress={() => {
              //By Google
              signInWithProvider('google');
            }}
            icon={AppImages.google}
            title="Continue with Google"
          />
          {Platform.OS === 'android' && (
            <SocialButton
              onPress={() => {
                //By Apple
                signInWithProvider('apple');
              }}
              icon={AppImages.apple}
              title="Continue with Apple"
            />
          )}

          <View style={styles.rectangleView}>
            <Text
              onPress={() => {
                navigation.goBack();
              }}
              style={styles.dontHaveAn}>
              {'Already have an account? '}{' '}
              <Text
                style={{color: colors.black1, textDecorationLine: 'underline'}}>
                {'Login'}
              </Text>
            </Text>
          </View>
        </View>
      }
    />
  );
};
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
    flex: 1,
    overflow: 'hidden',
    alignItems: 'center', // Center the content horizontally
    justifyContent: 'center', // Center the content vertically
    padding: 20,
  },
  dontHaveAn: {
    fontSize: scaledFontWidth(11),
    letterSpacing: 0,
    lineHeight: 18,
    fontFamily: AppFonts.general_regular,
    color: 'rgba(0, 0, 0, 0.5)',
    textAlign: 'left',
    marginTop: getScaledHeight(15),
  },
  rectangleView: {
    position: 'absolute',
    bottom: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderStyle: 'solid',
    borderColor: '#ededed',
    borderTopWidth: 0.5,
    flex: 1,
    width: '100%',
    height: getScaledHeight(70),
  },
  title: {
    alignSelf: 'stretch',
    fontSize: scaledFontWidth(26),
    letterSpacing: -0.6,
    lineHeight: 34,
    marginTop: 20,
    fontFamily: AppFonts.general_regular,
    color: colors.textColor,
    textAlign: 'center',
  },
  letsMakeEnergy: {
    marginVertical: 10,
    fontSize: scaledFontWidth(14),
    letterSpacing: 0,
    lineHeight: 21,
    fontFamily: AppFonts.general_regular,
    color: '#000',
    textAlign: 'center',
    opacity: 0.8,
  },
});
export default SocialLogin;
