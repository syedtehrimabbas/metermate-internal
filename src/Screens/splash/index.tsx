import {Animated, Easing, StyleSheet, View} from 'react-native';
import colors from '../../theme/colors';
import {AppImages} from '../../images';
import React, {useEffect, useRef, useState} from 'react';
import DeviceInfo from 'react-native-device-info';
import {getScaledHeight, scaledFontWidth} from "../../utils/AppUtils.js";
import {AppFonts} from "../../fonts";

const Splash = () => {
    const spinValue = useRef(new Animated.Value(0)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;
    const [animationStarted, AnimationStarted] = useState(false);

    const [appVersion, setAppVersion] = useState('');

    useEffect(() => {
        // Get the version dynamically
        const version = DeviceInfo.getVersion();
        setAppVersion(version);
    }, []);

    useEffect(() => {
        // Spin animation
        Animated.timing(spinValue, {
            toValue: 1,
            duration: 2000, // duration of spin
            easing: Easing.linear,
            useNativeDriver: true,
        }).start(() => {
            // Show text after spin animation
            AnimationStarted(true);
            // Animate text opacity (fade-in)
            Animated.timing(textOpacity, {
                toValue: 1,
                duration: 1000, // duration of text animation
                useNativeDriver: true,
            }).start();
        });
    }, [spinValue, textOpacity]);

    // Map spinValue to rotation
    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.view}>
            <Animated.Image
                style={{
                    width: 88,
                    height: 88,
                    resizeMode: 'contain',
                    transform: [{rotate: spin}],
                }}
                source={AppImages.logo}
            />
            <Animated.Text
                style={[
                    styles.metermate,
                    {opacity: textOpacity}, // Fade-in animation
                ]}
            >{!animationStarted ? '' : 'MeterMate'}</Animated.Text>
            <Animated.Text style={[styles.version]}>{!animationStarted ? '' : `Version ${appVersion}`}</Animated.Text>
        </View>
    );
};


const styles = StyleSheet.create({
    view: {
        width: '100%',
        height: '100%',
        backgroundColor: colors.accentColor,
        flex: 1,
        overflow: 'hidden',
        alignItems: 'center', // Center the content horizontally
        justifyContent: 'center', // Center the content vertically
    },
    metermate: {
        alignSelf: 'stretch',
        fontSize: scaledFontWidth(24),
        fontWeight: '600',
        fontFamily: AppFonts.inter_bold,
        color: '#040b15',
        textAlign: 'center',
        marginTop: getScaledHeight(15),
    },
    version: {
        fontSize: scaledFontWidth(12),
        lineHeight: 18,
        fontFamily: AppFonts.inter_regular,
        color: '#000',
        textAlign: 'center',
        opacity: 0.6,
        position: 'absolute',
        bottom: 50,
    },
});
export default Splash;
