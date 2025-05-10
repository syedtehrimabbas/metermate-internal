import React from 'react';
import {Image, ImageSourcePropType, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '../../theme/colors';
import {AppImages} from '../../images';
import {AppFonts} from "../../fonts";
import {getScaledHeight, scaledFontWidth} from "../../utils/AppUtils.js";

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
            <Image style={styles.iconStyle} resizeMode="cover" source={icon}/>
            <Text style={styles.buttonTitle}>{title}</Text>
        </TouchableOpacity>
    );
};
type Props = {
    navigation: any;
};
const SocialLogin = ({navigation}: Props) => {

    return (
        <View
            style={styles.container}>
            <Image
                style={{
                    width: 48,
                    height: 48,
                    resizeMode: 'contain',
                }}
                source={AppImages.logo_png}
            />
            <Text style={styles.title}>Metermate: Your Energy Efficiency Companion</Text>
            <Text style={styles.letsMakeEnergy}>Let's make energy management simple and efficient.</Text>

            <SocialButton
                onPress={() => {
                    navigation.navigate('SignupScreen');
                }}
                icon={AppImages.mail}
                title="Continue with Email"
            />

            <SocialButton
                onPress={() => {
                    console.log('Button pressed');
                }}
                icon={AppImages.facebook}
                title="Continue with Facebook"
            />

            <SocialButton
                onPress={() => {
                    console.log('Button pressed');
                }}
                icon={AppImages.google}
                title="Continue with Google"
            />
            {Platform.OS === 'android' && <SocialButton
                onPress={() => {
                    console.log('Button pressed');
                }}
                icon={AppImages.apple}
                title="Continue with Apple"
            />}

            <View style={styles.rectangleView}>
                <Text onPress={() => {
                    navigation.goBack()
                }} style={styles.dontHaveAn}>{'Already have an account? '} <Text
                    style={{color: colors.black1, textDecorationLine: 'underline'}}>{'Login'}</Text></Text>
            </View>

        </View>
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
