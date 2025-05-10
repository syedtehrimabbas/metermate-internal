import React, { useRef, useState } from 'react';
import {
  Alert,
  Image,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../../theme/colors';
import { AppFonts } from '../../fonts';
import { AppImages } from '../../images';
import { AppInput } from '../../components/AppInput.js';
import { scaledFontWidth } from '../../utils/AppUtils.js';
import { AppButton } from '../../components/AppButton.js';
import { wp } from '../../utils/Dimension.js';
import { supabase } from '../../utils/supabase.ts';
import AppContainer from '../../components/AppContainer';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  navigation: any;
};
const SignupScreen = ({ navigation }: Props) => {
  const [email, Email] = useState('');
  const [name, Name] = useState('');
  const [password, Password] = useState('');
  const [cpassword, cPassword] = useState('');
  const [promoCode, PromoCode] = useState<string | undefined>();
  const [isTermsAccepted, acceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailInputRef = useRef(null);
  const passwordIRef = useRef(null);
  const cPasswordIRef = useRef(null);
  const promoRef = useRef(null);

  async function signUpWithEmail() {
    // Validate name
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter your full name.');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }

    // Validate password
    if (password.length < 6) {
      Alert.alert(
        'Validation Error',
        'Password must be at least 6 characters long.',
      );
      return;
    }

    // Validate confirm password
    if (password !== cpassword) {
      Alert.alert('Validation Error', 'Passwords do not match.');
      return;
    }

    // Optional: Validate promo code (if required)
    if (promoCode && promoCode.length > 20) {
      Alert.alert('Validation Error', 'Promo code is too long.');
      return;
    }

    setLoading(true);
    await supabase.auth
      .signUp({
        email: email,
        password: password,
      })
      .then(response => {
        const { user } = response.data;
        if (user) {
          storeUserData(user);
        }
      })
      .catch(error => {
        console.error(error);
        Alert.alert(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const storeUserData = async user => {
    // Insert additional user data into the 'users' table
    const { error: insertError } = await supabase.from('user_profiles').insert([
      {
        id: user.id,
        name: name,
        email: email,
        promo_code: promoCode,
        profile_photo: '',
      },
    ]);

    if (insertError) {
      Alert.alert('Error saving user data:', insertError.message);
    } else {
      // User data saved successfully
      // Save user ID in AsyncStorage
      try {
        await AsyncStorage.setItem('user_data', JSON.stringify(user) || '');
      } catch (e) {
        console.log('Error saving user to AsyncStorage:', e);
      }

      navigation.navigate('ChooseSubscriptionScreen');
    }
  };

  return (
    <AppContainer
      loading={loading}
      children={
        <View style={styles.container}>
          <Text
            style={{
              fontSize: scaledFontWidth(26),
              letterSpacing: -0.6,
              lineHeight: 34,
              marginTop: 20,
              fontWeight: '500',
              fontFamily: AppFonts.general_regular,
              color: colors.textColor,
            }}>
            {'Sign up'}
          </Text>

          <Text
            style={{
              fontSize: scaledFontWidth(14),
              letterSpacing: 0,
              lineHeight: 21,
              fontFamily: AppFonts.general_regular,
              color: '#000',
              opacity: 0.8,
            }}>
            {'Enter your details for sign up.'}
          </Text>

          <View style={{ alignSelf: 'center', marginVertical: 30 }}>
            <Image
              style={{ width: 100, height: 100, resizeMode: 'contain' }}
              source={AppImages.signup_image_ph}
            />
            <TouchableOpacity>
              <Image
                style={{
                  width: 28,
                  height: 28,
                  resizeMode: 'contain',
                  position: 'absolute',
                  bottom: 0,
                  right: 5,
                }}
                source={AppImages.plus_icon}
              />
            </TouchableOpacity>
          </View>

          <ScrollView>
            <AppInput
              placeholder={'Full Name'}
              onChangeText={name => Name(name)}
              value={name}
              keyboardType={'default'}
              returnKeyType="next"
              marginTop={2}
              onSubmitEditing={() => emailInputRef.current?.focus()} // Move focus to email input
            />

            <AppInput
              ref={emailInputRef} // Attach ref to the email input
              placeholder={'Email'}
              onChangeText={text => Email(text)}
              value={email}
              keyboardType={'email-address'}
              returnKeyType="next"
              onSubmitEditing={() => passwordIRef.current?.focus()} // Move focus to email input
            />
            <AppInput
              ref={passwordIRef}
              placeholder={'Password'}
              onChangeText={text => Password(text)}
              value={password}
              keyboardType={'default'}
              returnKeyType="next"
              isPassword={true}
              onSubmitEditing={() => cPasswordIRef.current?.focus()} // Move focus to email input
            />

            <AppInput
              ref={cPasswordIRef}
              placeholder={'Validate Password'}
              onChangeText={text => cPassword(text)}
              value={cpassword}
              keyboardType={'default'}
              returnKeyType="next"
              isPassword={true}
              onSubmitEditing={() => promoRef.current?.focus()} // Move focus to email input
            />

            <Text
              style={{
                marginVertical: 10,
                fontSize: scaledFontWidth(12),
                lineHeight: 22,
                fontWeight: '500',
                fontFamily: AppFonts.general_regular,
                color: colors.black,
                textAlign: 'left',
              }}>
              {'Promo Code (Optional)'}
            </Text>

            <AppInput
              ref={promoRef}
              placeholder={'Metermate 10%'}
              onChangeText={text => PromoCode(text)}
              value={promoCode}
              keyboardType={'default'}
              returnKeyType="done"
              onSubmitEditing={() => Keyboard.dismiss} // Move focus to email input
            />

            {/*Privacy policy section START*/}

            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginTop: 20,
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: isTermsAccepted
                    ? colors.black
                    : colors.white,
                  borderColor: colors.black,
                  borderWidth: 1,
                  width: 17,
                  height: 17,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginEnd: 10,
                  borderRadius: 5,
                }}
                onPress={() => {
                  acceptTerms(!isTermsAccepted);
                }}>
                <Image
                  style={{
                    width: 10,
                    height: 10,
                    resizeMode: 'contain',
                    tintColor: isTermsAccepted ? colors.white : colors.black,
                  }}
                  source={AppImages.white_check}
                />
              </TouchableOpacity>
              <Text
                style={{
                  fontSize: scaledFontWidth(11),
                  lineHeight: 18,
                  fontFamily: AppFonts.inter_regular,
                  color: '#585757',
                  textAlign: 'center',
                }}>
                {'I agree with'}
                <Text style={{ color: colors.black }}>{' Terms'}</Text>
                <Text>{' and'}</Text>
                <Text style={{ color: colors.black }}>{' Privacy'}</Text>
              </Text>
            </View>

            {/*Privacy policy section END*/}

            <AppButton
              onPress={() => {
                if (isTermsAccepted) {
                  signUpWithEmail();
                } else {
                  Alert.alert('Please accept the terms and conditions');
                }
              }}
              width={wp(90)}
              height={50}
              label={'Continue'}
              textColor={colors.black}
              backgroundColor={colors.accentColor}
            />
          </ScrollView>
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
    padding: 20,
  },
});
export default SignupScreen;
