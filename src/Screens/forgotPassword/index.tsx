import React, {useState} from 'react';
import {
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
import {supabase} from '../../utils/supabase.ts';
import AppContainer from '../../components/AppContainer';
import {KeyboardShift} from '../../utils/KeyboardShift.tsx';

type Props = {
  navigation: any;
};

const ForgotPasswordScreen = ({navigation}: Props) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleResetPassword = async () => {
    Keyboard.dismiss();
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      // Use your website URL that will handle the redirect to the app
      const redirectUrl = 'https://metermate.co/reset-password';
      const { data, error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: redirectUrl,
      });

      if (resetError) {
        setError(resetError.message || 'Failed to send reset email. Please try again.');
      } else {
        setSuccessMessage('Password reset email sent! Please check your inbox and follow the instructions.');
      }
    } catch (e) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Password reset error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContainer loading={loading}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <KeyboardShift>
            <View style={styles.innerContainer}>
              <Image
                style={{width: 48, height: 48, resizeMode: 'contain'}}
                source={AppImages.logo_png}
              />
              <Text style={styles.title}>Reset Your Password</Text>
              <Text style={styles.subtitle}>
                Enter your email and we'll send you a link to reset your password.
              </Text>

              <View style={{width: '100%'}}>
                <AppInput
                  placeholder={'Email'}
                  onChangeText={text => {
                    setEmail(text);
                    if (error) setError('');
                  }}
                  value={email}
                  keyboardType="email-address"
                  returnKeyType="send"
                  autoCapitalize="none"
                  onSubmitEditing={handleResetPassword}
                />
                {error ? (
                  <Text style={styles.errorText}>{error}</Text>
                ) : successMessage ? (
                  <Text style={styles.successText}>{successMessage}</Text>
                ) : null}
              </View>

              <AppButton
                onPress={handleResetPassword}
                width={wp(90)}
                height={50}
                label={loading ? 'Sending...' : 'Send Reset Link'}
                textColor={colors.black}
                backgroundColor={
                  loading ? `${colors.accentColor}99` : colors.accentColor
                }
                isDisable={loading}
                styles={{marginTop: 20}}
                borderRadius={50}
              />

              <Text
                style={styles.backToLogin}
                onPress={() => navigation.goBack()}>
                Back to Login
              </Text>
            </View>
          </KeyboardShift>
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
  title: {
    alignSelf: 'stretch',
    fontSize: scaledFontWidth(26),
    letterSpacing: -0.6,
    lineHeight: 34,
    marginTop: 20,
    marginBottom: 10,
    fontFamily: AppFonts.general_regular,
    color: colors.textColor,
    textAlign: 'center',
  },
  subtitle: {
    marginVertical: 10,
    fontSize: scaledFontWidth(14),
    letterSpacing: 0,
    lineHeight: 21,
    fontFamily: AppFonts.general_regular,
    color: '#000',
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 30,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  successText: {
    color: 'green',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
    width: '100%',
  },
  backToLogin: {
    marginTop: 20,
    color: colors.black1,
    textDecorationLine: 'underline',
    fontFamily: AppFonts.general_regular,
    fontSize: scaledFontWidth(14),
  },
});

export default ForgotPasswordScreen;
