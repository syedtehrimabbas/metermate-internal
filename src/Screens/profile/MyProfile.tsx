import React from 'react';
import {Image, ImageBackground, Pressable, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {AppImages} from '../../images';
import colors from '../../theme/colors.js';
import {scaledFontWidth} from '../../utils/AppUtils.js';
import {AppFonts} from '../../fonts';
import {hp, wp} from '../../utils/Dimension.js';
import {AppButton} from '../../components/AppButton.js';
import EditProfileScreen from './edit_profile';
import {clearUser} from '../../redux';

type Props = {
    navigation: any;
};
const MyProfileScreen = ({navigation}: Props) => {
    const dispatch = useDispatch(); // Access dispatch

    return <ImageBackground style={
        styles.container
    } source={AppImages.lines_vector} resizeMode={'cover'}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Pressable style={styles.parent} onPress={() => {
                navigation.goBack();
            }}>
                <Image style={styles.icon} resizeMode="cover" source={AppImages.ic_cross}/>
            </Pressable>
            <Pressable style={[styles.frameParent, styles.parentFlexBox]} onPress={() => {
                navigation.navigate(EditProfileScreen);
            }}>
                <View style={[styles.logIn04Parent, styles.parentFlexBox]}>
                    <Image style={styles.logIn04Icon} resizeMode="cover" source={AppImages.ic_edit}/>
                    <Text style={styles.userEmail}>{'Edit'}</Text>
                </View>
            </Pressable>
        </View>

        <Pressable style={{width: 100, height: 100, alignSelf: 'center', marginTop: hp(7)}} onPress={() => {
        }}>
            <Image style={styles.icon} resizeMode="cover" source={AppImages.user_placeholder}/>
        </Pressable>
        <Text style={styles.userName}>David Sams</Text>
        <View style={{marginTop: hp(5)}}>
            <Text style={styles.settingText}>Settings</Text>
            <View style={{flexDirection: 'row', flex: 2, gap: 10, marginTop: 20}}>
                <TouchableOpacity style={styles.tileView} onPress={()=>{
                    navigation.navigate(EditProfileScreen);
                }}>
                    <View style={styles.rectangleView}>
                        <Image style={{width: 24, height: 24}} source={AppImages.ic_profile}/>
                    </View>
                    <Text style={styles.tileTitle}>Account</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.tileView}>
                    <View style={[styles.rectangleView, {backgroundColor: '#91f68f'}]}>
                        <Image style={{width: 24, height: 24}} source={AppImages.ic_wallet}/>
                    </View>
                    <Text style={styles.tileTitle}>Subscription</Text>
                </TouchableOpacity>

            </View>
        </View>
        <AppButton
            onPress={() => {
                dispatch(clearUser());
            }}
            width={wp(90)}
            height={50}
            label={'Log out'}
            textColor={colors.black}
            backgroundColor={'rgba(0, 0, 0, 0.06)'}
            styles={{position: 'absolute', bottom: 20, elevation: 0}}
            borderRadius={undefined}
            isDisable={false}/>
    </ImageBackground>;
};

const styles = StyleSheet.create({
        container: {
            width: '100%',
            height: '60%',
            backgroundColor: colors.accentColor,
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
        logIn04Icon: {
            width: 24,
            height: 24,
            overflow: 'hidden',
        },
        userEmail: {
            fontSize: scaledFontWidth(13),
            letterSpacing: 0,
            lineHeight: 20,
            fontWeight: '500',
            fontFamily: AppFonts.inter_regular,
            color: '#000',
            textAlign: 'left',
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
            marginTop: hp(3),
        },
        settingText: {
            fontSize: scaledFontWidth(16),
            letterSpacing: -0.3,
            lineHeight: 24,
            fontWeight: '500',
            fontFamily: AppFonts.inter_regular,
            color: '#000',
            textAlign: 'left',
        },
        logIn04Parent: {
            width: 63,
            flexDirection: 'row',
            gap: 6,
        },
        frameParent: {
            borderRadius: 118,
            backgroundColor: 'rgba(0, 0, 0, 0.06)',
            width: 100,
            paddingHorizontal: 15,
            paddingVertical: 12,
            overflow: 'hidden',
        },
        tileView: {
            borderRadius: 16,
            backgroundColor: '#fff',
            flex: 1,
            width: '100%',
            height: 143,
            padding: 20,
            justifyContent: 'space-between',
        },
        rectangleView: {
            borderRadius: 10,
            backgroundColor: '#f4cf6e',
            width: 43,
            height: 43,
            justifyContent: 'center',
            alignItems: 'center',
        },
        tileTitle: {
            fontSize: 14,
            lineHeight: 22,
            fontWeight: '500',
            fontFamily: AppFonts.inter_regular,
            color: '#000',
            textAlign: 'left',
        },
    })
;
export default MyProfileScreen;
