import React, {useRef, useState} from 'react';
import {
  Alert,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import colors from '../../theme/colors';
import {AppFonts} from '../../fonts';
import {AppImages} from '../../images';
import {AppInput} from '../../components/AppInput.js';
import {getScaledHeight, scaledFontWidth} from '../../utils/AppUtils.js';
import {AppButton} from '../../components/AppButton.js';
import {wp} from '../../utils/Dimension.js';
import {useDispatch} from 'react-redux';
import {updateUser} from '../../redux';
import {supabase} from '../../utils/supabase.ts';
import AppContainer from '../../components/AppContainer';
import {KeyboardShift} from '../../utils/KeyboardShift.tsx';

type Props = {
  navigation: any;
};
const LoginScreen = ({navigation}: Props) => {
  const [email, Email] = useState('');
  const [password, Password] = useState('');
  // const [email, Email] = useState('test@gmail.com');
  // const [password, Password] = useState('Hello786@');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  const [generalError, setGeneralError] = useState('');

  const emailInputRef = useRef(null);
  const passwordIRef = useRef(null);
  const dispatch = useDispatch();

  const validateForm = () => {
    Keyboard.dismiss();
    const newErrors: {email?: string; password?: string} = {};
    let isValid = true;

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  async function signInWithEmail() {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    supabase.auth
      .signInWithPassword({
        email: email.trim(),
        password: password,
      })
      .then(async authResponse => {
        const {data, error} = authResponse;
        const {user, session} = data;
        if (error) {
          const newErrors: {email?: string; password?: string} = {};
          if (error.message === 'Invalid login credentials') {
            newErrors.email = 'Entered email is wrong';
            newErrors.password = 'Entered password is wrong';
            setErrors(newErrors);
          } else {
            setGeneralError(error.message);
          }
          console.log(error);
        } else {
          try {
            // Fetch additional user data from 'user_profiles' table
            const {data: profileData, error: profileError} = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', user.id)
              .single();

            if (profileError) {
              console.log('Error fetching user profile:', profileError);
            } else {
              // Add the user profile data to the session object
              session.localUserData = profileData;
            }
            // console.log('session Data:', JSON.stringify(session));

            // Dispatch with updated session
            dispatch(updateUser(session));
          } catch (e) {
            console.log('Error during post-login handling:', e);
          }
        }
      })
      .catch(error => {
        Alert.alert(
          'Login Failed',
          error.message || 'An error occurred. Please try again.',
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <AppContainer loading={loading}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {/* Content that should shift with keyboard */}
          <KeyboardShift>
            <View style={styles.innerContainer}>
              <Image
                style={{width: 48, height: 48, resizeMode: 'contain'}}
                source={AppImages.logo_png}
              />
              <Text style={styles.title}>
                Metermate: Your Energy Efficiency Companion
              </Text>
              <Text style={styles.letsMakeEnergy}>
                Let's make energy management simple and efficient.
              </Text>

              <View style={{width: '100%'}}>
                <AppInput
                  ref={emailInputRef}
                  placeholder={'Email'}
                  isError={errors.email}
                  onChangeText={text => {
                    Email(text);
                    if (errors.email) {
                      setErrors(prev => ({...prev, email: undefined}));
                    }
                  }}
                  value={email}
                  keyboardType="email-address"
                  returnKeyType="next"
                  onSubmitEditing={() => passwordIRef.current?.focus()}
                />
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>

              <View style={{width: '100%'}}>
                <AppInput
                  ref={passwordIRef}
                  placeholder={'Password'}
                  isError={errors.password}
                  onChangeText={text => {
                    Password(text);
                    if (errors.password) {
                      setErrors(prev => ({...prev, password: undefined}));
                    }
                  }}
                  value={password}
                  keyboardType="default"
                  returnKeyType="done"
                  isPassword
                  onSubmitEditing={signInWithEmail}
                />
                {errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
              </View>
              {generalError && (
                <Text style={styles.errorText}>{generalError}</Text>
              )}
              <TouchableWithoutFeedback
                onPress={() => navigation.navigate('ForgotPassword')}>
                <Text
                  style={{
                    marginTop: 10,
                    fontFamily: AppFonts.general_regular,
                    alignSelf: 'flex-end',
                    color: colors.black,
                  }}>
                  {'Forgot password?'}
                </Text>
              </TouchableWithoutFeedback>
              <AppButton
                onPress={signInWithEmail}
                width={wp(90)}
                height={50}
                label={loading ? 'Logging in...' : 'Login'}
                textColor={colors.black}
                backgroundColor={
                  loading ? `${colors.accentColor}99` : colors.accentColor
                }
                isDisable={loading}
                styles={{marginTop: 20}}
                borderRadius={50}
              />
            </View>
          </KeyboardShift>

          {/* Footer (doesn't move with keyboard) */}
          <View style={styles.rectangleView}>
            <Text
              onPress={() => navigation.navigate('SocialLogin')}
              style={styles.dontHaveAn}>
              {"Don't have an account? "}
              <Text
                style={{
                  color: colors.black1,
                  textDecorationLine: 'underline',
                }}>
                Signup
              </Text>
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </AppContainer>
  );
};
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
    padding: 20,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  title: {
    alignSelf: 'stretch',
    fontSize: scaledFontWidth(26),
    letterSpacing: -0.6,
    lineHeight: 34,
    marginTop: 20,
    marginBottom: 20,
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
  rectangleView: {
    position: 'absolute',
    bottom: 1,
    alignItems: 'center',
    borderStyle: 'solid',
    borderColor: '#EDEDED',
    borderTopWidth: 0.5,
    flex: 1,
    width: '100%',
    height: getScaledHeight(70),
    alignSelf: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-start',
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
});
export default LoginScreen;
