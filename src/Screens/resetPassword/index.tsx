import React, {useEffect, useState} from 'react';
import {
    Alert,
    Keyboard,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import AppContainer from '../../components/AppContainer';
import {AppInput} from '../../components/AppInput';
import {AppButton} from '../../components/AppButton';
import {wp} from '../../utils/Dimension';
import {supabase} from '../../utils/supabase';
import colors from '../../theme/colors';
import {AppFonts} from '../../fonts';
import {scaledFontWidth} from '../../utils/AppUtils.js';

type Props = {
    navigation: any;
    route?: any;
};

export const ResetPasswordScreen = ({navigation, route}: Props) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [token, setToken] = useState('');

    // Get token from route params
    useEffect(() => {
        if (route?.params?.token) {
            console.log('Token from route params:', route.params.token);
            setToken(route.params.token);
            // Set the session with the token when component mounts
            handleSetSession(route.params.token);
        } else {
            console.log('No token found in route params');
        }
    }, [route?.params]);

    const handleSetSession = async (accessToken: string) => {
        try {
            // Set the session using the access token
            const { data, error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: ''
            });

            if (error) throw error;
            console.log('Session set successfully');
            return data;
        } catch (error) {
            console.error('Error setting session:', error);
            setError('Failed to verify reset link. Please request a new one.');
            return null;
        }
    };

    const handleResetPassword = async () => {
        if (!token) {
            Alert.alert('Error', 'Invalid reset link. Please request a new one.');
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
            // First verify the token is still valid
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

            if (sessionError || !sessionData?.session) {
                // If no session, try to set it again
                const newSession = await handleSetSession(token);
                if (!newSession) throw new Error('Session expired. Please request a new reset link.');
            }

            // Update the password
            const { data, error: updateError } = await supabase.auth.updateUser({
                password: password,
            });

            if (updateError) throw updateError;

            Alert.alert(
                'Success',
                'Your password has been updated successfully',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('LoginScreen'),
                    },
                ]
            );
        } catch (error) {
            console.error('Password reset error:', error);
            setError(error.message || 'Failed to update password. Please try again.');
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
                            {token
                                ? 'Please enter your new password below.'
                                : 'Invalid or expired reset link. Please request a new one.'}
                        </Text>

                        {token ? (
                            <>
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
                                </View>

                                {error ? <Text style={styles.errorText}>{error}</Text> : null}

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
                            </>
                        ) : (
                            <AppButton
                                onPress={() => navigation.navigate('ForgotPassword')}
                                width={wp(90)}
                                height={50}
                                label="Request New Reset Link"
                                textColor={colors.black}
                                backgroundColor={colors.accentColor}
                                styles={{marginTop: 20}}
                                borderRadius={50}
                            />
                        )}
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
        color: colors.textColor,
        opacity: 0.8,
        marginBottom: 30,
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: scaledFontWidth(12),
        marginTop: 5,
        alignSelf: 'flex-start',
        marginLeft: 10,
    },
});

export default ResetPasswordScreen;
