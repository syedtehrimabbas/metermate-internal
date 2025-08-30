import React from 'react';
import {Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '../../theme/colors';
import {AppImages} from '../../images';
import {getScaledHeight, scaledFontWidth} from '../../utils/AppUtils.js';
import {hp, wp} from '../../utils/Dimension.js';
import {AppButton} from '../../components/AppButton.js';
import {AppFonts} from '../../fonts';

type Props = {
    navigation: any;
};
const PaymentCompletedScreen = ({navigation}: Props) => {

    return (
        <ImageBackground style={
            styles.container
        } source={AppImages.lines_vector} resizeMode={'cover'}>
            <View style={{justifyContent: 'center', flex: 1}}>
                <ImageBackground style={styles.starIcon} resizeMode="cover" source={AppImages.star}>
                    <Image style={styles.checkIcon} resizeMode="cover" source={AppImages.black_check}/>
                </ImageBackground>

                <Text style={styles.completed}>Completed!</Text>
                <Text style={styles.youHaveSubscribed}>You have subscribed to yearly membership of the Metermate app.
                    Enjoy your stay here!</Text>

                <AppButton
                    onPress={() => {
                        navigation.reset({
                            index: 0,
                            routes: [{name: "LoginScreen"}]
                        });
                    }}
                    width={wp(40)}
                    height={50}
                    label={'Login'}
                    textColor={colors.black}
                    backgroundColor={colors.accentColor}
                    styles={{alignSelf: 'flex:start'}}
                />

            </View>
        </ImageBackground>
    );
};
const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '60%',
        backgroundColor: colors.inputbg,
        flex: 1,
        overflow: 'hidden',
        padding: 20,
    },
    starIcon: {
        width: 85,
        height: 85,
        resizeMode: 'contain',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        tintColor: colors.black,
    },
    completed: {
        fontSize: scaledFontWidth(20),
        marginTop: hp(5),
        letterSpacing: -0.6,
        lineHeight: 34,
        fontWeight: '500',
        fontFamily: AppFonts.general_regular,
        color: colors.textColor,
        textAlign: 'left',
    },
    youHaveSubscribed: {
        fontSize: scaledFontWidth(15),
        letterSpacing: -0.3,
        lineHeight: 23,
        fontFamily: AppFonts.general_regular,
        color: 'rgba(0, 0, 0, 0.8)',
        textAlign: 'left',
        width: 293,
    },
});
export default PaymentCompletedScreen;
