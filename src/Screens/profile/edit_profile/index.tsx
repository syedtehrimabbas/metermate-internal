import React, {useRef, useState} from 'react';
import {
    Image,
    ImageBackground,
    Keyboard,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import {AppImages} from '../../../images';
import {hp, wp} from '../../../utils/Dimension.js';
import {AppButton} from '../../../components/AppButton.js';
import colors from '../../../theme/colors.js';
import {scaledFontWidth} from '../../../utils/AppUtils.js';
import {AppFonts} from '../../../fonts';
import {AppInput} from '../../../components/AppInput.js';

type Props = {
    navigation: any;
};
const EditProfileScreen = ({navigation}: Props) => {

    const [email, Email] = useState('david@gmail.com');
    const [name, Name] = useState('David Sams');
    const [password, Password] = useState('Password');
    const [cpassword, cPassword] = useState('Password');
    const emailInputRef = useRef(null);
    const passwordIRef = useRef(null);
    const cPasswordIRef = useRef(null);

    return <ImageBackground style={
        styles.container
    } source={AppImages.lines_vector} resizeMode={'cover'}>
        <ScrollView style={{flex: 1, height: '100%'}} showsVerticalScrollIndicator={false}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <Pressable style={[styles.parent, {position: 'absolute', start: 0}]} onPress={() => {
                    navigation.goBack();
                }}>
                    <Image style={styles.icon} resizeMode="cover" source={AppImages.ic_cross}/>
                </Pressable>
                <Text style={styles.editAccount}>{'Edit Account'}</Text>

            </View>

            <View style={{alignSelf: 'center', marginTop: hp(10)}}>
                <Image style={{width: 100, height: 100, resizeMode: 'contain'}} source={AppImages.user_placeholder}/>
                <TouchableOpacity><Image
                    style={{width: 28, height: 28, resizeMode: 'contain', position: 'absolute', bottom: 0, right: 5}}
                    source={AppImages.ic_camera}/></TouchableOpacity>
            </View>
            <Text style={styles.userName}>{'David Sams'}</Text>

            <View
                style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 7, alignSelf: 'center'}}>
                <Image style={styles.giftCardIcon} resizeMode="cover" source={AppImages.ic_gift}/>
                <Text style={styles.freeTrial}>{'Free Trial'}</Text>

            </View>
            <AppInput
                placeholder={'Full Name'}
                onChangeText={name => Name(name)}
                value={name}
                keyboardType={'default'}
                returnKeyType="next"
                marginTop={10}
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
                returnKeyType="done"
                isPassword={true}
                onSubmitEditing={() => Keyboard.dismiss} // Move focus to email input
            />

            <AppButton
                onPress={() => {
                    navigation.goBack();
                }}
                width={wp(90)}
                height={50}
                label={'Save Changes'}
                textColor={colors.black}
                backgroundColor={colors.accentColor}
                styles={{marginTop: hp(10)}}/>
        </ScrollView>

    </ImageBackground>;
};

const styles = StyleSheet.create({
        container: {
            width: '100%',
            height: '60%',
            backgroundColor: colors.white,
            flex: 1,
            overflow: 'hidden',
            padding: 20,
        },
        icon: {
            borderRadius: 100,
            flex: 1,
            height: '100%',
            overflow: 'hidden',
            width: '100%',
        },
        parent: {
            height: 24,
            width: 24,
        },
        parentFlexBox: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        userName: {
            alignSelf: 'center',
            fontSize: scaledFontWidth(32),
            letterSpacing: -0.6,
            lineHeight: 34,
            fontWeight: '500',
            fontFamily: AppFonts.inter_regular,
            color: '#100607',
            textAlign: 'left',
            marginTop: hp(5),
        },
        editAccount: {
            fontSize: 20,
            letterSpacing: -0.4,
            lineHeight: 34,
            fontWeight: '500',
            fontFamily: AppFonts.inter_regular,
            color: colors.textColor,
            textAlign: 'center',
        },
        freeTrial: {
            fontSize: 13,
            lineHeight: 20,
            fontWeight: '500',
            fontFamily: AppFonts.inter_regular,
            color: colors.textColor,
            textAlign: 'center',
        },
        giftCardIcon: {
            width: 24,
            height: 24,
        },
    })
;
export default EditProfileScreen;
