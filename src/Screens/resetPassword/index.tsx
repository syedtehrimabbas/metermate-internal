import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AppContainer from '../../components/AppContainer';
import {AppInput} from '../../components/AppInput';
import {AppButton} from '../../components/AppButton';
import {wp} from '../../utils/Dimension';
import {supabase} from '../../utils/supabase';
import colors from '../../theme/colors';
import {AppFonts} from '../../fonts';
import {scaledFontWidth} from '../../utils/AppUtils.js';

export const ResetPasswordScreen = ({route}: any) => {
  const navigation = useNavigation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    if (route.params?.access_token) {
      setAccessToken(route.params.access_token);
    }
  }, [route.params]);

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const {error} = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        throw error;
      }

      Alert.alert(
        'Success',
        'Your password has been updated successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('LoginScreen'),
          },
        ],
        {cancelable: false},
      );
    } catch (error: any) {
      setError(error.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContainer loading={loading}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <Text style={styles.title}>Reset Your Password</Text>
            <Text style={styles.subtitle}>
              Please enter your new password below.
            </Text>

            <View style={{width: '100%', marginBottom: 20}}>
              <AppInput
                placeholder="New Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                returnKeyType="next"
                autoCapitalize="none"
              />
            </View>

            <View style={{width: '100%', marginBottom: 20}}>
              <AppInput
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                returnKeyType="done"
                autoCapitalize="none"
                onSubmitEditing={handleResetPassword}
              />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>

            <AppButton
              onPress={handleResetPassword}
              width={wp(90)}
              height={50}
              label={loading ? 'Updating...' : 'Update Password'}
              textColor={colors.black}
              backgroundColor={
                loading ? `${colors.accentColor}99` : colors.accentColor
              }
              isDisable={loading}
              styles={{marginTop: 20}}
              borderRadius={50}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </AppContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  innerContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: scaledFontWidth(26),
    fontFamily: AppFonts.general_regular,
    color: colors.textColor,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: scaledFontWidth(14),
    fontFamily: AppFonts.general_regular,
    color: '#000',
    opacity: 0.8,
    marginBottom: 30,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
    alignSelf: 'flex-start',
  },
});

export default ResetPasswordScreen;
